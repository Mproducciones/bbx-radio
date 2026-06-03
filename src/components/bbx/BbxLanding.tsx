'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  BBX_CONTACT,
  BBX_HERO,
  BBX_HUB_SECTIONS,
  BBX_STATS,
  bbxWhatsApp,
  type BbxHubSectionId,
} from '@/lib/bbxContent'
import { accentTileStyle } from '@/lib/accentUi'
import { BbxPhoneMockup } from './BbxPhoneMockup'
import { BbxHubTile } from './BbxHubTile'
import { BbxSectionPage } from './BbxSectionPage'
import { AccentButton } from '@/components/shared/AccentButton'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'
import { useBbxPageAnimations } from '@/hooks/useBbxPageAnimations'
import { motion } from 'framer-motion'

function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]"
      style={{
        background: 'linear-gradient(135deg, rgba(219,137,24,0.16), rgba(219,137,24,0.06))',
        border: '1px solid rgba(219,137,24,0.35)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo</span>
      <button type="button" onClick={toggle} className="text-white/50 text-[10px] hover:text-white">
        Pausar
      </button>
    </motion.div>
  )
}

export function BbxLanding() {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const [section, setSection] = useState<BbxHubSectionId | null>(null)

  useBbxPageAnimations(rootRef, !section)

  const openSection = (id: BbxHubSectionId) => {
    setSection(id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const closeSection = () => {
    setSection(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (section) {
    return <BbxSectionPage section={section} onBack={closeSection} />
  }

  const demoHref = bbxWhatsApp('Hola, quiero agendar demo BBX.')

  return (
    <div
      ref={rootRef}
      className="bbx-landing min-h-[100dvh] w-full text-white overflow-x-hidden"
      style={{ background: '#07070e' }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] rounded-full opacity-35 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #db8918 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[45%] rounded-full opacity-25 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #40B9BF 0%, transparent 70%)' }}
        />
      </div>

      <header
        className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.94)' }}
        data-bbx-animate="fade"
      >
        <div className="w-full max-w-lg mx-auto px-4 h-12 flex items-center justify-between gap-3">
          <span className="font-display text-xl tracking-wider leading-none">BBX</span>
          <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" className="shrink-0 !text-[11px] !px-3 !py-1.5">
            Demo
          </AccentButton>
        </div>
      </header>

      <main className="relative z-[1] w-full max-w-lg mx-auto px-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-10 md:max-w-6xl">
        <section className="pt-4 pb-5 md:pt-10" data-bbx-animate="fade">
          <div className="flex justify-center mb-3 min-h-[28px]">
            <LiveDemoBar />
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="order-2 md:order-1 space-y-3">
              <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.2em]">
                {BBX_HERO.eyebrow}
              </p>
              <h1 className="text-xl md:text-2xl font-semibold leading-snug">{BBX_HERO.title}</h1>
              <p className="text-white/55 text-sm leading-relaxed">{BBX_HERO.subtitle}</p>
              <p
                className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(0,217,160,0.1)',
                  border: '1px solid rgba(0,217,160,0.22)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <AccentButton href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')} accent="#db8918" highlight="#f2c16a">
                  Demo 24h
                </AccentButton>
                <AccentButton type="button" variant="secondary" accent="#40B9BF" onClick={() => openSection('negocio')}>
                  Negocio
                </AccentButton>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center" data-bbx-animate="fade">
              <BbxPhoneMockup />
            </div>
          </div>
        </section>

        <section className="pb-5" data-bbx-animate="fade">
          <div className="grid grid-cols-2 gap-3">
            {BBX_STATS.map(s => (
              <div
                key={s.label}
                className="rounded-xl px-3 py-3 text-center min-h-[4.25rem] flex flex-col justify-center"
                style={accentTileStyle(s.accent)}
              >
                <p className="font-display text-xl leading-none tabular-nums" style={{ color: s.accent }}>
                  {s.value}
                </p>
                <p className="text-white/50 text-[11px] mt-1.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-6">
          <div className="mb-3" data-bbx-animate="fade">
            <h2 className="text-base font-semibold text-white">Plataforma completa</h2>
            <p className="text-white/50 text-sm mt-1">Toca una tarjeta para ver el detalle</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BBX_HUB_SECTIONS.map(tile => (
              <div key={tile.id} className="flex min-w-0">
                <BbxHubTile
                  value={tile.value}
                  label={tile.label}
                  subtitle={tile.subtitle}
                  accent={tile.accent}
                  onClick={() => openSection(tile.id)}
                />
              </div>
            ))}
            <div className="flex min-w-0">
              <BbxHubTile
                value="24h"
                emphasis="action"
                label="Agendar demo"
                subtitle="WhatsApp directo"
                accent="#128C7E"
                href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')}
              />
            </div>
          </div>
        </section>

        <section data-bbx-animate="cta">
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'linear-gradient(165deg, rgba(219,137,24,0.12) 0%, #12121c 45%, #07070e 100%)',
              border: '1px solid rgba(219,137,24,0.22)',
            }}
          >
            <h2 className="font-display text-xl mb-1.5">¿Digitalizamos tu radio?</h2>
            <p className="text-white/55 text-sm mb-4">
              {BBX_CONTACT.name} · demo 24h · setup 48h
            </p>
            <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" fullWidth className="max-w-xs mx-auto hidden md:flex">
              Agendar demo
            </AccentButton>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-white/40 text-sm hover:text-white/70 mt-3"
            >
              ← Volver a la radio
            </button>
          </div>
        </section>
      </main>

      <footer className="hidden md:block border-t border-white/5 py-4 text-center relative z-[1] max-w-6xl mx-auto">
        <p className="font-display text-sm text-white/50">BBX RADIO SYSTEM</p>
      </footer>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/10 backdrop-blur-xl px-4 pt-2.5"
        style={{
          background: 'rgba(7,7,14,0.97)',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="max-w-lg mx-auto">
          <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" fullWidth>
            Agendar demo
          </AccentButton>
        </div>
      </div>
    </div>
  )
}
