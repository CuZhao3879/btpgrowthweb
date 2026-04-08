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
    return res.redirect('/affiliate/dashboard?error=missing_token')
  }

  const secret = process.env.VRONK_AI_WEBHOOK_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // Split token: payload.signature
    const parts = token.split('.')
    if (parts.length !== 2) {
      return res.redirect('/affiliate/dashboard?error=invalid_token')
    }

    const [payloadB64, signature] = parts

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url')

    if (signature !== expectedSig) {
      return res.redirect('/affiliate/dashboard?error=invalid_signature')
    }

    // Decode and validate payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

    if (!payload.userId || !payload.exp) {
      return res.redirect('/affiliate/dashboard?error=invalid_payload')
    }

    // Check expiry
    if (Date.now() > payload.exp) {
      return res.redirect('/affiliate/dashboard?error=token_expired')
    }

    // Find the affiliate in BTP database
    let { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, username, email')
      .eq('source_app', APP_ID)
      .eq('source_user_id', payload.userId)
      .single()

    // Auto-create if affiliate doesn't exist yet (webhook may have been missed)
    if (!affiliate) {
      console.log(`[Auto-Login] Affiliate not found, auto-creating for: ${payload.email}`)

      // Generate unique BTP login ID
      let btpLoginId: string
      while (true) {
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
      }).select().single()

      if (insertErr || !newAffiliate) {
        console.error('[Auto-Login] Failed to create affiliate:', insertErr)
        return res.redirect('/affiliate/dashboard?error=create_failed')
      }

      // Also create affiliate_connection
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

    // Final null guard (should never happen after auto-create above)
    if (!affiliate) {
      return res.redirect('/affiliate/dashboard?error=create_failed')
    }

    // Issue a BTP dashboard JWT (same format as manual login)
    const jwt = signAffiliateToken(affiliate.id, affiliate.username || affiliate.email)

    // Return a small HTML page that stores the JWT in localStorage and redirects
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
    localStorage.setItem('btp_affiliate_token', ${JSON.stringify(jwt)});
    window.location.replace('/affiliate/dashboard');
  </script>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html')
    return res.status(200).send(html)
  } catch (err) {
    console.error('[Auto-Login] Error:', err)
    return res.redirect('/affiliate/dashboard?error=auth_failed')
  }
}
