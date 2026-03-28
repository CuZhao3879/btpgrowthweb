import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase service role environment variables for admin client')
}

// Admin client with service_role key — bypasses RLS
// ONLY use this in server-side API routes, NEVER expose to client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
