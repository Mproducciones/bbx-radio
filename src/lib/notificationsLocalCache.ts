import type { AppNotification } from '@/lib/appNotificationsStore'

const KEY = 'bbx_notif_cache_v1'
const MAX = 40

export function getLocalNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return []
    return arr.filter(
      (n): n is AppNotification =>
        n != null
        && typeof n === 'object'
        && typeof (n as AppNotification).id === 'string'
        && typeof (n as AppNotification).title === 'string',
    )
  } catch {
    return []
  }
}

export function saveLocalNotification(n: AppNotification) {
  const existing = getLocalNotifications().filter(x => x.id !== n.id)
  const next = [n, ...existing]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function mergeNotifications(
  remote: AppNotification[],
  local: AppNotification[],
): AppNotification[] {
  const map = new Map<string, AppNotification>()
  for (const n of [...remote, ...local]) {
    if (!map.has(n.id)) map.set(n.id, n)
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}
