'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppNotifications } from '@/hooks/useAppNotifications'
import { dismissBubbleNotification, getBubbleDismissedIds } from '@/lib/notificationsDismissed'
import { getReadNotificationIds, markNotificationRead } from '@/lib/notificationsRead'
import { saveLocalNotification } from '@/lib/notificationsLocalCache'
import type { AppNotification } from '@/lib/appNotificationsStore'
import { EASE_OUT } from '@/lib/motion/framer'

const HIDDEN_PREFIXES = ['/admin', '/bbx-admin', '/studio']

/** Globo de aviso nuevo — visible en todas las pantallas (excepto admin). */
export function NotificationBubble() {
  const router = useRouter()
  const pathname = usePathname()
  const hidden = HIDDEN_PREFIXES.some(p => pathname.startsWith(p))
  const { items, refresh } = useAppNotifications(!hidden)

  const [expanded, setExpanded] = useState(false)
  const [dismissedTick, setDismissedTick] = useState(0)

  const bubbleTarget = useMemo(() => {
    void dismissedTick
    const dismissed = getBubbleDismissedIds()
    const read = getReadNotificationIds()
    return items.find(n => !read.has(n.id) && !dismissed.has(n.id)) ?? null
  }, [items, dismissedTick])

  useEffect(() => {
    if (!hidden && bubbleTarget) setExpanded(false)
  }, [bubbleTarget?.id, hidden])

  const dismiss = useCallback(() => {
    if (!bubbleTarget) return
    dismissBubbleNotification(bubbleTarget.id)
    setExpanded(false)
    setDismissedTick(t => t + 1)
  }, [bubbleTarget])

  const openNotification = useCallback(() => {
    if (!bubbleTarget) return
    markNotificationRead(bubbleTarget.id)
    saveLocalNotification(bubbleTarget)
    dismissBubbleNotification(bubbleTarget.id)
    setExpanded(false)
    setDismissedTick(t => t + 1)
    window.dispatchEvent(new CustomEvent('bbx-notifications-refresh'))
    router.push(bubbleTarget.url.startsWith('/') ? bubbleTarget.url : '/')
  }, [bubbleTarget, router])

  useEffect(() => {
    if (hidden) return
    function onPushToast(e: Event) {
      const d = (e as CustomEvent<AppNotification>).detail
      if (d?.id) {
        saveLocalNotification({ ...d, created_at: d.created_at ?? new Date().toISOString() })
        refresh()
      }
    }
    window.addEventListener('bbx-push-toast', onPushToast)
    return () => window.removeEventListener('bbx-push-toast', onPushToast)
  }, [hidden, refresh])

  if (hidden || !bubbleTarget) return null

  const extraUnread = items.filter(n => {
    const read = getReadNotificationIds()
    const dismissed = getBubbleDismissedIds()
    return !read.has(n.id) && !dismissed.has(n.id)
  }).length

  return (
    <AnimatePresence>
      <motion.div
        key={bubbleTarget.id}
        role="alert"
        aria-live="polite"
        initial={{ opacity: 0, y: -16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ duration: 0.28, ease: EASE_OUT }}
        className={`app-notif-bubble ${expanded ? 'is-expanded' : ''}`}
      >
        {!expanded ? (
          <button
            type="button"
            className="app-notif-bubble__pill"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
          >
            <span className="app-notif-bubble__pulse" aria-hidden />
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="app-notif-bubble__pill-text">Nuevo aviso del locutor</span>
            {extraUnread > 1 && (
              <span className="app-notif-bubble__count">{extraUnread}</span>
            )}
          </button>
        ) : (
          <div className="app-notif-bubble__card">
            <div className="app-notif-bubble__card-head">
              <span className="app-notif-bubble__label">Radio Bienvenida</span>
              <button
                type="button"
                className="app-notif-bubble__close"
                aria-label="Cerrar aviso"
                onClick={dismiss}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="app-notif-bubble__title">{bubbleTarget.title}</p>
            {bubbleTarget.body ? (
              <p className="app-notif-bubble__body">{bubbleTarget.body}</p>
            ) : null}
            <div className="app-notif-bubble__actions">
              <button type="button" className="app-notif-bubble__cta" onClick={openNotification}>
                Ver aviso
              </button>
              <button type="button" className="app-notif-bubble__later" onClick={dismiss}>
                Cerrar
              </button>
            </div>
            {pathname !== '/' && (
              <p className="app-notif-bubble__foot">
                También en <strong>En Vivo</strong> mientras esté activo el aviso.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
