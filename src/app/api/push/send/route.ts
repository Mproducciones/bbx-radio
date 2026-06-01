import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import webpush from 'web-push'

export async function POST(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email  = process.env.VAPID_EMAIL
  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privKey = process.env.VAPID_PRIVATE_KEY

  if (!email || !pubKey || !privKey) {
    return NextResponse.json({ error: 'VAPID env vars no configuradas' }, { status: 500 })
  }

  webpush.setVapidDetails(email, pubKey, privKey)

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
        if ((err as { statusCode?: number }).statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
        failed++
      }
    })
  )

  return NextResponse.json({ ok: true, sent, failed, total: subs.length })
}
