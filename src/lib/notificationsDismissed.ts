const SESSION_KEY = 'bbx_notif_bubble_dismissed_v1'

export function getBubbleDismissedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

export function dismissBubbleNotification(id: string) {
  const set = getBubbleDismissedIds()
  set.add(id)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set].slice(-80)))
}
