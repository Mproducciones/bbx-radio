import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimitByIp } from '@/lib/rateLimit'
import { isValidPushEndpoint, isValidPushKey } from '@/lib/safeUrl'
import { guardPublicWrite } from '@/lib/requestGuard'

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'pushSubscribe'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const sub = await req.json()
    if (
      !isValidPushEndpoint(sub?.endpoint)
      || !isValidPushKey(sub?.keys?.p256dh)
      || !isValidPushKey(sub?.keys?.auth)
    ) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    const { count } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*', { count: 'exact', head: true })

    if ((count ?? 0) >= 100_000) {
      return NextResponse.json({ error: 'Service at capacity' }, { status: 503 })
    }

    await supabaseAdmin.from('push_subscriptions').upsert({
      endpoint: sub.endpoint,
      p256dh:   sub.keys.p256dh,
      auth:     sub.keys.auth,
    }, { onConflict: 'endpoint' })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'pushSubscribe'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { endpoint } = await req.json()
    if (!endpoint || !isValidPushEndpoint(endpoint)) {
      return NextResponse.json({ error: 'Missing or invalid endpoint' }, { status: 400 })
    }
    await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', endpoint)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
