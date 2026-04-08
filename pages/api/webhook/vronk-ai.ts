/**
 * API: Vronk AI Webhook Receiver
 * POST /api/webhook/vronk-ai
 *
 * Receives affiliate events pushed from Vronk AI:
 *   - affiliate.joined     → 新联盟成员加入
 *   - affiliate.click      → 推荐链接被点击
 *   - affiliate.referral   → 新用户通过推荐链接注册
 *   - affiliate.commission → 产生佣金（订阅/续费/充值）
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

const APP_ID = 'vronk_ai'
const HOLDBACK_DAYS = 30 // 30-day holdback before commission clears

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify API key
  const apiKey = req.headers['x-api-key']
  if (process.env.VRONK_AI_WEBHOOK_SECRET && apiKey !== process.env.VRONK_AI_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { event, data, timestamp } = req.body

    if (!event || !data) {
      return res.status(400).json({ error: 'Missing event or data' })
    }

    console.log(`[Vronk AI Webhook] Event: ${event}, Time: ${timestamp}`)

    switch (event) {
      case 'affiliate.joined':
        await handleAffiliateJoined(data)
        break

      case 'affiliate.click':
        // Click tracking — logged for analytics, no DB action needed on BTP side
        console.log(`[Vronk AI Webhook] Click tracked: ${data.referralCode} from ${data.ip}`)
        break

      case 'affiliate.referral':
        await handleAffiliateReferral(data)
        break

      case 'affiliate.commission':
        await handleAffiliateCommission(data)
        break

      default:
        console.log(`[Vronk AI Webhook] Unknown event type: ${event}`)
    }

    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    console.error('[Vronk AI Webhook] Error:', err)
    // Always return 200 to prevent Vronk AI from logging errors
    return res.status(200).json({ error: 'Processing error, logged' })
  }
}

/**
 * Handle affiliate.joined — Register new affiliate in BTP Growth
 */
async function handleAffiliateJoined(data: {
  userId: string
  email: string
  referralCode: string
  joinedAt: string
}) {
  // Check if affiliate already exists
  const { data: existing } = await supabaseAdmin
    .from('affiliates')
    .select('id')
    .eq('source_app', APP_ID)
    .eq('source_user_id', data.userId)
    .single()

  if (existing) {
    console.log(`[Vronk AI Webhook] Affiliate already exists: ${data.userId}`)
    return
  }

  // Generate a BTP login ID (8-digit numeric)
  let btpLoginId: string
  while (true) {
    btpLoginId = Math.floor(Math.random() * 90000000 + 10000000).toString()
    const { data: conflict } = await supabaseAdmin
      .from('affiliates')
      .select('id')
      .eq('btp_login_id', btpLoginId)
      .single()
    if (!conflict) break
  }

  // Generate a temporary username from userId prefix
  const tempUsername = `user_${data.userId.replace(/-/g, '').substring(0, 8).toLowerCase()}`

  // Create affiliate record (with temp username; user can set proper credentials via setup-profile)
  const { data: newAffiliate } = await supabaseAdmin.from('affiliates').insert({
    source_app: APP_ID,
    source_user_id: data.userId,
    email: data.email,
    referral_code: data.referralCode,
    btp_login_id: btpLoginId,
    username: tempUsername,
    tier: 'starter',
  }).select().single()

  // Create affiliate_connection for multi-app lookup
  if (newAffiliate) {
    await supabaseAdmin.from('affiliate_connections').insert({
      affiliate_id: newAffiliate.id,
      source_app: APP_ID,
      source_user_id: data.userId,
    })
  }

  console.log(`[Vronk AI Webhook] New affiliate registered: ${data.email} (${data.referralCode})`)
}

/**
 * Handle affiliate.referral — Record that a new user signed up via referral
 */
async function handleAffiliateReferral(data: {
  referrerId: string
  referredUserId: string
  referralCode: string
}) {
  // Find the affiliate in BTP
  const { data: affiliate } = await supabaseAdmin
    .from('affiliates')
    .select('id')
    .eq('source_app', APP_ID)
    .eq('source_user_id', data.referrerId)
    .single()

  if (!affiliate) {
    console.log(`[Vronk AI Webhook] Affiliate not found for referrer: ${data.referrerId}`)
    return
  }

  // Ensure the app exists
  await ensureAppExists()

  // Check if referral already recorded
  const { data: existingRef } = await supabaseAdmin
    .from('referrals')
    .select('id')
    .eq('affiliate_id', affiliate.id)
    .eq('app_id', APP_ID)
    .eq('referred_user_id', data.referredUserId)
    .single()

  if (existingRef) {
    console.log(`[Vronk AI Webhook] Referral already exists`)
    return
  }

  // Create referral record
  await supabaseAdmin.from('referrals').insert({
    affiliate_id: affiliate.id,
    app_id: APP_ID,
    referred_user_id: data.referredUserId,
    attribution_type: 'code',
  })

  console.log(`[Vronk AI Webhook] Referral recorded: ${data.referredUserId} → ${data.referralCode}`)
}

/**
 * Handle affiliate.commission — Record commission from Vronk AI payment
 */
async function handleAffiliateCommission(data: {
  affiliateId: string
  sourceUserId: string
  level: number
  saleAmount: number
  commissionRate: number
  commissionAmount: number
  stripeInvoiceId: string
}) {
  // Find the affiliate in BTP
  const { data: affiliate } = await supabaseAdmin
    .from('affiliates')
    .select('*')
    .eq('source_app', APP_ID)
    .eq('source_user_id', data.affiliateId)
    .single()

  if (!affiliate) {
    console.log(`[Vronk AI Webhook] Affiliate not found: ${data.affiliateId}`)
    return
  }

  // Ensure app exists
  await ensureAppExists()

  // Check for duplicate transaction
  const transactionId = `vronk_${data.stripeInvoiceId}_t${data.level}`
  const { data: existing } = await supabaseAdmin
    .from('commissions')
    .select('id')
    .eq('rc_transaction_id', transactionId)
    .limit(1)

  if (existing && existing.length > 0) {
    console.log(`[Vronk AI Webhook] Duplicate commission: ${transactionId}`)
    return
  }

  // Find or create referral record
  let referralId: string
  const { data: referral } = await supabaseAdmin
    .from('referrals')
    .select('id')
    .eq('affiliate_id', affiliate.id)
    .eq('app_id', APP_ID)
    .eq('referred_user_id', data.sourceUserId)
    .single()

  if (referral) {
    referralId = referral.id

    // Mark as subscribed if first purchase
    await supabaseAdmin
      .from('referrals')
      .update({
        has_subscribed: true,
        first_purchase_at: new Date().toISOString(),
      })
      .eq('id', referralId)
      .is('first_purchase_at', null)
  } else {
    // Create referral inline
    const { data: newRef } = await supabaseAdmin
      .from('referrals')
      .insert({
        affiliate_id: affiliate.id,
        app_id: APP_ID,
        referred_user_id: data.sourceUserId,
        attribution_type: 'code',
        has_subscribed: true,
        first_purchase_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!newRef) {
      console.error('[Vronk AI Webhook] Failed to create referral for commission')
      return
    }
    referralId = newRef.id
  }

  // Calculate clear date (30 days from now)
  const clearsAt = new Date(Date.now() + HOLDBACK_DAYS * 24 * 60 * 60 * 1000).toISOString()

  // Insert commission record
  await supabaseAdmin.from('commissions').insert({
    affiliate_id: affiliate.id,
    app_id: APP_ID,
    referral_id: referralId,
    rc_transaction_id: transactionId,
    gross_revenue: data.saleAmount,
    net_revenue: data.saleAmount, // No platform fee for web (Stripe only takes ~3%)
    commission_rate: data.commissionRate,
    commission_amount: data.commissionAmount,
    commission_level: data.level,
    status: 'pending',
    clears_at: clearsAt,
  })

  // Update affiliate pending balance
  const newPending = parseFloat(affiliate.balance_pending) + data.commissionAmount
  await supabaseAdmin
    .from('affiliates')
    .update({
      balance_pending: newPending,
      updated_at: new Date().toISOString(),
    })
    .eq('id', affiliate.id)

  // Update paid referrals count and check tier upgrade (level 1 only, first purchase)
  if (data.level === 1) {
    await supabaseAdmin
      .from('affiliates')
      .update({
        total_paid_referrals: affiliate.total_paid_referrals + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', affiliate.id)

    // Check tier upgrade
    await supabaseAdmin.rpc('check_tier_upgrade', { p_affiliate_id: affiliate.id })
  }

  console.log(`[Vronk AI Webhook] Commission recorded: $${data.commissionAmount} (L${data.level}) → ${affiliate.referral_code}`)
}

/**
 * Ensure the Vronk AI app record exists in the apps table
 */
async function ensureAppExists() {
  await supabaseAdmin
    .from('apps')
    .upsert(
      {
        id: APP_ID,
        name: 'Vronk AI',
        icon_url: 'https://vronkai.com/icons/vronk-logo.png',
        tier_rates: {
          starter: { t1: 0.20, t2: 0 },
          pro: { t1: 0.20, t2: 0.05 },
          elite: { t1: 0.20, t2: 0.05 },
          partner: { t1: 0.25, t2: 0.05 },
        },
        is_active: true,
      },
      { onConflict: 'id' }
    )
}
