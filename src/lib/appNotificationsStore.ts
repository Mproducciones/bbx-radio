import { supabaseAdmin } from './supabase'

export type AppNotification = {
  id: string
  title: string
  body: string
  url: string
  created_at: string
}

const MAX_STORED = 80
let memNotifs: AppNotification[] = []
let memWarned = false

function rowToNotif(r: Record<string, unknown>): AppNotification {
  return {
    id: String(r.id),
    title: String(r.title),
    body: String(r.body),
    url: String(r.url ?? '/'),
    created_at: String(r.created_at ?? new Date().toISOString()),
  }
}

async function memFallback() {
  if (!memWarned && process.env.NODE_ENV === 'development') {
    memWarned = true
    console.warn('[notifications] Supabase fallback — ejecuta supabase-app-notifications.sql')
  }
}

export async function createAppNotification(input: {
  title: string
  body: string
  url: string
}): Promise<AppNotification | null> {
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
    await memFallback()
    const item: AppNotification = {
      id: `mem-${Date.now()}`,
      ...row,
      created_at: new Date().toISOString(),
    }
    memNotifs = [item, ...memNotifs].slice(0, MAX_STORED)
    return item
  }

  const notif = rowToNotif(data)
  await trimOldNotifications()
  return notif
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

export async function listAppNotifications(limit = 40): Promise<AppNotification[]> {
  const { data, error } = await supabaseAdmin
    .from('app_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    await memFallback()
    return [...memNotifs]
  }
  return (data ?? []).map(rowToNotif)
}
