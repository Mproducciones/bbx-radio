import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

function vapidConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()
    && process.env.VAPID_PRIVATE_KEY?.trim()
    && process.env.VAPID_EMAIL?.trim(),
  )
}

export async function GET(req: NextRequest) {
  if (!await isAdminRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const configured = vapidConfigured()
  let count = 0
  let dbReady = true
  let dbError: string | undefined

  try {
    const { count: n, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*', { count: 'exact', head: true })
    if (error) {
      dbReady = false
      dbError = error.message
    } else {
      count = n ?? 0
    }
  } catch (e) {
    dbReady = false
    dbError = e instanceof Error ? e.message : 'Error de base de datos'
  }

  const ready = configured && dbReady

  return NextResponse.json({
    configured,
    dbReady,
    ready,
    count,
    dbError,
    hint: !configured
      ? 'Faltan VAPID en Vercel (ver ENV_SETUP.md).'
      : !dbReady
        ? 'Ejecuta supabase-push.sql en Supabase.'
        : count === 0
          ? 'Los oyentes deben pulsar Activar en el banner de la app.'
          : undefined,
  })
}
