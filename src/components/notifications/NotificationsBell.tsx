'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { EASE_OUT } from '@/lib/motion/framer'

type AppNotification = {
  id: string
  title: string
  body: string
  url: string
  created_at: string
}

const HIDDEN_PREFIXES = ['/admin', '/bbx-admin', '/studio']

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

export function NotificationsBell() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [dbHint, setDbHint] = useState<string | null>(null)

  const hidden = HIDDEN_PREFIXES.some(p => pathname.startsWith(p))

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

  if (hidden) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="app-notif-bell"
        aria-label={unread > 0 ? `${unread} notificaciones sin leer` : 'Notificaciones'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[1.15rem] h-[1.15rem]" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
        </svg>
        {unread > 0 && (
          <span className="app-notif-bell__badge" aria-hidden>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
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
              role="dialog"
              aria-label="Notificaciones de la radio"
            >
              <div className="app-notif-panel__head">
                <div>
                  <p className="app-notif-panel__eyebrow">Radio Bienvenida</p>
                  <h2 className="app-notif-panel__title">Notificaciones</h2>
                </div>
                {items.length > 0 && unread > 0 && (
                  <button type="button" onClick={markAllRead} className="app-notif-panel__mark">
                    Marcar leídas
                  </button>
                )}
              </div>

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
