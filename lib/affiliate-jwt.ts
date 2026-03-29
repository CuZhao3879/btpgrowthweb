/**
 * JWT utility for Affiliate session management.
 * 
 * Uses a shared secret to sign/verify tokens.
 * Token contains: affiliate_id, username
 * Expires in 7 days by default.
 */
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.AFFILIATE_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'btp-growth-affiliate-secret-key-change-me'

export interface AffiliateTokenPayload {
  sub: string       // affiliate_id
  username: string
}

/**
 * Sign a new JWT for an authenticated affiliate.
 */
export function signAffiliateToken(affiliateId: string, username: string): string {
  return jwt.sign(
    { sub: affiliateId, username } as AffiliateTokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * Verify and decode an affiliate JWT.
 * Returns the payload if valid, null if invalid/expired.
 */
export function verifyAffiliateToken(token: string): AffiliateTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AffiliateTokenPayload
    return decoded
  } catch {
    return null
  }
}
