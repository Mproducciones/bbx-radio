import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { count } = await supabaseAdmin
    .from('push_subscriptions')
    .select('*', { count: 'exact', head: true })
  return NextResponse.json({ count: count ?? 0 })
}
