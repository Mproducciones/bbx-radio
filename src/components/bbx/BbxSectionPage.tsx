'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import {
  BBX_CONTACT,
  BBX_FEATURES,
  BBX_FAQ,
  BBX_PROCESS,
  BBX_HUB_SECTIONS,
  bbxWhatsApp,
  type BbxHubSectionId,
} from '@/lib/bbxContent'
import { BbxRevenueSection } from './BbxRevenueSection'
import { BbxPlansSection } from './BbxPlansSection'
import { AccentButton } from '@/components/shared/AccentButton'

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

function ProductoContent() {
  return (
    <section className="py-2">
      <div className="mb-5">
        <h2 className="font-display text-2xl md:text-3xl text-white mb-1">Plataforma completa</h2>
        <p className="text-white/45 text-xs md:text-sm">Operación diaria, ventas y oyentes.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {BBX_FEATURES.map((f, i) => (
          <motion.article
            key={f.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl p-3.5 md:p-4"
            style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${f.accent}16` }}>
              <BbxIcon id={f.id} color={f.accent} />
            </div>
            <h3 className="font-semibold text-white text-sm mb-0.5">{f.title}</h3>
            <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function ProcesoContent() {
  return (
    <section className="py-2">
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
  )
}

function FaqContent() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  return (
    <section className="py-2 max-w-2xl mx-auto w-full">
      <h2 className="font-display text-xl md:text-2xl mb-4">FAQ</h2>
      <div className="space-y-1.5">
        {BBX_FAQ.map((item, i) => (
          <div
            key={item.q}
            className="rounded-lg overflow-hidden"
            style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <button
              type="button"
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              className="w-full flex justify-between gap-2 px-3 py-3 min-h-[44px] text-left text-xs md:text-sm font-semibold items-center"
            >
              {item.q}
              <span className="text-white/30 shrink-0">{faqOpen === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {faqOpen === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 text-white/50 text-xs overflow-hidden leading-relaxed"
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionCta() {
  return (
    <section className="mt-8 pb-4">
      <div
        className="rounded-2xl p-5 md:p-8 text-center"
        style={{ background: 'linear-gradient(160deg,#1a1028,#07070e)', border: '1px solid rgba(219,137,24,0.18)' }}
      >
        <h2 className="font-display text-xl md:text-2xl mb-2">¿Digitalizamos tu radio?</h2>
        <p className="text-white/45 text-xs mb-4">
          {BBX_CONTACT.name} · demo 24h · setup 48h
        </p>
        <AccentButton
          href={bbxWhatsApp('Hola Bryan, quiero digitalizar mi radio.')}
          accent="#128C7E"
          highlight="#25D366"
          className="text-sm"
        >
          WhatsApp directo
        </AccentButton>
      </div>
    </section>
  )
}

export function BbxSectionPage({
  section,
  onBack,
}: {
  section: BbxHubSectionId
  onBack: () => void
}) {
  const hub = BBX_HUB_SECTIONS.find(s => s.id === section)
  const accent = hub?.accent ?? '#db8918'

  return (
    <div className="relative flex flex-col w-full min-w-0 text-white overflow-x-hidden" style={{ background: 'var(--color-ink-900)' }}>
      <header
        className="sticky top-0 z-50 shrink-0 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(7,7,14,0.95)' }}
      >
        <div className="max-w-6xl mx-auto px-3 md:px-4 min-h-12 py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white shrink-0 rounded-xl px-2.5 py-2 min-h-[44px]"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} aria-hidden />
            BBX
          </button>
          <Link
            href="/"
            className="flex items-center gap-1 text-[10px] font-semibold text-white/45 hover:text-white shrink-0 rounded-lg px-2 py-2 min-h-[44px]"
          >
            Radio
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm text-white truncate">{hub?.label ?? section}</p>
            <p className="text-[10px] text-white/40 truncate">{hub?.subtitle}</p>
          </div>
          <AccentButton
            href={bbxWhatsApp('Hola, quiero demo BBX.')}
            accent={accent}
            className="shrink-0 !px-3 !py-1.5 !text-[10px]"
          >
            Demo
          </AccentButton>
        </div>
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent 80%)` }} />
      </header>

      <div className="relative z-[1] flex-1 min-w-0 max-w-6xl mx-auto w-full px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        {section === 'producto' && <ProductoContent />}
        {section === 'proceso' && <ProcesoContent />}
        {section === 'negocio' && <BbxRevenueSection embedded />}
        {section === 'planes' && <BbxPlansSection />}
        {section === 'faq' && <FaqContent />}
        <SectionCta />
      </div>
    </div>
  )
}
