'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppNotifications } from '@/hooks/useAppNotifications'
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel'
import type { AppNotification } from '@/lib/appNotificationsStore'
import { EASE_OUT } from '@/lib/motion/framer'

/** Campanita fija en el header de En Vivo — lista de avisos del locutor. */
export function NotificationsInbox({ className = '' }: { className?: string }) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const { items, loading, unread, dbHint, refresh, markAllRead, markRead } = useAppNotifications(true)

  useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  function openItem(n: AppNotification) {
    markRead(n.id)
    setOpen(false)
    router.push(n.url.startsWith('/') ? n.url : '/')
  }

  return (
    <div ref={rootRef} className={`app-notif-inbox ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="app-notif-inbox__btn"
        aria-label={unread > 0 ? `${unread} avisos sin leer` : 'Avisos de la radio'}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" className="app-notif-inbox__icon" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
        </svg>
        {unread > 0 && (
          <span className="app-notif-inbox__badge" aria-hidden>
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
              className="app-notif-inbox__backdrop md:hidden"
              aria-label="Cerrar avisos"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="app-notif-inbox__panel"
              role="dialog"
              aria-label="Avisos de la radio"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="app-notif-panel__close app-notif-inbox__close"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
              <NotificationsPanel
                items={items}
                loading={loading}
                unread={unread}
                dbHint={dbHint}
                onMarkAllRead={markAllRead}
                onOpenItem={openItem}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
