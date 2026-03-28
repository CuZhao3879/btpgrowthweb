-- =============================================================
-- BTP Growth Affiliate System — Database Schema
-- Run this in BTP Growth Supabase SQL Editor
-- =============================================================

-- 1. affiliates (推广员主表)
CREATE TABLE IF NOT EXISTS affiliates (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app           TEXT NOT NULL DEFAULT 'monvo_ai',
  source_user_id       TEXT NOT NULL,
  email                TEXT,
  display_name         TEXT,
  btp_login_id         TEXT UNIQUE,
  referral_code        TEXT UNIQUE NOT NULL,
  tier                 TEXT DEFAULT 'starter'
                       CHECK (tier IN ('starter','pro','elite','partner')),
  parent_id            UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  total_paid_referrals INTEGER DEFAULT 0,
  balance_pending      NUMERIC(10,2) DEFAULT 0.00,
  balance_cleared      NUMERIC(10,2) DEFAULT 0.00,
  payout_email         TEXT,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliates_source 
  ON affiliates(source_app, source_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code 
  ON affiliates(referral_code);

-- 2. apps (旗下软件名录)
CREATE TABLE IF NOT EXISTS apps (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon_url    TEXT,
  tier_rates  JSONB NOT NULL DEFAULT '{
    "starter": {"t1": 0.15, "t2": 0},
    "pro":     {"t1": 0.15, "t2": 0.05},
    "elite":   {"t1": 0.20, "t2": 0.05},
    "partner": {"t1": 0.25, "t2": 0.05}
  }'::jsonb,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO apps (id, name, icon_url) VALUES 
  ('monvo_ai', 'Monvo AI', 'https://monvoai.com/icon.png')
ON CONFLICT (id) DO NOTHING;

-- 3. referrals (引荐记录)
CREATE TABLE IF NOT EXISTS referrals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id     UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  app_id           TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  referred_user_id TEXT NOT NULL,
  attribution_type TEXT NOT NULL DEFAULT 'code'
                   CHECK (attribution_type IN ('link', 'code')),
  has_subscribed   BOOLEAN DEFAULT false,
  first_purchase_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_unique 
  ON referrals(app_id, referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate 
  ON referrals(affiliate_id);

-- 4. commissions (佣金流水账本)
CREATE TABLE IF NOT EXISTS commissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id      UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  app_id            TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  referral_id       UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  rc_transaction_id TEXT UNIQUE NOT NULL,
  gross_revenue     NUMERIC(10,2) NOT NULL,
  net_revenue       NUMERIC(10,2) NOT NULL,
  commission_rate   NUMERIC(4,3) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  commission_level  SMALLINT NOT NULL CHECK (commission_level IN (1, 2)),
  status            TEXT DEFAULT 'pending'
                    CHECK (status IN ('pending','cleared','paid','voided')),
  clears_at         TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate 
  ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_pending 
  ON commissions(status, clears_at) WHERE status = 'pending';

-- 5. payouts (提现记录)
CREATE TABLE IF NOT EXISTS payouts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount          NUMERIC(10,2) NOT NULL CHECK (amount >= 15.00),
  payout_method   TEXT DEFAULT 'paypal',
  payout_email    TEXT NOT NULL,
  status          TEXT DEFAULT 'requested'
                  CHECK (status IN ('requested','processing','completed','failed')),
  admin_notes     TEXT,
  requested_at    TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payouts_affiliate ON payouts(affiliate_id);

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apps are publicly readable" ON apps FOR SELECT USING (true);
CREATE POLICY "Service role full access to affiliates" ON affiliates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to commissions" ON commissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to payouts" ON payouts FOR ALL USING (true) WITH CHECK (true);

-- =============================================================
-- Helper: clear matured commissions (run as daily cron)
-- =============================================================
CREATE OR REPLACE FUNCTION clear_matured_commissions()
RETURNS void AS $$
BEGIN
  -- Move matured pending commissions to cleared
  UPDATE commissions 
  SET status = 'cleared'
  WHERE status = 'pending' AND clears_at <= now();

  -- Update affiliate balances
  UPDATE affiliates a
  SET 
    balance_cleared = balance_cleared + sub.total,
    balance_pending = balance_pending - sub.total
  FROM (
    SELECT affiliate_id, SUM(commission_amount) as total
    FROM commissions
    WHERE status = 'cleared' 
      AND clears_at <= now()
      AND clears_at > now() - interval '1 minute'
    GROUP BY affiliate_id
  ) sub
  WHERE a.id = sub.affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- Helper: check & upgrade affiliate tier
-- =============================================================
CREATE OR REPLACE FUNCTION check_tier_upgrade(p_affiliate_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_total INTEGER;
  v_current_tier TEXT;
  v_new_tier TEXT;
BEGIN
  SELECT total_paid_referrals, tier 
  INTO v_total, v_current_tier
  FROM affiliates WHERE id = p_affiliate_id;

  IF v_total >= 100 THEN v_new_tier := 'partner';
  ELSIF v_total >= 50 THEN v_new_tier := 'elite';
  ELSIF v_total >= 10 THEN v_new_tier := 'pro';
  ELSE v_new_tier := 'starter';
  END IF;

  IF v_new_tier != v_current_tier THEN
    UPDATE affiliates 
    SET tier = v_new_tier, updated_at = now()
    WHERE id = p_affiliate_id;
  END IF;

  RETURN v_new_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- Migration: Add BTP Login ID to existing affiliates
-- (Run this if you already have existing affiliates in your DB)
-- =============================================================
DO $$
DECLARE
  rec RECORD;
  new_login_id TEXT;
BEGIN
  -- 1. Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'affiliates' AND column_name = 'btp_login_id'
  ) THEN
    ALTER TABLE affiliates ADD COLUMN btp_login_id TEXT UNIQUE;
  END IF;

  -- 2. Backfill existing rows that have NULL btp_login_id
  FOR rec IN SELECT id FROM affiliates WHERE btp_login_id IS NULL LOOP
    LOOP
      -- Generate an 8-digit numeric ID
      new_login_id := floor(random() * 90000000 + 10000000)::text;
      
      -- Ensure uniqueness
      IF NOT EXISTS (SELECT 1 FROM affiliates WHERE btp_login_id = new_login_id) THEN
        UPDATE affiliates SET btp_login_id = new_login_id WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
  
  -- 3. Make the column NOT NULL after backfilling
  ALTER TABLE affiliates ALTER COLUMN btp_login_id SET NOT NULL;
END;
$$;
