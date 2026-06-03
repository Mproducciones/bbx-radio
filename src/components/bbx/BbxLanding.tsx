'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
        boxShadow: '0 4px 16px rgba(219,137,24,0.15)',
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
  const [section, setSection] = useState<BbxHubSectionId | null>(null)

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
      className="min-h-screen text-white overflow-x-hidden pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] md:pb-8"
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
        style={{ background: 'rgba(7,7,14,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between gap-2">
          <span className="font-display text-xl md:text-2xl tracking-wider">BBX</span>
          <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" className="shrink-0">
            Demo gratis
          </AccentButton>
        </div>
      </header>

      <main className="relative z-[1] max-w-6xl mx-auto px-4">
        <section className="pt-5 pb-6 md:pt-10 md:pb-8">
          <div className="flex justify-center mb-3">
            <LiveDemoBar />
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[#40B9BF] text-[9px] font-bold uppercase tracking-[0.22em] mb-2">
                {BBX_HERO.eyebrow}
              </p>
              <h1 className="text-lg md:text-xl font-semibold leading-snug mb-2">{BBX_HERO.title}</h1>
              <p className="text-white/55 text-sm leading-relaxed mb-3 max-w-lg">{BBX_HERO.subtitle}</p>
              <p
                className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,217,160,0.12), rgba(0,217,160,0.04))',
                  border: '1px solid rgba(0,217,160,0.25)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-wrap gap-2">
                <AccentButton href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')} accent="#db8918" highlight="#f2c16a">
                  Demo en 24h
                </AccentButton>
                <AccentButton type="button" variant="secondary" accent="#40B9BF" onClick={() => openSection('negocio')}>
                  Modelo de negocio
                </AccentButton>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <BbxPhoneMockup />
            </div>
          </div>
        </section>

        <section className="pb-5">
          <div className="grid grid-cols-2 gap-2">
            {BBX_STATS.map(s => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={accentTileStyle(s.accent)}
              >
                <p
                  className="font-display text-lg leading-none tabular-nums"
                  style={{ color: s.accent, textShadow: `0 0 20px ${s.accent}44` }}
                >
                  {s.value}
                </p>
                <p className="text-white/45 text-[10px] mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-8 md:pb-10">
          <h2 className="text-sm font-semibold text-white mb-1">Plataforma completa</h2>
          <p className="text-white/40 text-xs mb-3">Toca una tarjeta para ver el detalle</p>
          <div className="grid grid-cols-2 gap-2">
            {BBX_HUB_SECTIONS.map(tile => (
              <BbxHubTile
                key={tile.id}
                value={tile.value}
                label={tile.label}
                subtitle={tile.subtitle}
                accent={tile.accent}
                onClick={() => openSection(tile.id)}
              />
            ))}
            <BbxHubTile
              value="24h"
              label="Agendar demo"
              subtitle="WhatsApp directo"
              accent="#128C7E"
              href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')}
            />
          </div>
        </section>

        <section className="pb-10">
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'linear-gradient(165deg, rgba(219,137,24,0.12) 0%, #12121c 40%, #07070e 100%)',
              border: '1px solid rgba(219,137,24,0.22)',
              boxShadow: '0 12px 40px -12px rgba(219,137,24,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <h2 className="font-display text-lg md:text-xl mb-1">¿Digitalizamos tu radio?</h2>
            <p className="text-white/45 text-xs mb-3">
              {BBX_CONTACT.name} · demo 24h · setup 48h
            </p>
            <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" fullWidth className="max-w-xs mx-auto mb-2">
              Agendar demo
            </AccentButton>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-white/35 text-xs hover:text-white/60"
            >
              ← Volver a la radio
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-4 text-center relative z-[1]">
        <p className="font-display text-sm text-white/50">BBX RADIO SYSTEM</p>
      </footer>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 md:hidden border-t border-white/10 backdrop-blur-xl"
        style={{
          background: 'rgba(7,7,14,0.96)',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <AccentButton href={demoHref} accent="#db8918" highlight="#f2c16a" fullWidth>
          Agendar demo
        </AccentButton>
      </div>
    </div>
  )
}
