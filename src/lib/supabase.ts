import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_KEY!

// Cliente público — para operaciones del lado del cliente
export const supabase = createClient(url, anon)

// Cliente admin con service key — solo usar en API routes (server-side)
export const supabaseAdmin = createClient(url, svc ?? anon, {
  auth: { autoRefreshToken: false, persistSession: false },
})
