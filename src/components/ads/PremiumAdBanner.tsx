'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// El anunciante que más paga — visible en TODAS las pantallas
const PREMIUM_AD = {
  business:  'AutoMundo Rancagua',
  tagline:   'Tu próximo auto te está esperando',
  cta:       'Ver catálogo',
  href:      'https://wa.me/56922105555',  // Reemplazar con URL real del anunciante
  image:     'https://picsum.photos/seed/automundo2024/800/200',
  accent:    '#40B9BF',   // Teal corporativo
  badge:     'PATROCINADOR OFICIAL',
}

const DISMISS_KEY = 'premium_ad_dismissed'
const DISMISS_MINUTES = 30

export function PremiumAdBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // No mostrar en admin/studio/bbx
    if (pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.startsWith('/bbx')) {
      setVisible(false)
      return
    }

    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const elapsed = Date.now() - parseInt(dismissed, 10)
      if (elapsed < DISMISS_MINUTES * 60_000) { setVisible(false); return }
    }
    setVisible(true)
  }, [pathname])

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32, delay: 1.5 }}
          className="fixed z-[90] md:hidden"
          style={{
            bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 4px)',
            left: 8,
            right: 8,
          }}
        >
          <a
            href={PREMIUM_AD.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: `0 8px 32px rgba(64,185,191,0.25), 0 2px 8px rgba(0,0,0,0.5)` }}
          >
            {/* Imagen de fondo */}
            <div className="relative h-20 w-full">
              <img
                src={PREMIUM_AD.image}
                alt={PREMIUM_AD.business}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay degradado para legibilidad */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.92) 0%, rgba(7,7,14,0.75) 50%, rgba(7,7,14,0.4) 100%)' }}
              />
              {/* Línea accent top */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${PREMIUM_AD.accent}, transparent)` }} />

              {/* Contenido */}
              <div className="absolute inset-0 flex items-center px-4 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: PREMIUM_AD.accent, background: `${PREMIUM_AD.accent}25`, border: `1px solid ${PREMIUM_AD.accent}40` }}
                    >
                      {PREMIUM_AD.badge}
                    </span>
                  </div>
                  <p className="text-white font-bold text-sm leading-tight truncate">{PREMIUM_AD.business}</p>
                  <p className="text-white/60 text-xs truncate">{PREMIUM_AD.tagline}</p>
                </div>

                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
                  style={{ background: PREMIUM_AD.accent, color: '#07070E' }}
                >
                  {PREMIUM_AD.cta}
                </span>
              </div>
            </div>
          </a>

          {/* Botón cerrar */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss() }}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10 text-white/70 hover:text-white transition-colors"
            style={{ background: 'rgba(7,7,14,0.85)' }}
            aria-label="Cerrar anuncio"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Versión compacta para el sidebar de desktop
export function PremiumAdSidebar() {
  return (
    <a
      href={PREMIUM_AD.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative rounded-xl overflow-hidden mx-4 mb-4"
      style={{ border: `1px solid ${PREMIUM_AD.accent}30` }}
    >
      <div className="relative h-16">
        <img
          src={PREMIUM_AD.image}
          alt={PREMIUM_AD.business}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.9) 0%, rgba(7,7,14,0.6) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${PREMIUM_AD.accent}, transparent)` }} />
        <div className="absolute inset-0 flex items-center px-3 gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{PREMIUM_AD.business}</p>
            <p className="text-white/50 text-[10px] truncate">{PREMIUM_AD.tagline}</p>
          </div>
          <span className="text-[9px] font-black flex-shrink-0" style={{ color: PREMIUM_AD.accent }}>AD</span>
        </div>
      </div>
    </a>
  )
}
