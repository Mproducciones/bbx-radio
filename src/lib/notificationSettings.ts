/** Horas que un aviso permanece en la lista de En Vivo (fallback si no hay expires_at). */
export const NOTIFICATION_VISIBLE_PRESETS = [
  { hours: 6, label: '6 horas' },
  { hours: 24, label: '24 horas' },
  { hours: 48, label: '2 días' },
  { hours: 72, label: '3 días' },
  { hours: 168, label: '7 días' },
] as const

export type NotificationVisibleHours = (typeof NOTIFICATION_VISIBLE_PRESETS)[number]['hours']

export function getDefaultVisibleHours(): number {
  const raw = process.env.APP_NOTIFICATION_VISIBLE_HOURS
  const n = raw ? Number(raw) : 48
  if (!Number.isFinite(n) || n < 1) return 48
  return Math.min(168, Math.floor(n))
}

export function clampVisibleHours(h: unknown): number {
  const n = typeof h === 'number' ? h : Number(h)
  if (!Number.isFinite(n)) return getDefaultVisibleHours()
  return Math.min(168, Math.max(1, Math.floor(n)))
}

export function computeExpiresAt(createdAt: string, visibleHours: number): string {
  const base = new Date(createdAt).getTime()
  return new Date(base + visibleHours * 3_600_000).toISOString()
}
