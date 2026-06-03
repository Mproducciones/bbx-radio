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
import { BbxPhoneMockup } from './BbxPhoneMockup'
import { BbxHubTile } from './BbxHubTile'
import { BbxSectionPanels } from './BbxSectionPanels'
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
      style={{ background: 'rgba(219,137,24,0.12)', border: '1px solid rgba(219,137,24,0.25)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo</span>
      <button type="button" onClick={toggle} className="text-white/45 text-[10px]">
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
    document.body.style.overflow = 'hidden'
  }

  const closeSection = () => {
    setSection(null)
    document.body.style.overflow = ''
  }

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden pb-[calc(3.25rem+env(safe-area-inset-bottom,0px))] md:pb-8"
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
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.92)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between gap-2">
          <span className="font-display text-xl md:text-2xl tracking-wider">BBX</span>
          <a
            href={bbxWhatsApp('Hola, quiero agendar demo BBX.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full shrink-0"
            style={{ background: '#db8918', color: '#07070e' }}
          >
            Demo gratis
          </a>
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
              <h1 className="font-display text-[clamp(2rem,7vw,3.75rem)] leading-[0.95] mb-2 md:mb-3">
                {BBX_HERO.title}
              </h1>
              <p className="text-white/55 text-sm leading-relaxed mb-3 max-w-lg">{BBX_HERO.subtitle}</p>
              <p
                className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center min-h-[42px] items-center px-5 py-2.5 rounded-lg text-sm font-bold text-[#07070e]"
                  style={{ background: 'linear-gradient(135deg, #db8918, #f2c16a)' }}
                >
                  Demo en 24h
                </a>
                <button
                  type="button"
                  onClick={() => openSection('negocio')}
                  className="inline-flex justify-center min-h-[42px] items-center px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/12 text-white/75 hover:text-white transition-colors"
                >
                  Modelo de negocio
                </button>
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
                style={{ background: '#0e0e16', border: `1px solid ${s.accent}28` }}
              >
                <p className="font-display text-2xl md:text-3xl leading-none" style={{ color: s.accent }}>
                  {s.value}
                </p>
                <p className="text-white/40 text-[10px] mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-8 md:pb-10">
          <h2 className="font-display text-xl md:text-2xl text-white mb-1">Plataforma completa</h2>
          <p className="text-white/40 text-xs mb-4">Toca una tarjeta para ver el detalle</p>
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
            style={{ background: 'linear-gradient(160deg,#1a1028,#07070e)', border: '1px solid rgba(219,137,24,0.18)' }}
          >
            <h2 className="font-display text-xl md:text-2xl mb-1">¿Digitalizamos tu radio?</h2>
            <p className="text-white/45 text-xs mb-3">
              {BBX_CONTACT.name} · demo 24h · setup 48h
            </p>
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
        className="fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 md:hidden border-t border-white/8 backdrop-blur-lg"
        style={{
          background: 'rgba(7,7,14,0.94)',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <a
          href={bbxWhatsApp('Hola, quiero demo BBX.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full min-h-[44px] items-center py-2.5 rounded-lg text-sm font-bold text-[#07070e] active:scale-[0.98] transition-transform"
          style={{ background: '#db8918' }}
        >
          Agendar demo
        </a>
      </div>

      <BbxSectionPanels section={section} onClose={closeSection} />
    </div>
  )
}
