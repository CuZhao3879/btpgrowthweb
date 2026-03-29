/**
 * Cron endpoint: Clear matured commissions
 * GET /api/cron/clear-commissions
 * 
 * Call this via Vercel Cron or an external scheduler every hour.
 * Protected by a simple CRON_SECRET header check.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple auth: check Authorization header or CRON_SECRET query param
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization
  const querySecret = req.query.secret

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Call the database function that clears matured commissions
    const { error } = await supabaseAdmin.rpc('clear_matured_commissions')

    if (error) {
      console.error('Cron clear_matured_commissions error:', error)
      return res.status(500).json({ error: 'Failed to clear commissions', details: error.message })
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Matured commissions cleared successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Cron error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
