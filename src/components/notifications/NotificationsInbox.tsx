'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppNotifications } from '@/hooks/useAppNotifications'
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel'
import { SheetPortal } from '@/components/shared/SheetPortal'
import type { AppNotification } from '@/lib/appNotificationsStore'
import { EASE_OUT } from '@/lib/motion/framer'

/** Campanita fija en el header de En Vivo — lista de avisos del locutor. */
export function NotificationsInbox({ className = '' }: { className?: string }) {
  const router = useRouter()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null)
  const { items, loading, unread, dbHint, refresh, markAllRead, markRead } = useAppNotifications(true)

  useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  useEffect(() => {
    if (!open) {
      delete document.body.dataset.inboxOpen
      return
    }
    document.body.dataset.inboxOpen = 'true'
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function syncAnchor() {
      const el = btnRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setAnchor({ top: rect.bottom, right: window.innerWidth - rect.right })
    }
    syncAnchor()
    window.addEventListener('resize', syncAnchor)
    window.addEventListener('scroll', syncAnchor, true)

    return () => {
      delete document.body.dataset.inboxOpen
      document.body.style.overflow = prev
      window.removeEventListener('resize', syncAnchor)
      window.removeEventListener('scroll', syncAnchor, true)
    }
  }, [open])

  function openItem(n: AppNotification) {
    markRead(n.id)
    setOpen(false)
    router.push(n.url.startsWith('/') ? n.url : '/')
  }

  const panelStyle = anchor && typeof window !== 'undefined' && window.innerWidth >= 768
    ? ({
        ['--inbox-panel-top' as string]: `${anchor.top + 8}px`,
        ['--inbox-panel-right' as string]: `${Math.max(8, anchor.right)}px`,
      } as CSSProperties)
    : undefined

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`app-notif-inbox__btn ${className}`}
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

      <SheetPortal>
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="app-notif-inbox__backdrop"
                aria-label="Cerrar avisos"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="app-notif-inbox__panel"
                style={panelStyle}
                role="dialog"
                aria-modal="true"
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
      </SheetPortal>
    </>
  )
}
