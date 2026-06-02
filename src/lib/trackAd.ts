'use client'

export function getAdSessionId(): string {
  if (typeof sessionStorage === 'undefined') return 'ssr'
  let id = sessionStorage.getItem('pulso_ad_session')
  if (!id) {
    id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('pulso_ad_session', id)
  }
  return id
}

export function trackAdEvent(payload: {
  adId: string
  adTipo: string
  eventType: 'impression' | 'click'
  placement: string
}) {
  if (!payload.adId || payload.adId === 'demo') return
  const body = JSON.stringify({ ...payload, sessionId: getAdSessionId() })
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/ads/events', new Blob([body], { type: 'application/json' }))
    return
  }
  fetch('/api/ads/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

export function impressionKey(adId: string, placement: string) {
  return `ad_imp_${adId}_${placement}`
}
