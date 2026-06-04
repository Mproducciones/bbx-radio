import type { AppNotification } from '@/lib/appNotificationsStore'
import { computeExpiresAt, getDefaultVisibleHours } from '@/lib/notificationSettings'

export function notificationExpiresAt(n: AppNotification, fallbackHours = getDefaultVisibleHours()): string {
  if (n.expires_at) return n.expires_at
  return computeExpiresAt(n.created_at, fallbackHours)
}

export function isNotificationActive(
  n: AppNotification,
  now = Date.now(),
  fallbackHours = getDefaultVisibleHours(),
): boolean {
  const exp = new Date(notificationExpiresAt(n, fallbackHours)).getTime()
  return exp > now
}

export function filterActiveNotifications(
  items: AppNotification[],
  fallbackHours = getDefaultVisibleHours(),
): AppNotification[] {
  const now = Date.now()
  return items.filter(n => isNotificationActive(n, now, fallbackHours))
}
