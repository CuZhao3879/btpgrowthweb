/**
 * API: Request password reset OTP
 * POST /api/affiliate/forgot-password
 *
 * Body: { email }
 * Returns: { success, message }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendOtpEmail } from '@/lib/email'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const emailClean = email.trim().toLowerCase()

    // Check if affiliate exists with this email
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, email')
      .eq('email', emailClean)
      .single()

    // Always return success even if email not found (security: don't leak existence)
    if (!affiliate) {
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, you will receive a verification code.',
      })
    }

    // Rate limit: max 1 OTP per 60 seconds per email
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const { data: recentOtp } = await supabaseAdmin
      .from('password_resets')
      .select('id')
      .eq('email', emailClean)
      .gte('created_at', sixtySecondsAgo)
      .limit(1)
      .single()

    if (recentOtp) {
      return res.status(429).json({
        error: 'Please wait 60 seconds before requesting another code.',
      })
    }

    // Invalidate any existing unused OTPs for this email
    await supabaseAdmin
      .from('password_resets')
      .update({ used: true })
      .eq('email', emailClean)
      .eq('used', false)

    // Generate new OTP with 10 minute expiry
    const otpCode = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabaseAdmin
      .from('password_resets')
      .insert({
        email: emailClean,
        otp_code: otpCode,
        expires_at: expiresAt,
      })

    // Send email
    const sent = await sendOtpEmail(emailClean, otpCode)

    if (!sent) {
      console.error('Failed to send OTP email to', emailClean)
      // Still return success to not leak info, but log internally
    }

    return res.status(200).json({
      success: true,
      message: 'If this email is registered, you will receive a verification code.',
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
