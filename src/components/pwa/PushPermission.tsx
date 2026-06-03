'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64: string) {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export function PushPermission() {
  const [show, setShow]   = useState(false)
  const [done, setDone]   = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission !== 'default') return
    const seen = localStorage.getItem('push_prompt_seen')
    if (seen) return
    // Mostrar después de 20 segundos de uso
    const t = setTimeout(() => setShow(true), 20_000)
    return () => clearTimeout(t)
  }, [])

  async function subscribe() {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setDone(true)
      localStorage.setItem('push_prompt_seen', '1')
      setTimeout(() => setShow(false), 2000)
    } catch {
      dismiss()
    }
  }

  function dismiss() {
    localStorage.setItem('push_prompt_seen', '1')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed z-[200] md:hidden"
          style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px) + 8px)', left: 12, right: 12 }}
        >
          <div className="rounded-2xl p-4 shadow-2xl"
            style={{ background: '#0F0F1A', border: '1px solid rgba(219,137,24,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {done ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <p className="text-white font-semibold text-sm">¡Listo! Te avisaremos de lo importante</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl flex-shrink-0">📻</span>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">¿Querés enterarte primero?</p>
                    <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                      Activá las notificaciones y te avisamos de concursos, shows en vivo y noticias de la radio.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={subscribe}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-[#07070E]"
                    style={{ background: '#db8918' }}>
                    Activar
                  </button>
                  <button onClick={dismiss}
                    className="px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    Ahora no
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
