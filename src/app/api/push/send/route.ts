import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized, getAdminSessionFromRequest } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import { sanitizePushUrl } from '@/lib/safeUrl'
import { checkRateLimit } from '@/lib/rateLimit'
import { createAppNotification } from '@/lib/appNotificationsStore'
import webpush from 'web-push'

export const runtime = 'nodejs'

function vapidReady(): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = []
  if (!process.env.VAPID_EMAIL?.trim()) missing.push('VAPID_EMAIL')
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) missing.push('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
  if (!process.env.VAPID_PRIVATE_KEY?.trim()) missing.push('VAPID_PRIVATE_KEY')
  if (missing.length) return { ok: false, missing }
  return { ok: true }
}

export async function POST(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Sesión expirada o no autorizada. Vuelve a entrar en /admin.', code: 'unauthorized' }, { status: 401 })
  }

  const session = await getAdminSessionFromRequest(req)
  if (session && !(await checkRateLimit('pushSend', session.username))) {
    return NextResponse.json({ error: 'Demasiados envíos. Espera un momento.', code: 'rate_limit' }, { status: 429 })
  }

  const { title, body, url, visibleHours } = await req.json().catch(() => ({}))
  if (!title || !body || typeof title !== 'string' || typeof body !== 'string') {
    return NextResponse.json({ error: 'title y body son requeridos', code: 'bad_request' }, { status: 400 })
  }

  const siteOrigin = req.nextUrl.origin
  const safeUrl = sanitizePushUrl(typeof url === 'string' ? url : undefined, siteOrigin)

  // Siempre guardar en campanita primero (no depende de VAPID)
  const { notification: inApp, dbError: inAppDbError } = await createAppNotification({
    title: title.slice(0, 120),
    body: body.slice(0, 240),
    url: safeUrl,
    visibleHours: visibleHours,
  })

  if (!inApp) {
    return NextResponse.json({
      ok: false,
      inApp: false,
      code: 'inapp_db_error',
      error: 'No se pudo guardar en la campanita',
      hint: inAppDbError?.includes('app_notifications')
        ? 'Ejecuta supabase-app-notifications.sql en Supabase SQL Editor.'
        : inAppDbError ?? 'Revisa Supabase y SUPABASE_SERVICE_KEY en Vercel.',
      dbError: inAppDbError,
    }, { status: 503 })
  }

  const payload = JSON.stringify({
    title: title.slice(0, 120),
    body: body.slice(0, 240),
    url: safeUrl,
    id: inApp.id,
  })

  const vapid = vapidReady()
  if (!vapid.ok) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      total: 0,
      inApp: true,
      notificationId: inApp.id,
      pushSkipped: true,
      message: 'Guardado en la campanita. Push al celular: configura VAPID en Vercel.',
      missing: vapid.missing,
      url: safeUrl,
    })
  }

  const email = process.env.VAPID_EMAIL!.trim()
  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!.trim()
  const privKey = process.env.VAPID_PRIVATE_KEY!.trim()

  try {
    webpush.setVapidDetails(email, pubKey, privKey)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Claves VAPID inválidas'
    return NextResponse.json({
      ok: true,
      inApp: true,
      notificationId: inApp.id,
      sent: 0,
      failed: 0,
      total: 0,
      pushSkipped: true,
      message: 'Aviso en campanita OK. Push falló: ' + msg,
      url: safeUrl,
    })
  }

  const { data: subs, error: dbError } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (dbError) {
    const hint = dbError.message.includes('push_subscriptions')
      ? 'Ejecuta supabase-push.sql en el SQL Editor de Supabase.'
      : dbError.message
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      total: 0,
      inApp: true,
      notificationId: inApp.id,
      pushSkipped: true,
      message: 'Aviso en campanita OK. Push: falta tabla push_subscriptions.',
      hint,
      url: safeUrl,
    })
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      total: 0,
      inApp: true,
      notificationId: inApp.id,
      message: 'Guardado en la campanita. Sin suscriptores push aún.',
      url: safeUrl,
    })
  }

  let sent = 0
  let failed = 0

  await Promise.allSettled(
    subs.map(async sub => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        )
        sent++
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
        failed++
      }
    }),
  )

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    total: subs.length,
    inApp: true,
    notificationId: inApp.id,
    url: safeUrl,
  })
}
