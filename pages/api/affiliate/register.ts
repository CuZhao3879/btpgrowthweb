/**
 * API: Register an affiliate (V2 — with username + password)
 * POST /api/affiliate/register
 *
 * Body: { source_app, source_user_id, email, display_name, username, password, parent_referral_code? }
 * Returns: affiliate object (or already_member flag if email exists)
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'BTP_'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, email, display_name, username, password, parent_referral_code, avatar_url } = req.body

    if (!source_app || !source_user_id) {
      return res.status(400).json({ error: 'source_app and source_user_id are required' })
    }
    if (!email) {
      return res.status(400).json({ error: 'email is required' })
    }
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' })
    }

    // Validate username format: 3-20 chars, alphanumeric + underscore
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

    const emailClean = email.trim().toLowerCase()

    // -------------------------------------------------------
    // Check 1: Does this app user already have a connection?
    // -------------------------------------------------------
    const { data: existingConn } = await supabaseAdmin
      .from('affiliate_connections')
      .select('affiliate_id')
      .eq('source_app', source_app)
      .eq('source_user_id', source_user_id)
      .single()

    if (existingConn) {
      // Already registered from this app — fetch and return their data
      const { data: existing } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('id', existingConn.affiliate_id)
        .single()

      if (existing) {
        return res.status(200).json({ affiliate: existing, is_new: false })
      }
    }

    // -------------------------------------------------------
    // Check 2: Does this email already exist? (multi-app join)
    // -------------------------------------------------------
    const { data: existingByEmail } = await supabaseAdmin
      .from('affiliates')
      .select('id, username, referral_code, display_name, avatar_url')
      .eq('email', emailClean)
      .single()

    if (existingByEmail) {
      // Link this app's user to the existing affiliate
      await supabaseAdmin
        .from('affiliate_connections')
        .insert({
          affiliate_id: existingByEmail.id,
          source_app,
          source_user_id,
        })
        .single()

      if (avatar_url && !existingByEmail.avatar_url) {
        // Opportunistically save the avatar if the existing account doesn't have one yet
        await supabaseAdmin.from('affiliates').update({ avatar_url }).eq('id', existingByEmail.id)
      }

      return res.status(200).json({
        already_member: true,
        username: existingByEmail.username,
        referral_code: existingByEmail.referral_code,
        display_name: existingByEmail.display_name,
      })
    }

    // -------------------------------------------------------
    // Check 3: Is username taken?
    // -------------------------------------------------------
    const { data: existingUsername } = await supabaseAdmin
      .from('affiliates')
      .select('id')
      .eq('username', usernameClean)
      .single()

    if (existingUsername) {
      return res.status(409).json({
        error: 'This username is already taken. Please choose another.',
        code: 'USERNAME_TAKEN',
      })
    }

    // -------------------------------------------------------
    // Create: Generate referral code + hash password
    // -------------------------------------------------------

    // Look up parent if a referral code was provided
    let parent_id = null
    if (parent_referral_code) {
      const { data: parent } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('referral_code', parent_referral_code)
        .single()
      if (parent) parent_id = parent.id
    }

    // Generate unique referral code
    let referral_code = generateReferralCode()
    let attempts = 0
    while (attempts < 10) {
      const { data: check } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('referral_code', referral_code)
        .single()
      if (!check) break
      referral_code = generateReferralCode()
      attempts++
    }

    // Generate unique btp_login_id (8-digit numeric string)
    let btp_login_id = Math.floor(Math.random() * 90000000 + 10000000).toString()
    let loginIdAttempts = 0
    while (loginIdAttempts < 10) {
      const { data: checkLoginId } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('btp_login_id', btp_login_id)
        .single()
      if (!checkLoginId) break
      btp_login_id = Math.floor(Math.random() * 90000000 + 10000000).toString()
      loginIdAttempts++
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert affiliate
    const { data: newAffiliate, error } = await supabaseAdmin
      .from('affiliates')
      .insert({
        email: emailClean,
        display_name,
        username: usernameClean,
        password_hash,
        referral_code,
        btp_login_id,
        parent_id,
        avatar_url,
        tier: 'starter',
        // Keep source_app and source_user_id for backward compat during migration
        source_app,
        source_user_id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating affiliate:', error)
      return res.status(500).json({ error: 'Failed to create affiliate' })
    }

    // Create affiliate_connection
    await supabaseAdmin
      .from('affiliate_connections')
      .insert({
        affiliate_id: newAffiliate.id,
        source_app,
        source_user_id,
      })

    return res.status(201).json({ affiliate: newAffiliate, is_new: true })
  } catch (err) {
    console.error('Register affiliate error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
