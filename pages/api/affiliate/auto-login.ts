/**
 * API: Auto-Login for Vronk AI Affiliates
 * GET /api/affiliate/auto-login?token=XXX
 *
 * Verifies a signed token from Vronk AI, finds (or creates) the affiliate,
 * issues a BTP JWT, and returns a small HTML page that stores the
 * JWT in localStorage before redirecting to the dashboard.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { signAffiliateToken } from '@/lib/affiliate-jwt'

const APP_ID = 'vronk_ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.query

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing token', step: 'validate_input' })
  }

  const secret = process.env.VRONK_AI_WEBHOOK_SECRET
  if (!secret) {
    return res.status(500).json({
      error: 'VRONK_AI_WEBHOOK_SECRET not configured on BTP Growth',
      step: 'check_secret',
    })
  }

  try {
    // Step 1: Split token
    const parts = token.split('.')
    if (parts.length !== 2) {
      return res.status(400).json({ error: 'Invalid token format', step: 'split_token' })
    }

    const [payloadB64, signature] = parts

    // Step 2: Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url')

    if (signature !== expectedSig) {
      return res.status(401).json({ error: 'Invalid token signature', step: 'verify_signature' })
    }

    // Step 3: Decode payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

    if (!payload.userId || !payload.exp) {
      return res.status(400).json({ error: 'Invalid token payload', step: 'decode_payload', payload })
    }

    // Step 4: Check expiry
    if (Date.now() > payload.exp) {
      return res.status(401).json({ error: 'Token expired', step: 'check_expiry' })
    }

    // Step 5: Check Supabase config
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: 'Supabase env vars missing on BTP Growth Vercel',
        step: 'check_supabase_env',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      })
    }

    // Step 6: Find the affiliate in BTP database (by source_app + source_user_id)
    const { data: existingAffiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, username, email')
      .eq('source_app', APP_ID)
      .eq('source_user_id', payload.userId)
      .single()

    let affiliate = existingAffiliate

    // Step 6b: Fallback — find by email if source lookup failed
    if (!affiliate && payload.email) {
      const { data: emailMatch } = await supabaseAdmin
        .from('affiliates')
        .select('id, username, email')
        .eq('email', payload.email)
        .single()

      if (emailMatch) {
        // Link existing record to Vronk AI
        await supabaseAdmin
          .from('affiliates')
          .update({ source_app: APP_ID, source_user_id: payload.userId })
          .eq('id', emailMatch.id)

        // Also ensure affiliate_connection exists
        const { data: existingConn } = await supabaseAdmin
          .from('affiliate_connections')
          .select('id')
          .eq('affiliate_id', emailMatch.id)
          .eq('source_app', APP_ID)
          .single()

        if (!existingConn) {
          await supabaseAdmin.from('affiliate_connections').insert({
            affiliate_id: emailMatch.id,
            source_app: APP_ID,
            source_user_id: payload.userId,
          })
        }

        affiliate = emailMatch
      }
    }

    // Step 7: Auto-create if still not found
    if (!affiliate) {
      // Generate unique BTP login ID
      let btpLoginId: string = ''
      for (let i = 0; i < 10; i++) {
        btpLoginId = Math.floor(Math.random() * 90000000 + 10000000).toString()
        const { data: conflict } = await supabaseAdmin
          .from('affiliates')
          .select('id')
          .eq('btp_login_id', btpLoginId)
          .single()
        if (!conflict) break
      }

      const tempUsername = `user_${payload.userId.replace(/-/g, '').substring(0, 8).toLowerCase()}`

      const { data: newAffiliate, error: insertErr } = await supabaseAdmin.from('affiliates').insert({
        source_app: APP_ID,
        source_user_id: payload.userId,
        email: payload.email,
        referral_code: payload.referralCode || `VRK${payload.userId.replace(/-/g, '').substring(0, 8).toUpperCase()}`,
        btp_login_id: btpLoginId,
        username: tempUsername,
        tier: 'starter',
      }).select('id, username, email').single()

      if (insertErr || !newAffiliate) {
        return res.status(500).json({
          error: 'Failed to create affiliate record',
          step: 'create_affiliate',
          detail: insertErr?.message || 'Unknown insert error',
        })
      }

      // Create affiliate_connection
      await supabaseAdmin.from('affiliate_connections').insert({
        affiliate_id: newAffiliate.id,
        source_app: APP_ID,
        source_user_id: payload.userId,
      })

      // Ensure app exists
      await supabaseAdmin
        .from('apps')
        .upsert({
          id: APP_ID,
          name: 'Vronk AI',
          icon_url: 'https://vronkai.com/icons/vronk-logo.png',
          tier_rates: {
            starter: { t1: 0.20, t2: 0 },
            pro: { t1: 0.20, t2: 0.05 },
            elite: { t1: 0.20, t2: 0.05 },
            partner: { t1: 0.25, t2: 0.05 },
          },
          is_active: true,
        }, { onConflict: 'id' })

      affiliate = newAffiliate
    }

    if (!affiliate) {
      return res.status(500).json({ error: 'Affiliate is null after all steps', step: 'final_check' })
    }

    // Step 8: Issue JWT and return HTML that stores it in localStorage
    const jwt = signAffiliateToken(affiliate.id, affiliate.username || affiliate.email)

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Redirecting to Dashboard...</title>
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #64748b;
    }
    .loader { text-align: center; }
    .spinner {
      width: 32px; height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Signing you in...</p>
  </div>
  <script>
    try {
      localStorage.setItem('btp_affiliate_token', ${JSON.stringify(jwt)});
      window.location.replace('/affiliate/dashboard');
    } catch(e) {
      document.querySelector('p').textContent = 'Error: ' + e.message;
    }
  </script>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(html)
  } catch (err: any) {
    return res.status(500).json({
      error: 'Unhandled error in auto-login',
      step: 'catch_block',
      detail: err?.message || String(err),
    })
  }
}
