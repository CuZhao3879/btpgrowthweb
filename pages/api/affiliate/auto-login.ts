/**
 * API: Auto-Login for Vronk AI Affiliates
 * GET /api/affiliate/auto-login?token=XXX
 *
 * Verifies a signed token from Vronk AI, finds the affiliate,
 * issues a JWT session cookie, and redirects to the dashboard.
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
    return res.status(400).json({ error: 'Missing token' })
  }

  const secret = process.env.VRONK_AI_WEBHOOK_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // Split token: payload.signature
    const parts = token.split('.')
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Invalid token format' })
    }

    const [payloadB64, signature] = parts

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url')

    if (signature !== expectedSig) {
      return res.status(401).json({ error: 'Invalid token signature' })
    }

    // Decode and validate payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

    if (!payload.userId || !payload.exp) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    // Check expiry
    if (Date.now() > payload.exp) {
      return res.status(401).json({ error: 'Token expired' })
    }

    // Find the affiliate in BTP database
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, username, email')
      .eq('source_app', APP_ID)
      .eq('source_user_id', payload.userId)
      .single()

    if (!affiliate) {
      // Redirect to dashboard with error — affiliate not found in BTP
      return res.redirect('/affiliate/dashboard?error=not_found')
    }

    // Issue JWT session
    const jwt = signAffiliateToken(affiliate.id, affiliate.username || affiliate.email)

    // Set JWT as httpOnly cookie
    res.setHeader('Set-Cookie', [
      `affiliate_token=${jwt}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    ])

    // Redirect to dashboard
    return res.redirect('/affiliate/dashboard')
  } catch (err) {
    console.error('[Auto-Login] Error:', err)
    return res.redirect('/affiliate/dashboard?error=auth_failed')
  }
}
