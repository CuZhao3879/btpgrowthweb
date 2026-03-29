/**
 * API: Complete affiliate profile setup (for migrated users)
 * POST /api/affiliate/setup-profile
 *
 * Body: { source_app, source_user_id, username, password }
 * Returns: { success, affiliate }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, username, password, avatar_url } = req.body

    if (!source_app || !source_user_id) {
      return res.status(400).json({ error: 'source_app and source_user_id are required' })
    }
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' })
    }

    // Validate username: 3-20 chars, alphanumeric + underscore
    const usernameClean = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,20}$/.test(usernameClean)) {
      return res.status(400).json({
        error: 'Username must be 3-20 characters, letters, numbers, or underscore only',
        code: 'INVALID_USERNAME',
      })
    }

    // Validate password: at least 6 chars
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
        code: 'WEAK_PASSWORD',
      })
    }

    // Find affiliate via connection or direct lookup
    let affiliate: any = null

    const { data: conn } = await supabaseAdmin
      .from('affiliate_connections')
      .select('affiliate_id')
      .eq('source_app', source_app)
      .eq('source_user_id', source_user_id)
      .single()

    if (conn) {
      const { data: found } = await supabaseAdmin
        .from('affiliates')
        .select('id, username, password_hash')
        .eq('id', conn.affiliate_id)
        .single()
      affiliate = found
    }

    // Fallback: legacy direct lookup
    if (!affiliate) {
      const { data: found } = await supabaseAdmin
        .from('affiliates')
        .select('id, username, password_hash')
        .eq('source_app', source_app)
        .eq('source_user_id', source_user_id)
        .single()
      affiliate = found
    }

    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' })
    }

    // Only allow setup if password hasn't been set yet
    if (affiliate.password_hash) {
      return res.status(400).json({
        error: 'Profile already set up. Use forgot password to change credentials.',
        code: 'ALREADY_SETUP',
      })
    }

    // Check if new username is taken by someone else
    if (usernameClean !== affiliate.username) {
      const { data: existingUsername } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('username', usernameClean)
        .single()

      if (existingUsername && existingUsername.id !== affiliate.id) {
        return res.status(409).json({
          error: 'This username is already taken. Please choose another.',
          code: 'USERNAME_TAKEN',
        })
      }
    }

    // Hash password and update
    const password_hash = await bcrypt.hash(password, 10)

    const updatePayload: any = {
      username: usernameClean,
      password_hash,
      updated_at: new Date().toISOString(),
    }
    if (avatar_url) {
      updatePayload.avatar_url = avatar_url
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('affiliates')
      .update(updatePayload)
      .eq('id', affiliate.id)
      .select('id, username, referral_code, display_name, email, avatar_url')
      .single()

    if (updateError) {
      console.error('Setup profile error:', updateError)
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    return res.status(200).json({
      success: true,
      affiliate: updated,
    })
  } catch (err) {
    console.error('Setup profile error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
