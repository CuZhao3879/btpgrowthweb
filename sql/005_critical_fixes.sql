-- =============================================================
-- BTP Growth — Fix #5: Critical bug fixes
-- Run this in BTP Growth Supabase SQL Editor
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- Fix 1: Payouts CHECK constraint ($15 → $10)
-- The API code checks >= $10 but the DB still had >= $15
-- ─────────────────────────────────────────────────────────────
ALTER TABLE payouts DROP CONSTRAINT IF EXISTS payouts_amount_check;
ALTER TABLE payouts ADD CONSTRAINT payouts_amount_check CHECK (amount >= 10.00);

-- ─────────────────────────────────────────────────────────────
-- Fix 2: clear_matured_commissions race condition
-- 
-- OLD BUG: The function updated status to 'cleared' first,
-- then tried to move balances for commissions cleared within
-- the last 1 minute. Cron runs hourly, so almost all
-- commissions were missed → balance_cleared was never updated
-- → users could never withdraw.
--
-- NEW: Uses a CTE so both operations are atomic — the UPDATE
-- returns the affected rows, and the balance transfer uses
-- exactly those rows.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION clear_matured_commissions()
RETURNS void AS $$
BEGIN
  WITH newly_cleared AS (
    UPDATE commissions 
    SET status = 'cleared'
    WHERE status = 'pending' AND clears_at <= now()
    RETURNING affiliate_id, commission_amount
  )
  UPDATE affiliates a
  SET 
    balance_cleared = balance_cleared + sub.total,
    balance_pending = GREATEST(balance_pending - sub.total, 0),
    updated_at = now()
  FROM (
    SELECT affiliate_id, SUM(commission_amount) as total
    FROM newly_cleared
    GROUP BY affiliate_id
  ) sub
  WHERE a.id = sub.affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
