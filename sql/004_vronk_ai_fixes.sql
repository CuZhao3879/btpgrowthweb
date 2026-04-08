-- =============================================================
-- BTP Growth: Vronk AI Integration & Payout Fix
-- Run this in BTP Growth Supabase SQL Editor AFTER 001-003
-- =============================================================

-- 1. Fix payouts minimum: $15 → $10
ALTER TABLE payouts DROP CONSTRAINT IF EXISTS payouts_amount_check;
ALTER TABLE payouts ADD CONSTRAINT payouts_amount_check CHECK (amount >= 10.00);

-- 2. Register Vronk AI as an app (so referrals and commissions can reference it)
INSERT INTO apps (id, name, icon_url, tier_rates, is_active) VALUES 
  ('vronk_ai', 'Vronk AI', 'https://vronkai.com/icons/vronk-logo.png', '{
    "starter": {"t1": 0.20, "t2": 0},
    "pro":     {"t1": 0.20, "t2": 0.05},
    "elite":   {"t1": 0.20, "t2": 0.05},
    "partner": {"t1": 0.25, "t2": 0.05}
  }'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon_url = EXCLUDED.icon_url,
  tier_rates = EXCLUDED.tier_rates,
  is_active = EXCLUDED.is_active;
