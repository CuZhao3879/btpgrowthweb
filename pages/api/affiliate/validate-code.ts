/**
 * API: Validate a referral code
 * POST /api/affiliate/validate-code
 * 
 * Body: { referral_code, app_id?, user_id? }
 * Returns: { valid, affiliate_display_name, discount_percent }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { referral_code, app_id = 'monvo_ai', user_id } = req.body

    if (!referral_code) {
      return res.status(400).json({ error: 'referral_code is required' })
    }

    // Look up the affiliate by referral code
    const { data: affiliate, error } = await supabaseAdmin
      .from('affiliates')
      .select('id, display_name, referral_code, source_user_id')
      .eq('referral_code', referral_code.toUpperCase().trim())
      .single()

    if (error || !affiliate) {
      return res.status(200).json({ valid: false, message: 'Invalid referral code' })
    }

    // Prevent self-referral
    if (user_id && affiliate.source_user_id === user_id) {
      return res.status(200).json({ valid: false, message: 'Cannot use your own referral code' })
    }

    // Check if this user was already referred in this app
    if (user_id) {
      const { data: existingReferral } = await supabaseAdmin
        .from('referrals')
        .select('id')
        .eq('app_id', app_id)
        .eq('referred_user_id', user_id)
        .single()

      if (existingReferral) {
        return res.status(200).json({
          valid: true,
          already_referred: true,
          affiliate_display_name: affiliate.display_name || 'A friend',
          discount_percent: 30,
          message: 'You have already been referred'
        })
      }
    }

    return res.status(200).json({
      valid: true,
      already_referred: false,
      affiliate_display_name: affiliate.display_name || 'A friend',
      discount_percent: 30,
    })
  } catch (err) {
    console.error('Validate code error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
