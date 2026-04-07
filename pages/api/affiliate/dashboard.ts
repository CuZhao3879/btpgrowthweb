/**
 * API: Get affiliate dashboard data (V2)
 * POST /api/affiliate/dashboard
 *
 * Login from Web:  { username, password } → returns token + data
 * Refresh via Web: { token }             → returns data (no password needed)
 * Login from App:  { source_app, source_user_id }
 *
 * Returns: full dashboard data (earnings, referrals, tier info)
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'
import { signAffiliateToken, verifyAffiliateToken } from '@/lib/affiliate-jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, username, password, token } = req.body

    let affiliate: any = null
    let isTokenAuth = false

    // -------------------------------------------------------
    // Auth path 1: Web login with username + password
    // -------------------------------------------------------
    if (username && password) {
      const { data: found, error } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('username', username.trim().toLowerCase())
        .single()

      if (error || !found) {
        return res.status(404).json({ error: 'Account not found', code: 'NOT_FOUND' })
      }

      // Check if this is a migrated user with no password yet
      if (!found.password_hash) {
        return res.status(403).json({
          error: 'Please reset your password first via the \"Forgot Password\" option.',
          code: 'PASSWORD_NOT_SET',
          email_hint: found.email ? found.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
        })
      }

      const isValid = await bcrypt.compare(password, found.password_hash)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password', code: 'WRONG_PASSWORD' })
      }

      affiliate = found
    }
    // -------------------------------------------------------
    // Auth path 2: Token-based session (from previously-logged-in web user)
    // -------------------------------------------------------
    else if (token) {
      const payload = verifyAffiliateToken(token)
      if (!payload) {
        return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'TOKEN_EXPIRED' })
      }

      const { data: found } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('id', payload.sub)
        .single()

      if (!found) {
        return res.status(404).json({ error: 'Account not found', code: 'NOT_FOUND' })
      }

      affiliate = found
      isTokenAuth = true
    }
    // -------------------------------------------------------
    // Auth path 3: App login with source_app + source_user_id
    // -------------------------------------------------------
    else if (source_app && source_user_id) {
      // Look up via affiliate_connections first
      const { data: conn } = await supabaseAdmin
        .from('affiliate_connections')
        .select('affiliate_id')
        .eq('source_app', source_app)
        .eq('source_user_id', source_user_id)
        .single()

      if (conn) {
        const { data: found } = await supabaseAdmin
          .from('affiliates')
          .select('*')
          .eq('id', conn.affiliate_id)
          .single()
        affiliate = found
      }

      // Fallback: legacy direct lookup (for pre-migration data)
      if (!affiliate) {
        const { data: found } = await supabaseAdmin
          .from('affiliates')
          .select('*')
          .eq('source_app', source_app)
          .eq('source_user_id', source_user_id)
          .single()
        affiliate = found
      }

      if (!affiliate) {
        return res.status(404).json({ error: 'Affiliate not found' })
      }
    } else {
      return res.status(400).json({ error: 'Provide (username + password), token, or (source_app + source_user_id)' })
    }

    // -------------------------------------------------------
    // Build dashboard data
    // -------------------------------------------------------

    // Get referral stats
    const { data: referrals } = await supabaseAdmin
      .from('referrals')
      .select('id, app_id, referred_user_id, has_subscribed, created_at')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })

    // Get direct sub-affiliates
    const { data: directTeam } = await supabaseAdmin
      .from('affiliates')
      .select('id, display_name, referral_code, tier, total_paid_referrals, created_at')
      .eq('parent_id', affiliate.id)
      .order('created_at', { ascending: false })

    // Get recent commissions (for display list only — NOT for totals)
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

    // Get connected apps
    const { data: connections } = await supabaseAdmin
      .from('affiliate_connections')
      .select('source_app, created_at')
      .eq('affiliate_id', affiliate.id)

    // --- Accurate earnings via aggregate queries (NOT limited to 50) ---

    // Total lifetime earnings
    const { data: totalAgg } = await supabaseAdmin
      .from('commissions')
      .select('commission_amount')
      .eq('affiliate_id', affiliate.id)

    const totalEarnings = (totalAgg || []).reduce(
      (sum, c) => sum + parseFloat(c.commission_amount), 0
    )

    // This month's earnings
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { data: monthlyAgg } = await supabaseAdmin
      .from('commissions')
      .select('commission_amount')
      .eq('affiliate_id', affiliate.id)
      .gte('created_at', firstOfMonth)

    const monthlyEarnings = (monthlyAgg || []).reduce(
      (sum, c) => sum + parseFloat(c.commission_amount), 0
    )

    // Tier progress
    const tierThresholds = { starter: 0, pro: 10, elite: 50, partner: 100 }
    const currentTierIndex = Object.keys(tierThresholds).indexOf(affiliate.tier)
    const tiers = Object.entries(tierThresholds)
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null

    // Generate a token for web logins (username+password)
    // Token auth users already have a token, no need to regenerate
    const sessionToken = (!isTokenAuth && username && password)
      ? signAffiliateToken(affiliate.id, affiliate.username)
      : undefined

    return res.status(200).json({
      ...(sessionToken ? { token: sessionToken } : {}),
      affiliate: {
        id: affiliate.id,
        username: affiliate.username,
        referral_code: affiliate.referral_code,
        tier: affiliate.tier,
        display_name: affiliate.display_name,
        email: affiliate.email,
        payout_email: affiliate.payout_email,
        total_paid_referrals: affiliate.total_paid_referrals,
        balance_pending: parseFloat(affiliate.balance_pending),
        balance_cleared: parseFloat(affiliate.balance_cleared),
        avatar_url: affiliate.avatar_url,
        needs_setup: !affiliate.password_hash || !affiliate.username || affiliate.username.startsWith('user_'), // true if missing password or has temp username
      },
      stats: {
        total_referrals: (referrals || []).length,
        paid_referrals: (referrals || []).filter(r => r.has_subscribed).length,
        monthly_earnings: monthlyEarnings,
        total_earnings: totalEarnings,
        direct_team_size: (directTeam || []).length,
      },
      connected_apps: (connections || []).map(c => c.source_app),
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
