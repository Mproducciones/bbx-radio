'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import {
  BBX_CONTACT,
  BBX_FAQ,
  BBX_FEATURES,
  BBX_HERO,
  BBX_PROCESS,
  BBX_STATS,
  bbxWhatsApp,
} from '@/lib/bbxContent'
import { BbxPhoneMockup } from './BbxPhoneMockup'
import { BbxRevenueSection } from './BbxRevenueSection'
import { BbxPlansSection } from './BbxPlansSection'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

function BbxIcon({ id, color }: { id: string; color: string }) {
  const icons: Record<string, ReactNode> = {
    player: <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill={color} />,
    saludos: <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill={color} />,
    ads: <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 2v1h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h16v12z" fill={color} />,
    tv: <path d="M21 3H3c-1.1 0-2 .9-2 2v12h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-10 8l5-3v6l-5-3z" fill={color} />,
    polls: <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h2v2h-2V5zm0 4h2v6h-2V9z" fill={color} />,
    admin: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill={color} />,
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      {icons[id] ?? icons.player}
    </svg>
  )
}

function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]"
      style={{ background: 'rgba(219,137,24,0.12)', border: '1px solid rgba(219,137,24,0.25)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo</span>
      <button type="button" onClick={toggle} className="text-white/45 text-[10px]">Pausar</button>
    </motion.div>
  )
}

export function BbxLanding() {
  const router = useRouter()
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen text-white overflow-x-hidden pb-[calc(3.25rem+env(safe-area-inset-bottom,0px))] md:pb-0" style={{ background: '#07070e' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] rounded-full opacity-35 blur-[100px]" style={{ background: 'radial-gradient(circle, #db8918 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[45%] rounded-full opacity-25 blur-[90px]" style={{ background: 'radial-gradient(circle, #40B9BF 0%, transparent 70%)' }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(7,7,14,0.92)' }}>
        <div className="max-w-6xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between gap-2">
          <span className="font-display text-xl md:text-2xl tracking-wider">BBX</span>
          <nav className="hidden md:flex gap-4 text-xs text-white/45">
            <a href="#producto" className="hover:text-white">Producto</a>
            <a href="#negocio" className="hover:text-white">Negocio</a>
            <a href="#planes" className="hover:text-white">Planes</a>
          </nav>
          <a href={bbxWhatsApp('Hola, quiero agendar demo BBX.')} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full shrink-0" style={{ background: '#db8918', color: '#07070e' }}>
            Demo gratis
          </a>
        </div>
      </header>

      <main className="relative z-[1]">
        <section className="max-w-6xl mx-auto px-4 pt-5 pb-8 md:pt-10 md:pb-12">
          <div className="flex justify-center mb-3"><LiveDemoBar /></div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <p className="text-[#40B9BF] text-[9px] font-bold uppercase tracking-[0.22em] mb-2">{BBX_HERO.eyebrow}</p>
              <h1 className="font-display text-[clamp(2rem,7vw,3.75rem)] leading-[0.95] mb-2 md:mb-3">{BBX_HERO.title}</h1>
              <p className="text-white/55 text-sm leading-relaxed mb-3 max-w-lg">{BBX_HERO.subtitle}</p>
              <p className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')} target="_blank" rel="noopener noreferrer"
                  className="inline-flex justify-center min-h-[42px] items-center px-5 py-2.5 rounded-lg text-sm font-bold text-[#07070e]"
                  style={{ background: 'linear-gradient(135deg, #db8918, #f2c16a)' }}>
                  Demo en 24h
                </a>
                <a href="#negocio" className="inline-flex justify-center min-h-[42px] items-center px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/12 text-white/75">
                  Modelo de negocio
                </a>
              </div>
            </div>
            <BbxPhoneMockup />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-6 md:pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {BBX_STATS.map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#0e0e16', border: `1px solid ${s.accent}28` }}>
                <p className="font-display text-2xl md:text-3xl leading-none" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-white/40 text-[10px] mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="producto" className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-5 md:mb-7">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-1">Plataforma completa</h2>
            <p className="text-white/45 text-xs md:text-sm">Operación diaria, ventas y oyentes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {BBX_FEATURES.map((f, i) => (
              <motion.article key={f.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="rounded-xl p-3.5 md:p-4" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${f.accent}16` }}>
                  <BbxIcon id={f.id} color={f.accent} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-0.5">{f.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-6 md:py-8 border-y border-white/5">
          <h2 className="font-display text-xl md:text-2xl mb-4 md:mb-5">Cómo trabajamos</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {BBX_PROCESS.map(p => (
              <div key={p.step} className="rounded-lg p-3" style={{ background: '#0e0e16' }}>
                <p className="font-mono text-[#db8918] text-[10px] font-bold">{p.step}</p>
                <p className="text-white font-semibold text-xs mt-0.5">{p.title}</p>
                <p className="text-white/40 text-[10px] mt-0.5 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <BbxRevenueSection />
        <BbxPlansSection />

        <section id="faq" className="max-w-2xl mx-auto px-4 py-8 md:py-10">
          <h2 className="font-display text-xl md:text-2xl mb-4">FAQ</h2>
          <div className="space-y-1.5">
            {BBX_FAQ.map((item, i) => (
              <div key={item.q} className="rounded-lg overflow-hidden" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex justify-between gap-2 px-3 py-3 min-h-[44px] text-left text-xs md:text-sm font-semibold items-center">
                  {item.q}
                  <span className="text-white/30 shrink-0">{faqOpen === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3 text-white/50 text-xs overflow-hidden leading-relaxed">{item.a}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-8 md:pb-12">
          <div className="rounded-2xl p-5 md:p-8 text-center" style={{ background: 'linear-gradient(160deg,#1a1028,#07070e)', border: '1px solid rgba(219,137,24,0.18)' }}>
            <h2 className="font-display text-2xl md:text-3xl mb-2">¿Digitalizamos tu radio?</h2>
            <p className="text-white/45 text-xs mb-4">{BBX_CONTACT.name} · demo 24h · setup 48h</p>
            <a href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center px-6 py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: '#128C7E' }}>
              WhatsApp directo
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-5 text-center">
        <p className="font-display text-base text-white/65">BBX RADIO SYSTEM</p>
        <button type="button" onClick={() => router.back()} className="mt-2 text-white/35 text-xs hover:text-white">← Volver a la radio</button>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pt-2 md:hidden border-t border-white/8 backdrop-blur-lg"
        style={{ background: 'rgba(7,7,14,0.94)', paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))' }}>
        <a href={bbxWhatsApp('Hola, quiero demo BBX.')} target="_blank" rel="noopener noreferrer"
          className="flex justify-center w-full min-h-[44px] items-center py-2.5 rounded-lg text-sm font-bold text-[#07070e] active:scale-[0.98] transition-transform"
          style={{ background: '#db8918' }}>
          Agendar demo
        </a>
      </div>
    </div>
  )
}
