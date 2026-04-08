/**
 * API: Auto-Login for Vronk AI Affiliates
 * GET /api/affiliate/auto-login?token=XXX
 *
 * Verifies a signed token from Vronk AI, finds the affiliate,
 * issues a BTP JWT, and returns a small HTML page that stores the
 * JWT in localStorage before redirecting to the dashboard.
 *
 * We can't just set a cookie because the dashboard reads from localStorage.
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
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, username, email')
      .eq('source_app', APP_ID)
      .eq('source_user_id', payload.userId)
      .single()

    if (!affiliate) {
      return res.redirect('/affiliate/dashboard?error=not_found')
    }

    // Issue a BTP dashboard JWT (same format as manual login)
    const jwt = signAffiliateToken(affiliate.id, affiliate.username || affiliate.email)

    // Return a small HTML page that stores the JWT in localStorage and redirects
    // This is necessary because the dashboard reads auth from localStorage, not cookies
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
    .loader {
      text-align: center;
    }
    .spinner {
      width: 32px;
      height: 32px;
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
