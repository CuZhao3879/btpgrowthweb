/**
 * API: Get affiliate dashboard data
 * POST /api/affiliate/dashboard
 * 
 * Body: { source_app, source_user_id }
 * Returns: full dashboard data (earnings, referrals, tier info)
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id } = req.body

    if (!source_app || !source_user_id) {
      return res.status(400).json({ error: 'source_app and source_user_id are required' })
    }

    // Get affiliate profile
    const { data: affiliate, error } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('source_app', source_app)
      .eq('source_user_id', source_user_id)
      .single()

    if (error || !affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' })
    }

    // Get referral stats
    const { data: referrals } = await supabaseAdmin
      .from('referrals')
      .select('id, app_id, referred_user_id, has_subscribed, created_at')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })

    // Get direct sub-affiliates (people who registered using this affiliate's code)
    const { data: directTeam } = await supabaseAdmin
      .from('affiliates')
      .select('id, display_name, referral_code, tier, total_paid_referrals, created_at')
      .eq('parent_id', affiliate.id)
      .order('created_at', { ascending: false })

    // Get recent commissions
    const { data: recentCommissions } = await supabaseAdmin
      .from('commissions')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Get payout history
    const { data: payouts } = await supabaseAdmin
      .from('payouts')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('requested_at', { ascending: false })
      .limit(20)

    // Calculate this month's earnings
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthlyCommissions = (recentCommissions || []).filter(
      (c) => c.created_at >= firstOfMonth
    )
    const monthlyEarnings = monthlyCommissions.reduce(
      (sum, c) => sum + parseFloat(c.commission_amount), 0
    )

    // Calculate total lifetime earnings
    const totalEarnings = (recentCommissions || []).reduce(
      (sum, c) => sum + parseFloat(c.commission_amount), 0
    )

    // Tier progress
    const tierThresholds = { starter: 0, pro: 10, elite: 50, partner: 100 }
    const currentTierIndex = Object.keys(tierThresholds).indexOf(affiliate.tier)
    const tiers = Object.entries(tierThresholds)
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null

    return res.status(200).json({
      affiliate: {
        id: affiliate.id,
        referral_code: affiliate.referral_code,
        tier: affiliate.tier,
        display_name: affiliate.display_name,
        email: affiliate.email,
        payout_email: affiliate.payout_email,
        total_paid_referrals: affiliate.total_paid_referrals,
        balance_pending: parseFloat(affiliate.balance_pending),
        balance_cleared: parseFloat(affiliate.balance_cleared),
      },
      stats: {
        total_referrals: (referrals || []).length,
        paid_referrals: (referrals || []).filter(r => r.has_subscribed).length,
        monthly_earnings: monthlyEarnings,
        total_earnings: totalEarnings,
        direct_team_size: (directTeam || []).length,
      },
      tier_progress: nextTier ? {
        current_tier: affiliate.tier,
        next_tier: nextTier[0],
        current_count: affiliate.total_paid_referrals,
        required_count: nextTier[1],
        remaining: (nextTier[1] as number) - affiliate.total_paid_referrals,
      } : {
        current_tier: affiliate.tier,
        next_tier: null,
        message: 'You are at the highest tier!'
      },
      recent_commissions: recentCommissions || [],
      direct_team: directTeam || [],
      payouts: payouts || [],
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
