/**
 * API: Admin — List & Manage Payouts
 * GET /api/affiliate/admin-payouts  — list all payouts
 * PATCH /api/affiliate/admin-payouts — update payout status
 * 
 * Protected by a simple ADMIN_SECRET header check
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ADMIN_SECRET = process.env.AFFILIATE_ADMIN_SECRET || 'btp-admin-2026'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple auth check
  const authHeader = req.headers['x-admin-secret'] as string
  if (authHeader !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // List all payouts with affiliate info
    const status = (req.query.status as string) || undefined

    let query = supabaseAdmin
      .from('payouts')
      .select(`
        *,
        affiliates:affiliate_id (
          display_name,
          email,
          referral_code,
          source_app,
          source_user_id
        )
      `)
      .order('requested_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: payouts, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ payouts })
  }

  if (req.method === 'PATCH') {
    const { payout_id, status, admin_notes } = req.body

    if (!payout_id || !status) {
      return res.status(400).json({ error: 'payout_id and status are required' })
    }

    const updateData: any = { status }
    if (admin_notes) updateData.admin_notes = admin_notes
    if (status === 'completed') updateData.completed_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('payouts')
      .update(updateData)
      .eq('id', payout_id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // If marking as completed, update the related commission records to 'paid'
    if (status === 'completed' && data) {
      await supabaseAdmin
        .from('commissions')
        .update({ status: 'paid' })
        .eq('affiliate_id', data.affiliate_id)
        .eq('status', 'cleared')
    }

    return res.status(200).json({ payout: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
