const STORAGE_KEY = 'bbx_notif_read_v1'
const MAX_READ_IDS = 200

export function getReadNotificationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

export function markNotificationRead(id: string) {
  const set = getReadNotificationIds()
  set.add(id)
  const arr = [...set].slice(-MAX_READ_IDS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

export function markAllNotificationsRead(ids: string[]) {
  const set = getReadNotificationIds()
  ids.forEach(id => set.add(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].slice(-MAX_READ_IDS)))
}

export function countUnread(ids: string[]): number {
  const read = getReadNotificationIds()
  return ids.filter(id => !read.has(id)).length
}
