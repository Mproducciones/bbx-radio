const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file|blob):/i

/** Sanitiza enlaces de anuncios / patrocinadores para uso en href. */
export function sanitizeAdLink(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed || trimmed === '#') return undefined
  if (BLOCKED_PROTOCOLS.test(trimmed)) return undefined

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed.split(/[\r\n]/)[0].slice(0, 500)
  }

  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return undefined
    return u.href
  } catch {
    return undefined
  }
}

/** URL de destino en notificaciones push — solo rutas internas del sitio. */
export function sanitizePushUrl(raw: string | undefined | null, siteOrigin: string): string {
  const fallback = '/'
  if (!raw) return fallback
  const trimmed = raw.trim().split(/[\r\n]/)[0].slice(0, 500)
  if (!trimmed || BLOCKED_PROTOCOLS.test(trimmed)) return fallback

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  try {
    const u = new URL(trimmed)
    const base = new URL(siteOrigin)
    if (u.origin === base.origin) {
      return u.pathname + u.search + u.hash || '/'
    }
  } catch {
    /* invalid */
  }
  return fallback
}

/** Valida endpoint de Web Push (HTTPS, host conocido o genérico seguro). */
export function isValidPushEndpoint(endpoint: string): boolean {
  try {
    const u = new URL(endpoint)
    if (u.protocol !== 'https:') return false
    if (u.username || u.password) return false
    return u.hostname.length > 0 && u.hostname.length <= 253
  } catch {
    return false
  }
}

export function isValidPushKey(value: unknown, maxLen = 256): value is string {
  return typeof value === 'string' && value.length >= 20 && value.length <= maxLen && /^[\w+/=-]+$/.test(value)
}
