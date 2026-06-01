import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, body, url } = await req.json().catch(() => ({}))
  if (!title || !body) {
    return NextResponse.json({ error: 'title y body son requeridos' }, { status: 400 })
  }

  const { data: subs } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (!subs || subs.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: 'Sin suscriptores aún' })
  }

  const payload = JSON.stringify({ title, body, url: url || '/' })
  let sent = 0; let failed = 0

  await Promise.allSettled(
    subs.map(async sub => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch (err: unknown) {
        // Subscription expirada — limpiar
        if ((err as { statusCode?: number }).statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
        failed++
      }
    })
  )

  return NextResponse.json({ ok: true, sent, failed, total: subs.length })
}
