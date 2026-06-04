'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  countUnread,
  getReadNotificationIds,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notificationsRead'
import {
  getLocalNotifications,
  mergeNotifications,
  saveLocalNotification,
} from '@/lib/notificationsLocalCache'
import {
  bellFabSize,
  clampBellPosition,
  defaultBellPosition,
  loadBellLayout,
  saveBellLayout,
  type NotificationsBellLayout,
} from '@/lib/notificationsBellLayout'
import { EASE_OUT } from '@/lib/motion/framer'

type AppNotification = {
  id: string
  title: string
  body: string
  url: string
  created_at: string
}

const HIDDEN_PREFIXES = ['/admin', '/bbx-admin', '/studio']
const DRAG_THRESHOLD = 6

function formatWhen(iso: string) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60_000) return 'Ahora'
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}

function panelStyleForBell(rect: DOMRect, panelMaxH: number): CSSProperties {
  const gutterL = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-gutter-left')) || 16
  const gutterR = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-gutter-right')) || 16
  const navBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-nav-total')) || 72
  const panelW = Math.min(352, window.innerWidth - gutterL - gutterR)
  let left = rect.right - panelW
  let top = rect.bottom + 8

  if (top + panelMaxH > window.innerHeight - navBottom - 8) {
    top = Math.max(8, rect.top - panelMaxH - 8)
  }

  left = Math.min(window.innerWidth - gutterR - panelW, Math.max(gutterL, left))

  return {
    top,
    left,
    right: 'auto',
    width: panelW,
    maxHeight: panelMaxH,
  }
}

export function NotificationsBell() {
  const router = useRouter()
  const pathname = usePathname()
  const fabRef = useRef<HTMLDivElement>(null)
  const blockClickRef = useRef(false)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [dbHint, setDbHint] = useState<string | null>(null)
  const [layout, setLayout] = useState<NotificationsBellLayout | null>(null)
  const [dragging, setDragging] = useState(false)
  const [panelPos, setPanelPos] = useState<CSSProperties | null>(null)
  const layoutRef = useRef<NotificationsBellLayout | null>(null)
  layoutRef.current = layout

  const hidden = HIDDEN_PREFIXES.some(p => pathname.startsWith(p))
  const minimized = layout?.minimized ?? false
  const fabSize = bellFabSize(minimized)

  const applyList = useCallback((list: AppNotification[]) => {
    setItems(list)
    setUnread(countUnread(list.map(n => n.id)))
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?t=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json()
      const remote = (data.items ?? []) as AppNotification[]
      const local = getLocalNotifications()
      const merged = mergeNotifications(remote, local)
      applyList(merged)
      if (!data.dbReady) {
        setDbHint(data.hint ?? data.dbError ?? 'Falta tabla app_notifications en Supabase.')
      } else {
        setDbHint(null)
        if (remote.length > 0) {
          remote.forEach(n => saveLocalNotification(n))
        }
      }
    } catch {
      const local = getLocalNotifications()
      applyList(local)
      setDbHint(local.length ? null : 'Sin conexión al servidor de avisos.')
    } finally {
      setLoading(false)
    }
  }, [applyList])

  useEffect(() => {
    if (hidden) return
    const saved = loadBellLayout()
    setLayout(saved ? clampBellPosition(saved.x, saved.y, saved.minimized) : defaultBellPosition(false))
  }, [hidden])

  useEffect(() => {
    if (hidden) return
    function onResize() {
      setLayout(prev => (prev ? clampBellPosition(prev.x, prev.y, prev.minimized) : defaultBellPosition(false)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [hidden])

  useEffect(() => {
    if (hidden) return
    refresh()
    const t = setInterval(refresh, 90_000)
    return () => clearInterval(t)
  }, [hidden, refresh])

  useEffect(() => {
    if (hidden) return
    function onRefresh() { refresh() }
    window.addEventListener('bbx-notifications-refresh', onRefresh)
    function onSwMessage(e: MessageEvent) {
      if (e.data?.type === 'BBX_PUSH') onRefresh()
    }
    navigator.serviceWorker?.addEventListener('message', onSwMessage)
    return () => {
      window.removeEventListener('bbx-notifications-refresh', onRefresh)
      navigator.serviceWorker?.removeEventListener('message', onSwMessage)
    }
  }, [hidden, refresh])

  useEffect(() => {
    if (!open || hidden) return
    refresh()
  }, [open, hidden, refresh])

  useEffect(() => {
    if (!open || !fabRef.current) {
      setPanelPos(null)
      return
    }
    const rect = fabRef.current.getBoundingClientRect()
    setPanelPos(panelStyleForBell(rect, Math.min(window.innerHeight * 0.7, 448)))
  }, [open, layout, minimized])

  const persistLayout = useCallback((next: NotificationsBellLayout) => {
    const clamped = clampBellPosition(next.x, next.y, next.minimized)
    setLayout(clamped)
    saveBellLayout(clamped)
  }, [])

  function onFabPointerDown(e: React.PointerEvent) {
    if (!layout || e.button !== 0) return
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: layout.x,
      originY: layout.y,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onFabPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId || !layout) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    d.moved = true
    setDragging(true)
    setOpen(false)
    const next = clampBellPosition(d.originX + dx, d.originY + dy, layout.minimized)
    setLayout(next)
  }

  function onFabPointerUp(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId || !layout) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    if (d.moved && layoutRef.current) {
      persistLayout(layoutRef.current)
      blockClickRef.current = true
    }
    dragRef.current = null
    setDragging(false)
  }

  function toggleMinimized(e: React.MouseEvent) {
    e.stopPropagation()
    blockClickRef.current = true
    if (!layout) return
    const nextMin = !layout.minimized
    const sizeBefore = bellFabSize(layout.minimized)
    const sizeAfter = bellFabSize(nextMin)
    const cx = layout.x + sizeBefore / 2
    const cy = layout.y + sizeBefore / 2
    persistLayout(
      clampBellPosition(cx - sizeAfter / 2, cy - sizeAfter / 2, nextMin),
    )
    setOpen(false)
  }

  function onBellClick() {
    if (blockClickRef.current) {
      blockClickRef.current = false
      return
    }
    if (dragging) return
    if (minimized && layout) {
      persistLayout({ ...layout, minimized: false })
      return
    }
    setOpen(v => !v)
  }

  function openItem(n: AppNotification) {
    markNotificationRead(n.id)
    setUnread(countUnread(items.map(i => i.id)))
    setOpen(false)
    router.push(n.url.startsWith('/') ? n.url : '/')
  }

  function markAllRead() {
    markAllNotificationsRead(items.map(n => n.id))
    setUnread(0)
  }

  if (hidden || !layout) return null

  const fabStyle: CSSProperties = {
    left: layout.x,
    top: layout.y,
    width: fabSize,
    height: fabSize,
  }

  return (
    <>
      <div
        ref={fabRef}
        className={`app-notif-fab ${minimized ? 'is-minimized' : ''} ${dragging ? 'is-dragging' : ''}`}
        style={fabStyle}
        onPointerDown={onFabPointerDown}
        onPointerMove={onFabPointerMove}
        onPointerUp={onFabPointerUp}
        onPointerCancel={onFabPointerUp}
      >
        <button
          type="button"
          onPointerDown={e => e.stopPropagation()}
          onClick={toggleMinimized}
          className="app-notif-fab__minimize"
          aria-label={minimized ? 'Mostrar campanita' : 'Minimizar campanita'}
          title={minimized ? 'Mostrar' : 'Minimizar'}
        >
          {minimized ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onBellClick}
          className="app-notif-bell"
          aria-label={
            minimized
              ? unread > 0
                ? `Expandir notificaciones, ${unread} sin leer`
                : 'Expandir notificaciones'
              : unread > 0
                ? `${unread} notificaciones sin leer`
                : 'Notificaciones'
          }
          aria-expanded={!minimized && open}
        >
          <svg viewBox="0 0 24 24" fill="none" className="app-notif-bell__icon" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
          </svg>
          {unread > 0 && (
            <span className="app-notif-bell__badge" aria-hidden>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && !minimized && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="app-notif-backdrop"
              aria-label="Cerrar notificaciones"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="app-notif-panel"
              style={panelPos ?? undefined}
              role="dialog"
              aria-label="Notificaciones de la radio"
            >
              <div className="app-notif-panel__head">
                <div>
                  <p className="app-notif-panel__eyebrow">Radio Bienvenida</p>
                  <h2 className="app-notif-panel__title">Notificaciones</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {items.length > 0 && unread > 0 && (
                    <button type="button" onClick={markAllRead} className="app-notif-panel__mark">
                      Marcar leídas
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="app-notif-panel__close"
                    aria-label="Cerrar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="app-notif-panel__hint">Arrastra la campanita para moverla · botón − para minimizar</p>

              <div className="app-notif-panel__list">
                {loading && items.length === 0 && (
                  <p className="app-notif-panel__empty">Cargando…</p>
                )}
                {dbHint && (
                  <p className="app-notif-panel__empty text-[#db8918]/90">
                    {dbHint}
                  </p>
                )}
                {!loading && items.length === 0 && !dbHint && (
                  <p className="app-notif-panel__empty">
                    Aún no hay avisos. Cuando el locutor envíe uno desde el panel, aparecerá aquí.
                  </p>
                )}
                {items.map(n => {
                  const isUnread = !getReadNotificationIds().has(n.id)
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => openItem(n)}
                      className={`app-notif-item ${isUnread ? 'is-unread' : ''}`}
                    >
                      {isUnread && <span className="app-notif-item__dot" aria-hidden />}
                      <div className="min-w-0 flex-1 text-left">
                        <p className="app-notif-item__title">{n.title}</p>
                        <p className="app-notif-item__body">{n.body}</p>
                        <p className="app-notif-item__meta">{formatWhen(n.created_at)}</p>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0 opacity-40" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
