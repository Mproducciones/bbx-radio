import { supabaseAdmin } from './supabase'

import { clampVisibleHours, getDefaultVisibleHours } from './notificationSettings'
import { filterActiveNotifications } from './notificationActive'

export type AppNotification = {
  id: string
  title: string
  body: string
  url: string
  created_at: string
  expires_at?: string
  visible_hours?: number
}

const MAX_STORED = 80

function rowToNotif(r: Record<string, unknown>): AppNotification {
  const visible_hours = r.visible_hours != null ? Number(r.visible_hours) : undefined
  return {
    id: String(r.id),
    title: String(r.title),
    body: String(r.body),
    url: String(r.url ?? '/'),
    created_at: String(r.created_at ?? new Date().toISOString()),
    expires_at: r.expires_at ? String(r.expires_at) : undefined,
    visible_hours: Number.isFinite(visible_hours) ? visible_hours : undefined,
  }
}

export type CreateNotificationResult = {
  notification: AppNotification | null
  dbError?: string
}

export async function createAppNotification(input: {
  title: string
  body: string
  url: string
  visibleHours?: number
}): Promise<CreateNotificationResult> {
  const visible_hours = clampVisibleHours(input.visibleHours ?? getDefaultVisibleHours())
  const expires_at = new Date(Date.now() + visible_hours * 3_600_000).toISOString()

  const row = {
    title: input.title.slice(0, 120),
    body: input.body.slice(0, 500),
    url: input.url.slice(0, 500),
    visible_hours,
    expires_at,
  }

  const { data, error } = await supabaseAdmin
    .from('app_notifications')
    .insert(row)
    .select('*')
    .single()

  if (error) {
    const legacy = {
      title: row.title,
      body: row.body,
      url: row.url,
    }
    const legacyRes = await supabaseAdmin
      .from('app_notifications')
      .insert(legacy)
      .select('*')
      .single()

    if (legacyRes.error) {
      const msg = legacyRes.error.message || error.message || 'Error al guardar aviso'
      if (process.env.NODE_ENV === 'development') {
        console.warn('[notifications]', msg, '— ejecuta supabase-app-notifications.sql')
      }
      return { notification: null, dbError: msg }
    }

    const notif = rowToNotif(legacyRes.data as Record<string, unknown>)
    notif.visible_hours = visible_hours
    notif.expires_at = expires_at
    await trimOldNotifications()
    return { notification: notif }
  }

  const notif = rowToNotif(data)
  await trimOldNotifications()
  return { notification: notif }
}

async function trimOldNotifications() {
  const { data } = await supabaseAdmin
    .from('app_notifications')
    .select('id')
    .order('created_at', { ascending: false })
    .range(MAX_STORED, MAX_STORED + 50)

  if (!data?.length) return
  const ids = data.map(r => String(r.id))
  await supabaseAdmin.from('app_notifications').delete().in('id', ids)
}

export type ListNotificationsResult = {
  items: AppNotification[]
  dbReady: boolean
  dbError?: string
}

export async function listAppNotifications(limit = 40): Promise<ListNotificationsResult> {
  const { data, error } = await supabaseAdmin
    .from('app_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return {
      items: [],
      dbReady: false,
      dbError: error.message,
    }
  }
  return {
    items: filterActiveNotifications((data ?? []).map(rowToNotif)),
    dbReady: true,
  }
}
