import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized, getAdminSessionFromRequest } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import { sanitizePushUrl } from '@/lib/safeUrl'
import { checkRateLimit } from '@/lib/rateLimit'
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

  const vapid = vapidReady()
  if (!vapid.ok) {
    return NextResponse.json({
      error: `Faltan variables en Vercel: ${vapid.missing.join(', ')}. Genera claves con: npx web-push generate-vapid-keys`,
      code: 'vapid_missing',
      missing: vapid.missing,
    }, { status: 503 })
  }

  const email = process.env.VAPID_EMAIL!.trim()
  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!.trim()
  const privKey = process.env.VAPID_PRIVATE_KEY!.trim()

  try {
    webpush.setVapidDetails(email, pubKey, privKey)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Claves VAPID inválidas'
    return NextResponse.json({ error: msg, code: 'vapid_invalid' }, { status: 503 })
  }

  const { title, body, url } = await req.json().catch(() => ({}))
  if (!title || !body || typeof title !== 'string' || typeof body !== 'string') {
    return NextResponse.json({ error: 'title y body son requeridos', code: 'bad_request' }, { status: 400 })
  }

  const siteOrigin = req.nextUrl.origin
  const safeUrl = sanitizePushUrl(typeof url === 'string' ? url : undefined, siteOrigin)

  const { data: subs, error: dbError } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (dbError) {
    const hint = dbError.message.includes('push_subscriptions')
      ? 'Ejecuta supabase-push.sql en el SQL Editor de Supabase.'
      : dbError.message
    return NextResponse.json({
      error: 'Base de datos no lista para push',
      code: 'db_error',
      hint,
    }, { status: 503 })
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, total: 0, message: 'Sin suscriptores aún', url: safeUrl })
  }

  const payload = JSON.stringify({
    title: title.slice(0, 120),
    body: body.slice(0, 240),
    url: safeUrl,
  })
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

  return NextResponse.json({ ok: true, sent, failed, total: subs.length, url: safeUrl })
}
