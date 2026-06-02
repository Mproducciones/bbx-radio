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
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      {icons[id] ?? icons.player}
    </svg>
  )
}

function LiveDemoBar() {
  const { isPlaying, toggle } = useRadioPlayerContext()
  if (!isPlaying) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 rounded-full text-xs"
      style={{ background: 'rgba(219,137,24,0.12)', border: '1px solid rgba(219,137,24,0.25)' }}
    >
      <span className="w-2 h-2 rounded-full bg-[#db8918] animate-pulse" />
      <span className="text-[#db8918] font-semibold flex-1">Demo en vivo · Radio Bienvenida</span>
      <button type="button" onClick={toggle} className="text-white/50 hover:text-white">Pausar</button>
    </motion.div>
  )
}

export function BbxLanding() {
  const router = useRouter()
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#07070e' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] rounded-full opacity-40 blur-[100px]" style={{ background: 'radial-gradient(circle, #db8918 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[45%] rounded-full opacity-30 blur-[90px]" style={{ background: 'radial-gradient(circle, #40B9BF 0%, transparent 70%)' }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(7,7,14,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <span className="font-display text-2xl tracking-wider">BBX</span>
          <nav className="hidden md:flex gap-5 text-sm text-white/45">
            <a href="#producto" className="hover:text-white">Producto</a>
            <a href="#negocio" className="hover:text-white">Negocio</a>
            <a href="#planes" className="hover:text-white">Planes</a>
          </nav>
          <a href={bbxWhatsApp('Hola, quiero agendar demo BBX.')} target="_blank" rel="noopener noreferrer"
            className="text-sm font-bold px-4 py-2 rounded-full shrink-0" style={{ background: '#db8918', color: '#07070e' }}>
            Demo gratis
          </a>
        </div>
      </header>

      <main className="relative z-[1]">
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-14 md:pt-14 md:pb-20">
          <div className="flex justify-center mb-5"><LiveDemoBar /></div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">{BBX_HERO.eyebrow}</p>
              <h1 className="font-display text-[clamp(2.5rem,8vw,4.25rem)] leading-[0.95] mb-4">{BBX_HERO.title}</h1>
              <p className="text-white/55 text-base leading-relaxed mb-5 max-w-lg">{BBX_HERO.subtitle}</p>
              <p className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A0]" />
                {BBX_HERO.proof}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={bbxWhatsApp('Hola Bryan, quiero demo BBX.')} target="_blank" rel="noopener noreferrer"
                  className="inline-flex justify-center px-6 py-3.5 rounded-xl font-bold text-[#07070e]"
                  style={{ background: 'linear-gradient(135deg, #db8918, #f2c16a)' }}>
                  Demo en 24h
                </a>
                <a href="#negocio" className="inline-flex justify-center px-6 py-3.5 rounded-xl font-semibold border border-white/15 text-white/80">
                  Ver modelo de negocio
                </a>
              </div>
            </div>
            <BbxPhoneMockup />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BBX_STATS.map(s => (
              <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: '#0e0e16', border: `1px solid ${s.accent}30` }}>
                <p className="font-display text-3xl leading-none" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-white/40 text-xs mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="producto" className="max-w-6xl mx-auto px-4 py-14 md:py-18">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display text-4xl text-white mb-3">Plataforma completa</h2>
            <p className="text-white/45 text-sm">Producto pensado para operación diaria, ventas y oyentes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BBX_FEATURES.map((f, i) => (
              <motion.article key={f.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-5" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${f.accent}18` }}>
                  <BbxIcon id={f.id} color={f.accent} />
                </div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12 border-y border-white/5">
          <h2 className="font-display text-3xl text-center mb-8">Cómo trabajamos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BBX_PROCESS.map(p => (
              <div key={p.step} className="rounded-xl p-4" style={{ background: '#0e0e16' }}>
                <p className="font-mono text-[#db8918] text-xs font-bold mb-1">{p.step}</p>
                <p className="text-white font-semibold text-sm">{p.title}</p>
                <p className="text-white/40 text-xs mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <BbxRevenueSection />
        <BbxPlansSection />

        <section id="faq" className="max-w-2xl mx-auto px-4 py-14">
          <h2 className="font-display text-3xl text-center mb-6">FAQ</h2>
          <div className="space-y-2">
            {BBX_FAQ.map((item, i) => (
              <div key={item.q} className="rounded-xl overflow-hidden" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold">
                  {item.q}
                  <span className="text-white/30">{faqOpen === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-3 text-white/50 text-sm overflow-hidden">{item.a}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="rounded-3xl p-8 md:p-10 text-center" style={{ background: 'linear-gradient(160deg,#1a1028,#07070e)', border: '1px solid rgba(219,137,24,0.2)' }}>
            <h2 className="font-display text-4xl mb-3">¿Digitalizamos tu radio?</h2>
            <p className="text-white/45 text-sm mb-6">Habla con {BBX_CONTACT.name} · demo 24h · setup 48h</p>
            <a href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')} target="_blank" rel="noopener noreferrer"
              className="inline-flex px-8 py-4 rounded-xl font-bold" style={{ background: '#128C7E', color: '#fff' }}>
              WhatsApp directo
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="font-display text-lg text-white/70">BBX RADIO SYSTEM</p>
        <button type="button" onClick={() => router.back()} className="mt-3 text-white/35 text-sm hover:text-white">← Volver a la radio</button>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden border-t border-white/10 backdrop-blur-lg"
        style={{ background: 'rgba(7,7,14,0.94)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <a href={bbxWhatsApp('Hola, quiero demo BBX.')} target="_blank" rel="noopener noreferrer"
          className="flex justify-center w-full py-3.5 rounded-xl font-bold text-[#07070e]" style={{ background: '#db8918' }}>
          Agendar demo
        </a>
      </div>
    </div>
  )
}
