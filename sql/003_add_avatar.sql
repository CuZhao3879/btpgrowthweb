-- 003_add_avatar.sql
-- Add avatar_url to track profile pictures

ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update RLS policies (if any) to allow reading
-- (Assuming public read access or authenticated read is already on the table)
