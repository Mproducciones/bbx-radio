'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Megaphone,
  MessageCircle,
  Mic2,
  Rocket,
  Settings2,
  Tv,
  Vote,
  type LucideIcon,
} from 'lucide-react'
import {
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
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

const FEATURE_ICONS: LucideIcon[] = [Mic2, MessageCircle, Megaphone, Tv, Vote, Settings2]

// ── Live bar ─────────────────────────────────────────────────────────────────
function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-amber text-[10px]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold">Demo en vivo</span>
      <button type="button" onClick={toggle} className="text-white/40 hover:text-white ml-1 transition-colors">
        Pausar
      </button>
    </motion.div>
  )
}

// ── Stat tile con animación de escala al entrar ───────────────────────────────
function StatTile({ value, label, accent, index }: {
  value: string; label: string; accent: string; index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        import('animejs').then(({ animate }) => {
          animate(el, {
            scale: [0.7, 1.04, 1],
            opacity: [0, 1],
            duration: 700,
            delay: index * 90,
            ease: 'spring(1, 80, 14, 0)',
          })
        })
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="rounded-2xl px-3 py-4 text-center flex flex-col justify-center gap-2 opacity-0 card-lift"
      style={{
        background: `linear-gradient(145deg, ${accent}18 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${accent}35`,
        boxShadow: `0 8px 32px -8px ${accent}30`,
      }}
    >
      <p
        className="font-display text-3xl leading-none tracking-wide"
        style={{ color: accent, textShadow: `0 0 20px ${accent}60` }}
      >
        {value}
      </p>
      <p className="text-white/50 text-[10px] leading-tight font-medium">{label}</p>
    </div>
  )
}

// ── Feature card — glass morphism ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent, index }: {
  icon: LucideIcon; title: string; desc: string; accent: string; index: number
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
            translateY: [28, 0],
            opacity: [0, 1],
            duration: 600,
            delay: index * 70,
            ease: 'out(3)',
          })
        })
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="glass rounded-2xl p-4 group card-lift cursor-default"
      style={{
        borderColor: `${accent}22`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = `${accent}55`
        el.style.boxShadow = `0 8px 40px -8px ${accent}40, 0 0 0 1px ${accent}22`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = `${accent}22`
        el.style.boxShadow = ''
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${accent}28, ${accent}12)`,
          boxShadow: `0 4px 16px -4px ${accent}40`,
          color: accent,
        }}
      >
        <Icon className="w-5 h-5" strokeWidth={2} aria-hidden />
      </div>
      <p className="text-white font-bold text-sm leading-tight mb-1.5">{title}</p>
      <p className="text-white/45 text-[11px] leading-relaxed">{desc}</p>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
        <span className="text-[10px] font-bold" style={{ color: accent }}>→</span>
      </div>
    </div>
  )
}

// ── CTA final con spotlight ───────────────────────────────────────────────────
function CtaSection({ demoHref, onBack }: { demoHref: string; onBack: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="rounded-3xl p-6 md:p-10 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(219,137,24,0.12) 0%, rgba(64,185,191,0.04) 50%, #07070e 100%)',
        border: '1px solid rgba(219,137,24,0.3)',
        '--mx': '50%',
        '--my': '50%',
      } as React.CSSProperties}
    >
      {/* Spotlight follow mouse */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 200px at var(--mx) var(--my), rgba(219,137,24,0.12), transparent)',
        }}
      />

      {/* Top line */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #db8918 35%, #40B9BF 65%, transparent 100%)' }} />

      <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#db8918' }}>
        ¿Listo para dar el salto?
      </p>
      <h2 className="font-display text-gradient-gold leading-tight mb-3"
        style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)' }}>
        Tu radio digital en 48h
      </h2>
      <p className="text-white/45 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
        Demo gratis · sin permanencia · soporte incluido
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <a
          href={demoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer glow-amber-pulse inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm w-full sm:w-auto"
          style={{
            background: 'linear-gradient(135deg, var(--color-mag-400), var(--color-mag-200))',
            color: 'var(--color-ink-900)',
            boxShadow: '0 8px 32px -6px rgba(219,137,24,0.55)',
          }}
        >
          <Rocket className="w-4 h-4" strokeWidth={2.5} aria-hidden />
          Agendar demo ahora
        </a>
        <button
          type="button"
          onClick={onBack}
          className="text-white/30 text-xs hover:text-white/60 transition-colors"
        >
          ← Volver a la radio
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function BbxLanding() {
  const router = useRouter()
  const [section, setSection] = useState<BbxHubSectionId | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const hubRef  = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Hero stagger entrance
  useEffect(() => {
    if (!heroRef.current) return
    import('animejs').then(({ animate, stagger }) => {
      animate(heroRef.current!.querySelectorAll('[data-hero]'), {
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 750,
        delay: stagger(130),
        ease: 'out(3)',
      })
    })
  }, [])

  // Hub tiles spring
  useEffect(() => {
    const el = hubRef.current
    if (!el) return
    const tiles = el.querySelectorAll('[data-hub-tile]')
    tiles.forEach(t => ((t as HTMLElement).style.opacity = '0'))
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate, stagger }) => {
          animate(tiles, {
            scale: [0.88, 1],
            opacity: [0, 1],
            duration: 520,
            delay: stagger(65),
            ease: 'spring(1, 90, 12, 0)',
          })
        })
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const openSection  = (id: BbxHubSectionId) => { setSection(id); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const closeSection = () => { setSection(null); window.scrollTo({ top: 0, behavior: 'instant' }) }

  if (section) return <BbxSectionPage section={section} onBack={closeSection} />

  const demoHref = bbxWhatsApp('Hola, quiero agendar demo BBX.')

  return (
    <div
      ref={mainRef}
      className="bbx-landing w-full min-w-0 max-w-full text-white overflow-x-hidden overflow-y-auto mesh-bg"
      style={{ minHeight: '100dvh' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-15%] left-[-5%] w-[65%] h-[55%] rounded-full opacity-30 blur-[90px]"
          style={{ background: 'radial-gradient(circle,#db8918 0%,transparent 65%)' }} />
        <div className="absolute bottom-[-5%] right-[-10%] w-[55%] h-[40%] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'radial-gradient(circle,#40B9BF 0%,transparent 65%)' }} />
        <div className="absolute top-[50%] left-[40%] w-[40%] h-[35%] rounded-full opacity-10 blur-[70px]"
          style={{ background: 'radial-gradient(circle,#7D59B5 0%,transparent 70%)' }} />
      </div>

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.9)' }}
      >
        <div className="w-full max-w-xl mx-auto h-12 flex items-center justify-between gap-2 px-4 md:max-w-5xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display text-2xl tracking-widest leading-none text-gradient-gold shrink-0">BBX</span>
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full glass-amber shrink-0"
              style={{ color: '#db8918' }}>
              Radio System
            </span>
          </div>
          <a
            href={demoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold px-3 py-1.5 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #db8918, #f2c16a)',
              color: '#07070e',
              boxShadow: '0 4px 16px -4px rgba(219,137,24,0.5)',
            }}
          >
            Demo gratis
          </a>
        </div>
      </header>

      <main className="relative z-[1] w-full max-w-xl mx-auto px-4 pb-32 md:pb-16 md:max-w-5xl">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="pt-6 pb-10 md:pt-16" ref={heroRef}>
          <div className="mb-5 h-7 flex items-center">
            <LiveDemoBar />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Text */}
            <div className="space-y-5">
              <p data-hero className="text-[11px] font-black uppercase tracking-[0.3em] opacity-0"
                style={{ color: '#40B9BF' }}>
                {BBX_HERO.eyebrow}
              </p>

              <h1
                data-hero
                className="font-display text-gradient-gold leading-[1.05] tracking-wide opacity-0"
                style={{ fontSize: 'clamp(1.55rem, 8.5vw, 2.75rem)' }}
              >
                {BBX_HERO.title}
              </h1>

              <p data-hero className="text-white/55 text-sm leading-relaxed max-w-sm opacity-0">
                {BBX_HERO.subtitle}
              </p>

              <div data-hero className="flex items-center gap-2 opacity-0">
                <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse shrink-0" />
                <span className="text-[#00D9A0] text-[11px] font-semibold">{BBX_HERO.proof}</span>
              </div>

              <div data-hero className="flex flex-col sm:flex-row gap-3 pt-1 opacity-0">
                <a
                  href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer glow-amber-pulse inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-mag-400), var(--color-mag-200))',
                    color: 'var(--color-ink-900)',
                    boxShadow: '0 6px 28px -6px rgba(219,137,24,0.6)',
                  }}
                >
                  <Rocket className="w-4 h-4" strokeWidth={2.5} aria-hidden />
                  Demo gratuito
                </a>
                <button
                  type="button"
                  onClick={() => openSection('planes')}
                  className="glass inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm text-white/80 hover:text-white transition-colors"
                >
                  Ver planes →
                </button>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-[220px] md:max-w-[280px] float-anim">
                <BbxPhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <section className="pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BBX_STATS.map((s, i) => (
              <StatTile key={s.label} value={s.value} label={s.label} accent={s.accent} index={i} />
            ))}
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────────── */}
        <section className="pb-10">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1.5">Qué incluye</p>
            <h2 className="font-display text-gradient-radio leading-none"
              style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}>
              Plataforma completa
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BBX_FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? BarChart3
              return (
                <FeatureCard
                  key={f.id}
                  icon={Icon}
                  title={f.title}
                  desc={f.desc}
                  accent={f.accent}
                  index={i}
                />
              )
            })}
          </div>
        </section>

        {/* ── HUB ───────────────────────────────────────────────────────────── */}
        <section className="pb-10">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1.5">Explorar</p>
            <h2 className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}>
              Todo lo que hacemos
            </h2>
          </div>
          <div ref={hubRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 min-w-0">
            {BBX_HUB_SECTIONS.map(tile => (
              <div key={tile.id} className="flex min-w-0" data-hub-tile>
                <BbxHubTile
                  value={tile.value} label={tile.label} subtitle={tile.subtitle}
                  accent={tile.accent} animate={false} onClick={() => openSection(tile.id)}
                />
              </div>
            ))}
            <div className="flex min-w-0" data-hub-tile>
              <BbxHubTile
                value="24h" emphasis="action" label="Agendar demo"
                subtitle="WhatsApp directo" accent="#128C7E" animate={false}
                href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')}
              />
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
        <section className="pb-6">
          <CtaSection demoHref={demoHref} onBack={() => router.back()} />
        </section>
      </main>

      {/* Footer desktop */}
      <footer className="hidden md:block border-t border-white/5 py-5 text-center relative z-[1]">
        <p className="font-display text-sm tracking-widest text-gradient-gold inline-block">BBX RADIO SYSTEM</p>
      </footer>

      {/* Mobile sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/[0.08] backdrop-blur-xl px-4 pt-3"
        style={{
          background: 'rgba(7,7,14,0.97)',
          paddingBottom: 'max(14px,env(safe-area-inset-bottom,0px))',
        }}
      >
        <a
          href={demoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer glow-amber-pulse flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, var(--color-mag-400), var(--color-mag-200))',
            color: 'var(--color-ink-900)',
            boxShadow: '0 6px 28px -6px rgba(219,137,24,0.6)',
          }}
        >
          <Rocket className="w-4 h-4" strokeWidth={2.5} aria-hidden />
          Agendar demo gratis
        </a>
      </div>
    </div>
  )
}
