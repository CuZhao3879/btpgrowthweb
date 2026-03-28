-- =============================================================
-- BTP Growth V2: Identity & Security Upgrade Migration
-- Run this in BTP Growth Supabase SQL Editor AFTER 001
-- =============================================================

-- -------------------------------------------------------
-- Step 1: Create affiliate_connections table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_connections (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id   UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  source_app     TEXT NOT NULL REFERENCES apps(id),
  source_user_id TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_app, source_user_id),
  UNIQUE(affiliate_id, source_app)
);

CREATE INDEX IF NOT EXISTS idx_aff_conn_affiliate ON affiliate_connections(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_aff_conn_source ON affiliate_connections(source_app, source_user_id);

ALTER TABLE affiliate_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to affiliate_connections"
  ON affiliate_connections FOR ALL USING (true) WITH CHECK (true);

-- -------------------------------------------------------
-- Step 2: Create password_resets table (for OTP)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_resets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  otp_code   TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pw_resets_email ON password_resets(email, used, expires_at);

ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to password_resets"
  ON password_resets FOR ALL USING (true) WITH CHECK (true);

-- -------------------------------------------------------
-- Step 3: Add username + password_hash to affiliates
-- -------------------------------------------------------
DO $$
BEGIN
  -- Add username column if not exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'affiliates' AND column_name = 'username'
  ) THEN
    ALTER TABLE affiliates ADD COLUMN username TEXT;
  END IF;

  -- Add password_hash column if not exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'affiliates' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE affiliates ADD COLUMN password_hash TEXT;
  END IF;

  -- Make email unique if not already
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'affiliates' AND indexname = 'idx_affiliates_email_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_affiliates_email_unique ON affiliates(email);
  END IF;

  -- Make username unique if not already
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'affiliates' AND indexname = 'idx_affiliates_username_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_affiliates_username_unique ON affiliates(username);
  END IF;
END;
$$;

-- -------------------------------------------------------
-- Step 4: Migrate existing data
-- Move source_app + source_user_id into affiliate_connections
-- Generate temporary usernames from referral_code
-- -------------------------------------------------------
DO $$
DECLARE
  rec RECORD;
  tmp_username TEXT;
BEGIN
  FOR rec IN
    SELECT id, source_app, source_user_id, referral_code, username
    FROM affiliates
    WHERE source_user_id IS NOT NULL
      AND source_user_id != ''
  LOOP
    -- 4a: Create affiliate_connection if not exists
    INSERT INTO affiliate_connections (affiliate_id, source_app, source_user_id)
    VALUES (rec.id, rec.source_app, rec.source_user_id)
    ON CONFLICT DO NOTHING;

    -- 4b: Generate temp username if missing
    IF rec.username IS NULL THEN
      -- Use lowercase referral_code suffix as username (e.g. BTP_XBJK8R -> xbjk8r)
      tmp_username := lower(replace(rec.referral_code, 'BTP_', ''));

      -- Ensure uniqueness
      WHILE EXISTS (SELECT 1 FROM affiliates WHERE username = tmp_username AND id != rec.id) LOOP
        tmp_username := tmp_username || floor(random() * 10)::text;
      END LOOP;

      UPDATE affiliates SET username = tmp_username WHERE id = rec.id;
    END IF;
  END LOOP;
END;
$$;
