'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { getDemoAds } from '@/lib/demoCampaigns'
import { sanitizeAdLink } from '@/lib/safeUrl'

interface PremiumAd {
  _id: string
  nombre: string
  cliente?: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  enlace?: string
}

/** En Vivo el play queda abajo — el banner fijo lo tapaba */
const EXCLUDED = [
  '/',
  '/admin',
  '/studio',
  '/bbx',
  '/tv',
  '/anunciate',
  '/patrocinadores',
  '/programacion',
  '/participa',
  '/saludos',
  '/noticias',
  '/eventos',
  '/replay',
]
const DISMISS_KEY = 'premium_ad_dismissed'
const DISMISS_MINUTES = 30

function defaultPremiumAd(): PremiumAd {
  const demo = getDemoAds('banner_premium')[0]
  if (demo) {
    return {
      _id: demo._id,
      nombre: demo.nombre,
      cliente: demo.cliente,
      tagline: demo.tagline,
      cta: demo.cta,
      colorAccent: demo.colorAccent,
      imagenUrl: demo.imagenUrl,
      enlace: demo.enlace,
    }
  }
  return {
    _id: 'demo',
    nombre: 'Tu negocio aquí',
    cliente: 'Tu Empresa · Rancagua',
    tagline: 'Llega a miles de oyentes en O\'Higgins',
    cta: 'Anunciate',
    colorAccent: '#db8918',
    enlace: '/anunciate',
  }
}

export function PremiumAdBanner() {
  const pathname = usePathname()
  const [ad, setAd]           = useState<PremiumAd>(defaultPremiumAd)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (EXCLUDED.some(p => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) {
      setVisible(false)
      return
    }

    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    if (dismissed && Date.now() - parseInt(dismissed, 10) < DISMISS_MINUTES * 60_000) return

    setVisible(true)

    fetch('/api/ads?tipo=banner_premium')
      .then(r => r.ok ? r.json() : [])
      .then((ads: PremiumAd[]) => {
        if (ads.length > 0) setAd(ads[0])
      })
      .catch(() => {})
  }, [pathname])

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  const accent = ad.colorAccent ?? '#db8918'
  const link = sanitizeAdLink(ad.enlace)

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
            bottom: 'calc(var(--app-nav-total) + var(--app-mini-player-total) + 4px)',
            left: 'var(--app-shell-pad-x)',
            right: 'var(--app-shell-pad-right)',
          }}
        >
          <AdTrackView adId={ad._id} adTipo="banner_premium" placement="premium_mobile">
          <a
            href={link ?? '#'}
            target={link?.startsWith('http') ? '_blank' : undefined}
            rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
            onClick={() => trackAdClick(ad._id, 'banner_premium', 'premium_mobile')}
            className="relative block rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: `0 8px 32px ${accent}30, 0 2px 8px rgba(0,0,0,0.5)` }}
          >
            <div className="relative h-20 w-full">
              {ad.imagenUrl && (
                <img src={ad.imagenUrl} alt={ad.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.92) 0%, rgba(7,7,14,0.75) 50%, rgba(7,7,14,0.4) 100%)' }} />
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

              <div className="absolute inset-0 flex items-center px-4 gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                    style={{ color: accent, background: `${accent}25`, border: `1px solid ${accent}40` }}>
                    PATROCINADOR
                  </span>
                  <p className="text-white font-bold text-sm leading-tight truncate mt-0.5">{ad.cliente ?? ad.nombre}</p>
                  {ad.tagline && <p className="text-white/60 text-xs truncate">{ad.tagline}</p>}
                </div>
                {ad.cta && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
                    style={{ background: accent, color: '#07070E' }}>
                    {ad.cta}
                  </span>
                )}
              </div>
            </div>
          </a>
          </AdTrackView>

          <button onClick={e => { e.preventDefault(); e.stopPropagation(); dismiss() }}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10 text-white/70"
            style={{ background: 'rgba(7,7,14,0.85)' }} aria-label="Cerrar anuncio">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PremiumAdSidebar() {
  const [ad, setAd] = useState<PremiumAd>(defaultPremiumAd)

  useEffect(() => {
    fetch('/api/ads?tipo=banner_premium')
      .then(r => r.ok ? r.json() : [])
      .then((ads: PremiumAd[]) => { if (ads.length > 0) setAd(ads[0]) })
      .catch(() => {})
  }, [])

  const accent = ad.colorAccent ?? '#db8918'
  const link = sanitizeAdLink(ad.enlace)

  return (
    <AdTrackView adId={ad._id} adTipo="banner_premium" placement="premium_sidebar">
    <a href={link ?? '#'}
      target={link?.startsWith('http') ? '_blank' : undefined}
      rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={() => trackAdClick(ad._id, 'banner_premium', 'premium_sidebar')}
      className="block relative rounded-xl overflow-hidden mx-4 mb-4"
      style={{ border: `1px solid ${accent}30` }}>
      <div className="relative h-16">
        {ad.imagenUrl && <img src={ad.imagenUrl} alt={ad.nombre} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.9) 0%, rgba(7,7,14,0.6) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <div className="absolute inset-0 flex items-center px-3 gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{ad.cliente ?? ad.nombre}</p>
            {ad.tagline && <p className="text-white/50 text-[10px] truncate">{ad.tagline}</p>}
          </div>
          <span className="text-[9px] font-black flex-shrink-0" style={{ color: accent }}>AD</span>
        </div>
      </div>
    </a>
    </AdTrackView>
  )
}
