/**
 * API: Reset password using OTP
 * POST /api/affiliate/reset-password
 *
 * Body: { email, otp, new_password }
 * Returns: { success, username }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, otp, new_password } = req.body

    if (!email || !otp || !new_password) {
      return res.status(400).json({ error: 'email, otp, and new_password are required' })
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const emailClean = email.trim().toLowerCase()
    const otpClean = otp.trim().replace(/\s/g, '') // Remove spaces (user might type "492 104")

    // Find valid OTP
    const { data: resetRecord, error: otpError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('email', emailClean)
      .eq('otp_code', otpClean)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (otpError || !resetRecord) {
      return res.status(400).json({
        error: 'Invalid or expired verification code. Please request a new one.',
        code: 'INVALID_OTP',
      })
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetRecord.id)

    // Hash new password
    const password_hash = await bcrypt.hash(new_password, 10)

    // Update affiliate's password
    const { data: affiliate, error: updateError } = await supabaseAdmin
      .from('affiliates')
      .update({ password_hash, updated_at: new Date().toISOString() })
      .eq('email', emailClean)
      .select('username')
      .single()

    if (updateError || !affiliate) {
      return res.status(500).json({ error: 'Failed to update password' })
    }

    return res.status(200).json({
      success: true,
      username: affiliate.username,
      message: 'Password has been reset successfully. You can now log in.',
    })
  } catch (err) {
    console.error('Reset password error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
