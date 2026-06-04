import { supabaseAdmin } from './supabase'

export type AppNotification = {
  id: string
  title: string
  body: string
  url: string
  created_at: string
}

const MAX_STORED = 80

function rowToNotif(r: Record<string, unknown>): AppNotification {
  return {
    id: String(r.id),
    title: String(r.title),
    body: String(r.body),
    url: String(r.url ?? '/'),
    created_at: String(r.created_at ?? new Date().toISOString()),
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
}): Promise<CreateNotificationResult> {
  const row = {
    title: input.title.slice(0, 120),
    body: input.body.slice(0, 500),
    url: input.url.slice(0, 500),
  }

  const { data, error } = await supabaseAdmin
    .from('app_notifications')
    .insert(row)
    .select('*')
    .single()

  if (error) {
    const msg = error.message || 'Error al guardar aviso'
    if (process.env.NODE_ENV === 'development') {
      console.warn('[notifications]', msg, '— ejecuta supabase-app-notifications.sql')
    }
    return { notification: null, dbError: msg }
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
    items: (data ?? []).map(rowToNotif),
    dbReady: true,
  }
}
