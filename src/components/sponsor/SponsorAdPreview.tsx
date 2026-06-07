'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { RADIO } from '@/lib/radioConfig'
import { RADIO_AD } from '@/lib/radioAdBranding'
import { FEATURES } from '@/lib/plan'
import {
  getTierPreview,
  appPathForTierDemo,
  type SponsorAdTierId,
} from '@/lib/sponsorAdTiers'
import { activateSponsorDemoTier } from '@/lib/sponsorDemoSession'
import { Smartphone } from 'lucide-react'

const NAV_TABS = [
  { label: 'En Vivo', active: false },
  { label: 'Grilla', active: false },
  { label: 'Participa', active: true },
  { label: 'Saludos', active: false },
  ...(FEATURES.replay ? [{ label: 'Replay', active: false }] : []),
  { label: 'TV', active: false },
]

const BARS = Array.from({ length: 16 }, (_, i) => ({
  height: 5 + (i % 3) * 4,
  delay: `${(i * 0.12).toFixed(2)}s`,
  duration: `${0.6 + (i % 3) * 0.2}s`,
}))

function PreviewBrandBanner({ tier }: { tier: ReturnType<typeof getTierPreview> }) {
  const isHero = tier.bannerVariant === 'hero'
  const isExclusive = tier.bannerVariant === 'exclusive'

  return (
    <div
      className="sponsor-preview-ad-banner relative rounded-xl overflow-hidden px-2 py-1.5 flex items-center gap-1.5 min-h-[48px] min-w-0"
      style={{
        background: isExclusive || isHero
          ? `linear-gradient(120deg, color-mix(in srgb, ${tier.color} 28%, #07070e) 0%, #0c0c14 55%, color-mix(in srgb, ${tier.color} 14%, #07070e) 100%)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid color-mix(in srgb, ${tier.color} ${isExclusive || isHero ? '50%' : '22%'}, transparent)`,
        boxShadow: isExclusive
          ? `0 6px 24px -8px color-mix(in srgb, ${tier.color} 40%, transparent)`
          : isHero
            ? `0 6px 20px -10px color-mix(in srgb, ${tier.color} 30%, transparent)`
            : undefined,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${tier.color}, transparent)` }}
      />
      <div
        className="w-8 h-8 max-md:w-7 max-md:h-7 rounded-lg shrink-0 flex items-center justify-center font-display text-sm font-bold"
        style={{
          background: `color-mix(in srgb, ${tier.color} 32%, transparent)`,
          color: tier.color,
          border: `1px solid color-mix(in srgb, ${tier.color} 45%, transparent)`,
        }}
        aria-hidden
      >
        {tier.brandInitial}
      </div>
      <div className="min-w-0 flex-1">
        {isExclusive && tier.programBadge && (
          <p
            className="text-[6px] font-black uppercase tracking-[0.14em] truncate mb-0.5"
            style={{ color: tier.color }}
          >
            {tier.programBadge}
          </p>
        )}
        <p className="text-[10px] font-bold text-white truncate leading-tight">{tier.cliente}</p>
        <p className="text-[7px] text-white/50 truncate mt-0.5">{tier.taglineAd}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-0.5 shrink-0 max-w-[42%]">
        {isExclusive && (
          <span
            className="text-[6px] font-black uppercase px-1 py-0.5 rounded-md"
            style={{ background: tier.color, color: '#07070e' }}
          >
            Exclusivo
          </span>
        )}
        {isHero && !isExclusive && (
          <span
            className="text-[6px] font-black uppercase px-1 py-0.5 rounded-md"
            style={{ background: tier.color, color: '#07070e' }}
          >
            Destacado
          </span>
        )}
        {tier.showRotationBadge && (
          <span className="text-[6px] font-bold px-1 py-0.5 rounded-md bg-black/50 text-white/65 border border-white/10">
            Intervalos
          </span>
        )}
      </div>
    </div>
  )
}

function TierBanner({ tier }: { tier: ReturnType<typeof getTierPreview> }) {
  return (
    <div className="px-3 pb-2 pt-1.5 shrink-0">
      <PreviewBrandBanner tier={tier} />
      <p className="text-[7px] text-white/35 text-center mt-1">
        {tier.slotsLabel} · {RADIO_AD.stamp}
      </p>
    </div>
  )
}

function FloatingAd({ tier }: { tier: ReturnType<typeof getTierPreview> }) {
  if (!tier.showFloatingPremium) return null

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-3 mb-1.5 shrink-0"
      style={{ border: `1px solid ${tier.color}40`, boxShadow: `0 6px 20px ${tier.color}25`, borderRadius: '0.75rem' }}
    >
      <div
        className="sponsor-preview-ad-banner rounded-xl px-2 py-1.5 flex items-center gap-1.5 min-h-[48px] min-w-0"
        style={{
          background: `linear-gradient(120deg, color-mix(in srgb, ${tier.color} 22%, #07070e), #0a0a12)`,
        }}
      >
        <div
          className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ background: `${tier.color}30`, color: tier.color }}
          aria-hidden
        >
          {tier.brandInitial}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[6px] font-black uppercase tracking-wider px-1 py-0.5 rounded"
            style={{ color: tier.color, background: `${tier.color}22` }}
          >
            Patrocinador
          </span>
          <p className="text-[9px] font-bold text-white truncate">{tier.cliente}</p>
          <p className="text-[7px] text-white/50 truncate">{tier.floatingTagline || RADIO_AD.stamp}</p>
        </div>
        <span
          className="text-[6px] font-bold px-1.5 py-0.5 rounded-md shrink-0 max-w-[4.5rem] truncate"
          style={{ background: tier.color, color: '#07070e' }}
        >
          {tier.cta}
        </span>
      </div>
    </motion.div>
  )
}

export function SponsorAdPreview({ tierId }: { tierId: SponsorAdTierId }) {
  const router = useRouter()
  const tier = getTierPreview(tierId)

  function openInApp() {
    activateSponsorDemoTier(tierId)
    router.push(appPathForTierDemo(tierId))
  }

  return (
    <div className="sponsor-preview-root w-full min-w-0 max-w-full mx-auto">
      <div className="sponsor-preview-device relative mx-auto w-full max-w-[min(100%,17.5rem)]">
        <style>{`
          @keyframes sponsor-bar-pulse {
            0%, 100% { transform: rotate(var(--bar-rot)) scaleY(0.45) }
            50%       { transform: rotate(var(--bar-rot)) scaleY(1.0) }
          }
        `}</style>
        <div
          className="absolute inset-0 rounded-full opacity-50 blur-3xl pointer-events-none scale-90"
          style={{ background: `radial-gradient(circle, ${tier.color}55 0%, transparent 70%)` }}
        />

        <div
          className="relative rounded-[2rem] p-2.5 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #2a2a38 0%, #12121c 50%, #0a0a12 100%)',
            boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 40px ${tier.color}18`,
          }}
        >
          <div
            className="sponsor-preview-screen rounded-[1.5rem] overflow-hidden flex flex-col min-w-0"
            style={{ background: '#07070e', minHeight: 'min(340px, 72vw)' }}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
              <span className="text-[9px] text-white/40 font-mono">9:41</span>
              <div className="w-16 h-4 rounded-full bg-black/80" />
              <span className="text-[9px] text-white/40">●●●</span>
            </div>

            <div className="px-3 pb-0.5 flex justify-between items-center shrink-0">
              <p className="font-display text-sm text-white tracking-wide truncate">{RADIO.name}</p>
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                style={{ color: tier.color, background: `${tier.color}18` }}
              >
                {RADIO.frequency}
              </span>
            </div>
            <p className="px-3 pb-1 text-[7px] text-white/40 truncate shrink-0">
              {RADIO.slogan} · {RADIO.city}
            </p>

            <div
              className="mx-2.5 max-md:mx-2 rounded-2xl overflow-hidden shrink-0 relative"
              style={{ height: 'clamp(7.5rem, 38vw, 8.75rem)', background: `linear-gradient(170deg, ${tier.color}22 0%, #07070e 72%)` }}
            >
              <div className="relative h-full flex items-center justify-center">
                <div className="relative w-16 h-16">
                  {BARS.map((bar, i) => {
                    const angle = (i / 16) * 360
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
                        style={{
                          width: 2,
                          height: bar.height,
                          marginLeft: -1,
                          marginTop: -28,
                          transform: `rotate(${angle}deg)`,
                          '--bar-rot': `${angle}deg`,
                          background: tier.color,
                          opacity: 0.5,
                          animation: `sponsor-bar-pulse ${bar.duration} ease-in-out infinite`,
                          animationDelay: bar.delay,
                        } as React.CSSProperties}
                      />
                    )
                  })}
                  <div
                    className="absolute inset-1 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: '#0c0c14', border: `2px solid ${tier.color}80`, color: tier.color }}
                  >
                    ▶
                  </div>
                </div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-semibold text-white/70 px-2 truncate">
                  {RADIO_AD.nowPlayingTitle} · {RADIO_AD.nowPlayingArtist}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tierId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <FloatingAd tier={tier} />
                <TierBanner tier={tier} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto flex border-t border-white/5 shrink-0 min-w-0 overflow-hidden">
              {NAV_TABS.map(tab => (
                <div key={tab.label} className="flex-1 min-w-0 flex flex-col items-center py-1.5 px-0.5">
                  <div
                    className="w-3 h-3 rounded mb-0.5 shrink-0"
                    style={{ background: tab.active ? `${tier.color}40` : 'rgba(255,255,255,0.06)' }}
                  />
                  <span
                    className="text-[5px] font-semibold truncate w-full text-center leading-none"
                    style={{ color: tab.active ? tier.color : 'rgba(255,255,255,0.3)' }}
                  >
                    {tab.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tierId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 px-1 text-center"
        >
          <p className="text-[11px] max-md:text-[10px] font-bold leading-snug px-1" style={{ color: tier.color }}>
            Plan {tier.nombre} · ${tier.precio} CLP/mes
          </p>
          <p className="text-[10px] max-md:text-[9px] text-white/45 mt-1 leading-snug px-2">{tier.tagline}</p>
          <ul className="flex flex-wrap justify-center gap-1.5 mt-2 px-1">
            {tier.incluyeHighlight.map(h => (
              <li
                key={h}
                className="text-[8px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}30` }}
              >
                {h}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={openInApp}
        className="sponsor-preview-cta w-full max-w-full min-w-0 mt-4 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs max-md:text-[11px] font-bold text-[#07070e] transition-transform active:scale-[0.98]"
        style={{
          background: `linear-gradient(135deg, ${tier.color}, color-mix(in srgb, ${tier.color} 70%, #fff))`,
          boxShadow: `0 8px 28px -6px ${tier.color}60`,
        }}
      >
        <Smartphone className="w-4 h-4" aria-hidden />
        Ver en la app como el oyente
      </button>
    </div>
  )
}
