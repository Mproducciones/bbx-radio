'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  BBX_CONTACT,
  BBX_FEATURES,
  BBX_HERO,
  BBX_HUB_SECTIONS,
  BBX_STATS,
  bbxWhatsApp,
  type BbxHubSectionId,
} from '@/lib/bbxContent'
import { BbxPhoneMockup } from './BbxPhoneMockup'
import { BbxHubTile } from './BbxHubTile'
import { BbxSectionPage } from './BbxSectionPage'
import { AccentButton } from '@/components/shared/AccentButton'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { motion } from 'framer-motion'

const FEATURE_ICONS = ['🎙️', '💬', '📢', '📺', '🗳️', '⚙️']

function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]"
      style={{
        background: 'linear-gradient(135deg,rgba(219,137,24,0.16),rgba(219,137,24,0.06))',
        border: '1px solid rgba(219,137,24,0.35)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo</span>
      <button type="button" onClick={toggle} className="text-white/50 text-[10px] hover:text-white">Pausar</button>
    </motion.div>
  )
}

// ── Stat tile con contador animado via Anime.js ───────────────────────────────
function AnimatedStat({ value, label, accent }: { value: string; label: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        // anime.js v4 animate
        import('animejs').then(({ animate }) => {
          animate(el, {
            scale: [0.85, 1],
            opacity: [0, 1],
            duration: 600,
            ease: 'spring(1, 80, 10, 0)',
          })
        })
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-2xl px-2 py-4 text-center flex flex-col justify-center gap-1.5 opacity-0"
      style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
      <p className="font-display text-3xl leading-none tracking-wide" style={{ color: accent }}>{value}</p>
      <p className="text-white/45 text-[9px] leading-tight">{label}</p>
    </div>
  )
}

// ── Feature tile con hover animado ───────────────────────────────────────────
function FeatureTile({ icon, title, desc, accent, delay }: {
  icon: string; title: string; desc: string; accent: string; delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        import('animejs').then(({ animate }) => {
          animate(el, {
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 500,
            delay,
            ease: 'out(3)',
          })
        })
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className="rounded-2xl p-3.5 transition-[border-color,box-shadow] hover:brightness-110"
      style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 text-sm"
        style={{ background: `${accent}18` }}>
        {icon}
      </div>
      <p className="text-white font-semibold text-xs leading-tight">{title}</p>
      <p className="text-white/40 text-[10px] leading-snug mt-1">{desc}</p>
    </div>
  )
}

export function BbxLanding() {
  const router = useRouter()
  const [section, setSection] = useState<BbxHubSectionId | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)

  // Anime.js hero entrance
  useEffect(() => {
    if (!heroRef.current) return
    import('animejs').then(({ animate, stagger }) => {
      animate(heroRef.current!.querySelectorAll('[data-hero]'), {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 700,
        delay: stagger(120),
        ease: 'out(3)',
      })
    })
  }, [])

  // Anime.js hub tiles stagger on scroll
  useEffect(() => {
    const el = hubRef.current
    if (!el) return
    const tiles = el.querySelectorAll('[data-hub-tile]')
    tiles.forEach(t => ((t as HTMLElement).style.opacity = '0'))
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate, stagger }) => {
          animate(tiles, {
            scale: [0.92, 1],
            opacity: [0, 1],
            duration: 480,
            delay: stagger(65),
            ease: 'spring(1, 90, 12, 0)',
          })
        })
        obs.disconnect()
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const openSection = (id: BbxHubSectionId) => {
    setSection(id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const closeSection = () => {
    setSection(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (section) return <BbxSectionPage section={section} onBack={closeSection} />

  const demoHref = bbxWhatsApp('Hola, quiero agendar demo BBX.')

  return (
    <div className="bbx-landing w-full min-w-0 max-w-full text-white overflow-x-hidden"
      style={{ background: '#07070e', minHeight: '100dvh' }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle,#db8918 0%,transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[45%] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle,#40B9BF 0%,transparent 70%)' }} />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[30%] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle,#7D59B5 0%,transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.94)' }}>
        <div className="w-full max-w-lg mx-auto h-12 flex items-center justify-between gap-2 px-4 md:max-w-6xl">
          <span className="font-display text-2xl tracking-widest leading-none text-white">BBX</span>
          <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a"
            className="shrink-0 !text-[11px] !px-3 !py-1.5">
            Demo gratis
          </AccentButton>
        </div>
      </header>

      <main className="relative z-[1] w-full max-w-lg mx-auto px-4 pb-32 md:pb-16 md:max-w-6xl">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="pt-5 pb-8 md:pt-14" ref={heroRef}>
          <div className="flex justify-center mb-4 min-h-[28px]">
            <LiveDemoBar />
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">

            <div className="order-2 md:order-1 space-y-5">
              <p data-hero className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.25em]">
                {BBX_HERO.eyebrow}
              </p>
              <h1 data-hero className="font-display text-4xl sm:text-5xl leading-none tracking-wide"
                style={{ textShadow: '0 0 40px rgba(219,137,24,0.2)' }}>
                {BBX_HERO.title}
              </h1>
              <p data-hero className="text-white/55 text-sm leading-relaxed">
                {BBX_HERO.subtitle}
              </p>
              <div data-hero className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse flex-shrink-0" />
                <span className="text-[#00D9A0] text-[11px] font-medium">{BBX_HERO.proof}</span>
              </div>
              <div data-hero className="flex flex-wrap gap-2.5 pt-1">
                <AccentButton href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')}
                  accent="#db8918" highlight="#f2c16a">
                  Demo gratuito
                </AccentButton>
                <AccentButton type="button" variant="secondary" accent="#40B9BF"
                  onClick={() => openSection('planes')}>
                  Ver planes
                </AccentButton>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <BbxPhoneMockup />
            </div>
          </div>
        </section>

        {/* ── STATS (animated) ─────────────────────────────── */}
        <section className="pb-8">
          <div className="grid grid-cols-4 gap-2.5">
            {BBX_STATS.map(s => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} accent={s.accent} />
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section className="pb-8">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Qué incluye</p>
            <h2 className="font-display text-2xl text-white">Plataforma completa</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {BBX_FEATURES.map((f, i) => (
              <FeatureTile
                key={f.id}
                icon={FEATURE_ICONS[i]}
                title={f.title}
                desc={f.desc}
                accent={f.accent}
                delay={i * 80}
              />
            ))}
          </div>
        </section>

        {/* ── HUB ──────────────────────────────────────────── */}
        <section className="pb-8">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Ir al detalle</p>
            <h2 className="font-display text-2xl text-white">Explorar BBX</h2>
          </div>
          <div ref={hubRef} className="grid grid-cols-2 gap-2.5 min-w-0">
            {BBX_HUB_SECTIONS.map(tile => (
              <div key={tile.id} className="flex min-w-0" data-hub-tile>
                <BbxHubTile value={tile.value} label={tile.label} subtitle={tile.subtitle}
                  accent={tile.accent} animate={false} onClick={() => openSection(tile.id)} />
              </div>
            ))}
            <div className="flex min-w-0" data-hub-tile>
              <BbxHubTile value="24h" emphasis="action" label="Agendar demo"
                subtitle="WhatsApp directo" accent="#128C7E" animate={false}
                href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')} />
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────── */}
        <section className="pb-4">
          <div className="rounded-3xl p-6 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg,rgba(219,137,24,0.14) 0%,rgba(64,185,191,0.04) 50%,#07070e 100%)',
              border: '1px solid rgba(219,137,24,0.28)',
            }}>
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,#db8918,transparent)' }} />
            <p className="text-[#db8918] text-[10px] font-black uppercase tracking-widest mb-2">
              ¿Listo para dar el salto?
            </p>
            <h2 className="font-display text-3xl mb-2 leading-tight">
              Digitalizamos tu radio en 48h
            </h2>
            <p className="text-white/50 text-sm mb-5 leading-relaxed">
              Demo gratuito · setup en 48h · soporte incluido
            </p>
            <div className="flex flex-col items-center gap-2">
              <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a"
                fullWidth className="max-w-xs mx-auto hidden md:flex">
                Agendar demo ahora
              </AccentButton>
              <button type="button" onClick={() => router.back()}
                className="text-white/30 text-xs hover:text-white/60 transition-colors">
                ← Volver a la radio
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-white/5 py-5 text-center relative z-[1]">
        <p className="font-display text-sm text-white/30 tracking-widest">BBX RADIO SYSTEM</p>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/10 backdrop-blur-xl px-4 pt-2.5"
        style={{
          background: 'rgba(7,7,14,0.97)',
          paddingBottom: 'max(14px,env(safe-area-inset-bottom,0px))',
        }}>
        <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" fullWidth>
          Agendar demo gratis
        </AccentButton>
      </div>
    </div>
  )
}
