/**
 * API: Request a payout
 * POST /api/affiliate/payout
 * 
 * Body: { source_app, source_user_id, payout_email }
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source_app, source_user_id, payout_email } = req.body

    if (!source_app || !source_user_id || !payout_email) {
      return res.status(400).json({ error: 'source_app, source_user_id, and payout_email are required' })
    }

    // Get affiliate
    const { data: affiliate, error: affError } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('source_app', source_app)
      .eq('source_user_id', source_user_id)
      .single()

    if (affError || !affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' })
    }

    const availableBalance = parseFloat(affiliate.balance_cleared)

    // Check minimum payout threshold ($15)
    if (availableBalance < 15) {
      return res.status(400).json({ 
        error: `Minimum payout is $15.00. Your available balance is $${availableBalance.toFixed(2)}.` 
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
      return res.status(400).json({ error: 'You already have a pending payout request. Please wait for it to be processed.' })
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

    // Update affiliate: save payout email and zero out cleared balance
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
