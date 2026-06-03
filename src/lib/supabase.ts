import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const svc = process.env.SUPABASE_SERVICE_KEY

if (!url || !anon) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anon)

let adminClient: SupabaseClient | null = null

function requireServiceKey(): string {
  if (!svc) {
    throw new Error('Missing SUPABASE_SERVICE_KEY — required for server-side operations')
  }
  return svc
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(url!, requireServiceKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return adminClient
}

/** Solo usar en API routes / server — falla si falta SUPABASE_SERVICE_KEY. */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin()
    const value = Reflect.get(client, prop, client) as unknown
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value
  },
})
