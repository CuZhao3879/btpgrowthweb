/**
 * API: Register or get an affiliate
 * POST /api/affiliate/register
 * 
 * Body: { source_app, source_user_id, email?, display_name?, parent_referral_code? }
 * Returns: affiliate object with referral_code
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'BTP_'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate an 8-character numeric ID (e.g. 83901234)
function generateLoginId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, email, display_name, parent_referral_code } = req.body

    if (!source_app || !source_user_id) {
      return res.status(400).json({ error: 'source_app and source_user_id are required' })
    }

    // Check if affiliate already exists
    const { data: existing } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('source_app', source_app)
      .eq('source_user_id', source_user_id)
      .single()

    if (existing) {
      return res.status(200).json({ affiliate: existing, is_new: false })
    }

    // Look up parent if a referral code was provided
    let parent_id = null
    if (parent_referral_code) {
      const { data: parent } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('referral_code', parent_referral_code)
        .single()

      if (parent) {
        parent_id = parent.id
      }
    }

    // Generate unique referral code and login ID
    let referral_code = generateReferralCode()
    let btp_login_id = generateLoginId()
    let attempts = 0
    while (attempts < 10) {
      // Check both code and login ID for uniqueness
      const { data: check } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .or(`referral_code.eq.${referral_code},btp_login_id.eq.${btp_login_id}`)
        .single()

      if (!check) break
      referral_code = generateReferralCode()
      btp_login_id = generateLoginId()
      attempts++
    }

    // Create new affiliate
    const { data: newAffiliate, error } = await supabaseAdmin
      .from('affiliates')
      .insert({
        source_app,
        source_user_id,
        email,
        display_name,
        btp_login_id,
        referral_code,
        parent_id,
        tier: 'starter',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating affiliate:', error)
      return res.status(500).json({ error: 'Failed to create affiliate' })
    }

    return res.status(201).json({ affiliate: newAffiliate, is_new: true })
  } catch (err) {
    console.error('Register affiliate error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
