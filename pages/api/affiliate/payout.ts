/**
 * API: Request a payout (V2 — with username+password auth)
 * POST /api/affiliate/payout
 *
 * Body: { username, password, payout_email }
 *   OR  { source_app, source_user_id, payout_email }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'
import { verifyAffiliateToken } from '@/lib/affiliate-jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, username, password, token, payout_email } = req.body

    if (!payout_email) {
      return res.status(400).json({ error: 'payout_email is required' })
    }

    let affiliate: any = null

    // Auth path 1: username + password (from web)
    if (username && password) {
      const { data: found } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('username', username.trim().toLowerCase())
        .single()

      if (!found || !found.password_hash) {
        return res.status(404).json({ error: 'Affiliate not found' })
      }

      const isValid = await bcrypt.compare(password, found.password_hash)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      affiliate = found
    }
    // Auth path 2: JWT token (from web session)
    else if (token) {
      const payload = verifyAffiliateToken(token)
      if (!payload) {
        return res.status(401).json({ error: 'Session expired. Please log in again.' })
      }
      const { data: found } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('id', payload.sub)
        .single()
      if (!found) {
        return res.status(404).json({ error: 'Affiliate not found' })
      }
      affiliate = found
    }
    // Auth path 3: source_app + source_user_id (from app)
    else if (source_app && source_user_id) {
      // Try connections table first
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

      // Fallback legacy
      if (!affiliate) {
        const { data: found } = await supabaseAdmin
          .from('affiliates')
          .select('*')
          .eq('source_app', source_app)
          .eq('source_user_id', source_user_id)
          .single()
        affiliate = found
      }
    } else {
      return res.status(400).json({ error: 'Authentication required' })
    }

    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' })
    }

    const availableBalance = parseFloat(affiliate.balance_cleared)

    // Check minimum payout threshold ($10)
    if (availableBalance < 10) {
      return res.status(400).json({
        error: `Minimum payout is $10.00. Your available balance is $${availableBalance.toFixed(2)}.`
      })
    }

    // Check for pending payout requests
    const { data: pendingPayout } = await supabaseAdmin
      .from('payouts')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('status', 'requested')
      .single()

    if (pendingPayout) {
      return res.status(400).json({ error: 'You already have a pending payout request.' })
    }

    // Rate limit: max 1 payout request per 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentPayout } = await supabaseAdmin
      .from('payouts')
      .select('id, requested_at')
      .eq('affiliate_id', affiliate.id)
      .gte('requested_at', twentyFourHoursAgo)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single()

    if (recentPayout) {
      return res.status(429).json({ error: 'You can only request one payout per 24 hours. Please try again later.' })
    }

    // Create payout request
    const { data: payout, error: payoutError } = await supabaseAdmin
      .from('payouts')
      .insert({
        affiliate_id: affiliate.id,
        amount: availableBalance,
        payout_method: 'paypal',
        payout_email,
        status: 'requested',
      })
      .select()
      .single()

    if (payoutError) {
      console.error('Payout creation error:', payoutError)
      return res.status(500).json({ error: 'Failed to create payout request' })
    }

    // Update affiliate balance and save payout email
    await supabaseAdmin
      .from('affiliates')
      .update({
        payout_email,
        balance_cleared: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', affiliate.id)

    return res.status(201).json({
      message: 'Payout request submitted successfully',
      payout: {
        id: payout.id,
        amount: availableBalance,
        payout_email,
        status: 'requested',
      }
    })
  } catch (err) {
    console.error('Payout error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
