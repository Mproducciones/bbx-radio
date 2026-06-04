'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getReadNotificationIds, markNotificationRead } from '@/lib/notificationsRead'
import { EASE_OUT } from '@/lib/motion/framer'

type ToastPayload = {
  id: string
  title: string
  body: string
  url: string
}

const HIDDEN_PREFIXES = ['/admin', '/bbx-admin', '/studio']
const AUTO_HIDE_MS = 7000

export function InAppNotificationToast() {
  const router = useRouter()
  const pathname = usePathname()
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const lastShownId = useRef<string | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hidden = HIDDEN_PREFIXES.some(p => pathname.startsWith(p))

  const dismiss = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = null
    setToast(null)
  }, [])

  const show = useCallback((payload: ToastPayload) => {
    if (hidden) return
    if (getReadNotificationIds().has(payload.id)) return
    if (lastShownId.current === payload.id) return
    lastShownId.current = payload.id
    setToast(payload)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(dismiss, AUTO_HIDE_MS)
  }, [hidden, dismiss])

  const openToast = useCallback(() => {
    if (!toast) return
    markNotificationRead(toast.id)
    const url = toast.url.startsWith('/') ? toast.url : '/'
    dismiss()
    window.dispatchEvent(new CustomEvent('bbx-notifications-refresh'))
    router.push(url)
  }, [toast, dismiss, router])

  const checkLatest = useCallback(async () => {
    if (hidden) return
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      const data = await res.json()
      const first = data.items?.[0] as ToastPayload | undefined
      if (!first?.id) return
      if (getReadNotificationIds().has(first.id)) return
      if (lastShownId.current === first.id) return
      show(first)
    } catch { /* ignore */ }
  }, [hidden, show])

  useEffect(() => {
    if (hidden) return
    checkLatest()

    function onPushToast(e: Event) {
      const d = (e as CustomEvent<ToastPayload>).detail
      if (d?.id && d?.title) show(d)
    }

    function onRefresh() {
      checkLatest()
    }

    function onSwMessage(e: MessageEvent) {
      const d = e.data
      if (d?.type === 'BBX_PUSH' && d.title) {
        show({
          id: d.id || `push-${Date.now()}`,
          title: d.title,
          body: d.body || '',
          url: d.url || '/',
        })
      }
    }

    window.addEventListener('bbx-push-toast', onPushToast)
    window.addEventListener('bbx-notifications-refresh', onRefresh)
    navigator.serviceWorker?.addEventListener('message', onSwMessage)

    return () => {
      window.removeEventListener('bbx-push-toast', onPushToast)
      window.removeEventListener('bbx-notifications-refresh', onRefresh)
      navigator.serviceWorker?.removeEventListener('message', onSwMessage)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [hidden, checkLatest, show])

  if (hidden) return null

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
          className="app-notif-toast"
        >
          <button type="button" className="app-notif-toast__main" onClick={openToast}>
            <span className="app-notif-toast__icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="app-notif-toast__title">{toast.title}</span>
              {toast.body ? <span className="app-notif-toast__body">{toast.body}</span> : null}
              <span className="app-notif-toast__cta">Toca para abrir</span>
            </span>
          </button>
          <button
            type="button"
            className="app-notif-toast__close"
            aria-label="Cerrar aviso"
            onClick={e => { e.stopPropagation(); dismiss() }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
