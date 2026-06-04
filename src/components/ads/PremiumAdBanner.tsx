'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { AdTrackView, trackAdClick } from '@/components/ads/AdTrackView'
import { getDemoAds } from '@/lib/demoCampaigns'
import { demoAdsForSponsorTier, readSponsorDemoTier, SPONSOR_DEMO_CHANGE_EVENT } from '@/lib/sponsorAdTiers'
import { sanitizeAdLink } from '@/lib/safeUrl'
import { RADIO_AD } from '@/lib/radioAdBranding'
import { isExclusiveCampaign } from '@/lib/adExclusivity'

interface PremiumAd {
  _id: string
  nombre: string
  cliente?: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
  enlace?: string
  planContratado?: string
  exclusivoApp?: boolean
  prioridad?: number
}

/** Rutas donde el banner fijo taparía formularios — va embebido en la página */
export const PREMIUM_AD_INLINE_ROUTES = ['/participa', '/saludos'] as const

/** En Vivo el play queda abajo — el banner fijo lo tapaba */
const FIXED_EXCLUDED = [
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

const DISMISS_KEY_FIXED = 'premium_ad_dismissed'
const DISMISS_KEY_INLINE = 'premium_ad_inline_dismissed'
const DISMISS_MINUTES = 30

function defaultPremiumAd(): PremiumAd {
  const tier = readSponsorDemoTier()
  const overrides = tier ? demoAdsForSponsorTier(tier) : undefined
  const demo = getDemoAds('banner_premium', overrides)[0]
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
    nombre: RADIO_AD.stationName,
    cliente: RADIO_AD.stationName,
    tagline: RADIO_AD.pautaTagline,
    cta: 'Anunciate',
    colorAccent: '#db8918',
    enlace: '/anunciate',
  }
}

function isDismissed(key: string) {
  if (typeof sessionStorage === 'undefined') return false
  const dismissed = sessionStorage.getItem(key)
  return !!(dismissed && Date.now() - parseInt(dismissed, 10) < DISMISS_MINUTES * 60_000)
}

function usePremiumAd(pathname: string, mode: 'fixed' | 'inline') {
  const [ad, setAd] = useState<PremiumAd>(defaultPremiumAd)
  const [visible, setVisible] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    function syncVisibility() {
      const tier = readSponsorDemoTier()
      const isInlineRoute = PREMIUM_AD_INLINE_ROUTES.some(r => pathname.startsWith(r))
      const showForTierDemo = tier === 'premium' || tier === 'empresarial'

      if (mode === 'fixed') {
        if (FIXED_EXCLUDED.some(p => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) {
          setVisible(false)
          return
        }
        if (isDismissed(DISMISS_KEY_FIXED)) {
          setVisible(false)
          return
        }
        setVisible(true)
      } else {
        if (!isInlineRoute || !showForTierDemo) {
          setVisible(false)
          return
        }
        if (isDismissed(DISMISS_KEY_INLINE)) {
          setVisible(false)
          return
        }
        setVisible(true)
      }

      setImgFailed(false)
      setAd(defaultPremiumAd())
    }

    syncVisibility()

    fetch('/api/ads?tipo=banner_premium')
      .then(r => r.ok ? r.json() : [])
      .then((ads: PremiumAd[]) => {
        if (ads.length > 0) {
          setAd(ads[0])
          setImgFailed(false)
        }
      })
      .catch(() => {})

    window.addEventListener(SPONSOR_DEMO_CHANGE_EVENT, syncVisibility)
    return () => window.removeEventListener(SPONSOR_DEMO_CHANGE_EVENT, syncVisibility)
  }, [pathname, mode])

  return { ad, visible, setVisible, imgFailed, setImgFailed }
}

function PremiumAdCard({
  ad,
  imgFailed,
  setImgFailed,
  compact,
  placement,
  onDismiss,
}: {
  ad: PremiumAd
  imgFailed: boolean
  setImgFailed: (v: boolean) => void
  compact?: boolean
  placement: string
  onDismiss: () => void
}) {
  const accent = ad.colorAccent ?? '#db8918'
  const link = sanitizeAdLink(ad.enlace)
  const title = ad.cliente ?? ad.nombre
  const showImg = Boolean(ad.imagenUrl) && !imgFailed
  const sponsorLabel = isExclusiveCampaign(ad) ? 'EXCLUSIVO' : 'PATROCINADOR'
  const height = compact ? 'h-14' : 'h-20'

  return (
    <div className="relative w-full min-w-0 max-w-full">
      <AdTrackView adId={ad._id} adTipo="banner_premium" placement={placement}>
        <a
          href={link ?? '#'}
          target={link?.startsWith('http') ? '_blank' : undefined}
          rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={() => trackAdClick(ad._id, 'banner_premium', placement)}
          className="relative block rounded-xl overflow-hidden w-full"
          style={{ boxShadow: compact ? undefined : `0 8px 32px ${accent}30, 0 2px 8px rgba(0,0,0,0.5)` }}
        >
          <div
            className={`relative ${height} w-full`}
            style={{
              background: showImg
                ? undefined
                : `linear-gradient(120deg, color-mix(in srgb, ${accent} 24%, #07070e), #0c0c14)`,
            }}
          >
            {showImg && (
              <img
                src={ad.imagenUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
                onError={() => setImgFailed(true)}
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.92) 0%, rgba(7,7,14,0.75) 50%, rgba(7,7,14,0.4) 100%)' }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />

            <div className={`absolute inset-0 flex items-center gap-2.5 ${compact ? 'px-3' : 'px-4 gap-3'}`}>
              {!showImg && (
                <div
                  className={`${compact ? 'w-9 h-9 text-base' : 'w-11 h-11 text-lg'} rounded-lg shrink-0 flex items-center justify-center font-display font-bold`}
                  style={{ background: `${accent}28`, color: accent, border: `1px solid ${accent}40` }}
                  aria-hidden
                >
                  {title.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                  style={{ color: accent, background: `${accent}25`, border: `1px solid ${accent}40` }}
                >
                  {sponsorLabel}
                </span>
                <p className={`text-white font-bold leading-tight truncate mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {ad.cliente ?? ad.nombre}
                </p>
                {ad.tagline && (
                  <p className={`text-white/60 truncate ${compact ? 'text-[10px]' : 'text-xs'}`}>{ad.tagline}</p>
                )}
              </div>
              {ad.cta && (
                <span
                  className={`font-bold rounded-lg shrink-0 ${compact ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1.5 rounded-xl'}`}
                  style={{ background: accent, color: '#07070E' }}
                >
                  {ad.cta}
                </span>
              )}
            </div>
          </div>
        </a>
      </AdTrackView>

      <button
        type="button"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onDismiss()
        }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center z-10 text-white/70"
        style={{ background: 'rgba(7,7,14,0.85)' }}
        aria-label="Cerrar anuncio"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  )
}

/** Banner fijo — solo en pantallas sin formularios largos */
export function PremiumAdBanner() {
  const pathname = usePathname()
  const { ad, visible, setVisible, imgFailed, setImgFailed } = usePremiumAd(pathname, 'fixed')

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY_FIXED, String(Date.now()))
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
          className="premium-ad-fixed fixed z-[90] md:hidden"
          style={{
            bottom: 'calc(var(--app-nav-total) + var(--app-mini-player-total) + 4px)',
            left: 'var(--app-shell-pad-x)',
            right: 'var(--app-shell-pad-right)',
          }}
        >
          <PremiumAdCard
            ad={ad}
            imgFailed={imgFailed}
            setImgFailed={setImgFailed}
            placement="premium_mobile"
            onDismiss={dismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Banner embebido — Participa / Saludos (no tapa el formulario) */
export function PremiumAdInline() {
  const pathname = usePathname()
  const { ad, visible, setVisible, imgFailed, setImgFailed } = usePremiumAd(pathname, 'inline')

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY_INLINE, String(Date.now()))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28 }}
          className="premium-ad-inline w-full min-w-0 max-w-full shrink-0"
        >
          <PremiumAdCard
            ad={ad}
            imgFailed={imgFailed}
            setImgFailed={setImgFailed}
            compact
            placement="premium_inline"
            onDismiss={dismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PremiumAdSidebar() {
  const [ad, setAd] = useState<PremiumAd>(defaultPremiumAd)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    fetch('/api/ads?tipo=banner_premium')
      .then(r => r.ok ? r.json() : [])
      .then((ads: PremiumAd[]) => {
        if (ads.length > 0) {
          setAd(ads[0])
          setImgFailed(false)
        }
      })
      .catch(() => {})
  }, [])

  const accent = ad.colorAccent ?? '#db8918'
  const link = sanitizeAdLink(ad.enlace)
  const title = ad.cliente ?? ad.nombre
  const showImg = Boolean(ad.imagenUrl) && !imgFailed

  return (
    <AdTrackView adId={ad._id} adTipo="banner_premium" placement="premium_sidebar">
      <a
        href={link ?? '#'}
        target={link?.startsWith('http') ? '_blank' : undefined}
        rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={() => trackAdClick(ad._id, 'banner_premium', 'premium_sidebar')}
        className="block relative rounded-xl overflow-hidden mx-4 mb-4"
        style={{ border: `1px solid ${accent}30` }}
      >
        <div
          className="relative h-16"
          style={{
            background: showImg
              ? undefined
              : `linear-gradient(120deg, color-mix(in srgb, ${accent} 22%, #07070e), #0a0a12)`,
          }}
        >
          {showImg && (
            <img
              src={ad.imagenUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(7,7,14,0.9) 0%, rgba(7,7,14,0.6) 100%)' }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
          />
          <div className="absolute inset-0 flex items-center px-3 gap-2">
            {!showImg && (
              <span
                className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ background: `${accent}28`, color: accent }}
                aria-hidden
              >
                {title.charAt(0)}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{ad.cliente ?? ad.nombre}</p>
              {ad.tagline && <p className="text-white/50 text-[10px] truncate">{ad.tagline}</p>}
            </div>
            <span className="text-[9px] font-black shrink-0" style={{ color: accent }}>
              AD
            </span>
          </div>
        </div>
      </a>
    </AdTrackView>
  )
}
