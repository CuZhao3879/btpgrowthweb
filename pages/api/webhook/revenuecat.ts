/**
 * API: RevenueCat Webhook Receiver
 * POST /api/webhook/revenuecat
 * 
 * This is the CORE commission engine.
 * RevenueCat sends events here when users purchase/renew/cancel subscriptions.
 * We calculate and distribute commissions based on the referral tree.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'

// RevenueCat webhook event types we care about
const COMMISSION_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE', // upgrade
]

const VOID_EVENTS = [
  'CANCELLATION',
  'BILLING_ISSUE',
  'EXPIRATION',
]

// Apple/Google platform fee (15% with Small Business Program)
const PLATFORM_FEE_RATE = 0.15

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body

    // RevenueCat wraps the event in an "event" field
    const eventData = event?.event || event
    const eventType = eventData?.type
    const appUserId = eventData?.app_user_id
    const subscriberAttributes = eventData?.subscriber_attributes || {}
    const priceInPurchasedCurrency = eventData?.price_in_purchased_currency || eventData?.price || 0
    const transactionId = eventData?.transaction_id || eventData?.id || `rc_${Date.now()}`
    const store = eventData?.store // APP_STORE, PLAY_STORE
    const productId = eventData?.product_id

    console.log(`[RevenueCat Webhook] Event: ${eventType}, User: ${appUserId}, Price: ${priceInPurchasedCurrency}`)

    // Extract the BTP affiliate ID from subscriber attributes
    const btpAffiliateAttr = subscriberAttributes?.btp_affiliate_id || subscriberAttributes?.$btp_affiliate_id
    const affiliateCode = btpAffiliateAttr?.value || null

    if (!affiliateCode) {
      console.log('[RevenueCat Webhook] No btp_affiliate_id attribute found, skipping commission')
      return res.status(200).json({ message: 'No affiliate attribution, skipping' })
    }

    // Handle voiding events (refunds, cancellations)
    if (VOID_EVENTS.includes(eventType)) {
      console.log(`[RevenueCat Webhook] Void event: ${eventType} for transaction ${transactionId}`)
      
      // Void any pending commissions for this transaction
      const { data: voidedCommissions } = await supabaseAdmin
        .from('commissions')
        .update({ status: 'voided' })
        .eq('rc_transaction_id', transactionId)
        .eq('status', 'pending')
        .select()

      // Deduct from pending balances
      if (voidedCommissions && voidedCommissions.length > 0) {
        for (const comm of voidedCommissions) {
          // Fetch current balance and deduct the voided commission
          const { data: aff } = await supabaseAdmin
            .from('affiliates')
            .select('balance_pending')
            .eq('id', comm.affiliate_id)
            .single()

          if (aff) {
            const newPending = Math.max(0, parseFloat(aff.balance_pending) - parseFloat(comm.commission_amount))
            await supabaseAdmin
              .from('affiliates')
              .update({
                balance_pending: newPending,
                updated_at: new Date().toISOString(),
              })
              .eq('id', comm.affiliate_id)
          }
        }
      }

      return res.status(200).json({ message: 'Void event processed' })
    }

    // Only process commission-generating events
    if (!COMMISSION_EVENTS.includes(eventType)) {
      console.log(`[RevenueCat Webhook] Ignoring event type: ${eventType}`)
      return res.status(200).json({ message: 'Event type ignored' })
    }

    // Check for duplicate transaction
    const { data: existingComm } = await supabaseAdmin
      .from('commissions')
      .select('id')
      .eq('rc_transaction_id', transactionId)
      .limit(1)

    if (existingComm && existingComm.length > 0) {
      console.log(`[RevenueCat Webhook] Duplicate transaction ${transactionId}, skipping`)
      return res.status(200).json({ message: 'Duplicate transaction, skipping' })
    }

    // Look up the affiliate by referral code
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('referral_code', affiliateCode)
      .single()

    if (!affiliate) {
      console.log(`[RevenueCat Webhook] Affiliate not found for code: ${affiliateCode}`)
      return res.status(200).json({ message: 'Affiliate not found' })
    }

    // Get the app configuration
    const appId = 'monvo_ai' // Default for now, can be derived from productId later
    const { data: app } = await supabaseAdmin
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single()

    if (!app) {
      console.log('[RevenueCat Webhook] App not found')
      return res.status(200).json({ message: 'App not found' })
    }

    const tierRates = app.tier_rates as Record<string, { t1: number; t2: number }>
    const grossRevenue = priceInPurchasedCurrency
    const netRevenue = grossRevenue * (1 - PLATFORM_FEE_RATE)
    const clearsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    // Find or create the referral record
    let referralId: string
    const { data: existingReferral } = await supabaseAdmin
      .from('referrals')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('app_id', appId)
      .eq('referred_user_id', appUserId)
      .single()

    if (existingReferral) {
      referralId = existingReferral.id
      
      // Update referral on first purchase
      if (eventType === 'INITIAL_PURCHASE') {
        await supabaseAdmin
          .from('referrals')
          .update({ 
            has_subscribed: true, 
            first_purchase_at: new Date().toISOString() 
          })
          .eq('id', referralId)
      }
    } else {
      // Create referral record
      const { data: newReferral } = await supabaseAdmin
        .from('referrals')
        .insert({
          affiliate_id: affiliate.id,
          app_id: appId,
          referred_user_id: appUserId,
          attribution_type: 'code',
          has_subscribed: true,
          first_purchase_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (!newReferral) {
        console.error('[RevenueCat Webhook] Failed to create referral record')
        return res.status(500).json({ error: 'Failed to create referral' })
      }
      referralId = newReferral.id
    }

    // ============ COMMISSION CALCULATION ============

    // TIER 1: Direct commission to the referring affiliate
    const t1Rate = tierRates[affiliate.tier]?.t1 || 0.15
    const t1Amount = parseFloat((grossRevenue * t1Rate).toFixed(2))

    await supabaseAdmin.from('commissions').insert({
      affiliate_id: affiliate.id,
      app_id: appId,
      referral_id: referralId,
      rc_transaction_id: `${transactionId}_t1`,
      gross_revenue: grossRevenue,
      net_revenue: netRevenue,
      commission_rate: t1Rate,
      commission_amount: t1Amount,
      commission_level: 1,
      status: 'pending',
      clears_at: clearsAt,
    })

    // Update affiliate pending balance
    await supabaseAdmin
      .from('affiliates')
      .update({
        balance_pending: parseFloat(affiliate.balance_pending) + t1Amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', affiliate.id)

    console.log(`[RevenueCat Webhook] T1 commission: $${t1Amount} to ${affiliate.referral_code}`)

    // TIER 2: Indirect commission to the affiliate's parent (if exists & eligible)
    if (affiliate.parent_id) {
      const { data: parent } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('id', affiliate.parent_id)
        .single()

      if (parent) {
        const t2Rate = tierRates[parent.tier]?.t2 || 0
        
        if (t2Rate > 0) {
          const t2Amount = parseFloat((grossRevenue * t2Rate).toFixed(2))

          await supabaseAdmin.from('commissions').insert({
            affiliate_id: parent.id,
            app_id: appId,
            referral_id: referralId,
            rc_transaction_id: `${transactionId}_t2`,
            gross_revenue: grossRevenue,
            net_revenue: netRevenue,
            commission_rate: t2Rate,
            commission_amount: t2Amount,
            commission_level: 2,
            status: 'pending',
            clears_at: clearsAt,
          })

          // Update parent pending balance
          await supabaseAdmin
            .from('affiliates')
            .update({
              balance_pending: parseFloat(parent.balance_pending) + t2Amount,
              updated_at: new Date().toISOString(),
            })
            .eq('id', parent.id)

          console.log(`[RevenueCat Webhook] T2 commission: $${t2Amount} to ${parent.referral_code}`)
        }
      }
    }

    // Update referral count and check for tier upgrade (on first purchase only)
    if (eventType === 'INITIAL_PURCHASE') {
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

    return res.status(200).json({ 
      message: 'Commission processed successfully',
      t1_commission: t1Amount,
    })
  } catch (err) {
    console.error('[RevenueCat Webhook] Error:', err)
    // Always return 200 to RevenueCat to prevent retries on known errors
    return res.status(200).json({ error: 'Processing error, logged' })
  }
}
