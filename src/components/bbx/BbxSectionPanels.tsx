'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BBX_FEATURES,
  BBX_FAQ,
  BBX_PROCESS,
  BBX_HUB_SECTIONS,
  type BbxHubSectionId,
} from '@/lib/bbxContent'
import { BbxRevenueSection } from './BbxRevenueSection'
import { BbxPlansSection } from './BbxPlansSection'
import { BbxSectionSheet } from './BbxSectionSheet'

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

function ProductoPanel() {
  return (
    <div className="grid gap-2">
      {BBX_FEATURES.map((f, i) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl p-3.5"
          style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.accent}16` }}>
              <BbxIcon id={f.id} color={f.accent} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{f.title}</h3>
              <p className="text-white/45 text-xs leading-relaxed mt-0.5">{f.desc}</p>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}

function ProcesoPanel() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {BBX_PROCESS.map(p => (
        <div key={p.step} className="rounded-xl p-3" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-mono text-[#db8918] text-[10px] font-bold">{p.step}</p>
          <p className="text-white font-semibold text-xs mt-1">{p.title}</p>
          <p className="text-white/40 text-[10px] mt-1 leading-snug">{p.desc}</p>
        </div>
      ))}
    </div>
  )
}

function FaqPanel() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  return (
    <div className="space-y-1.5">
      {BBX_FAQ.map((item, i) => (
        <div key={item.q} className="rounded-lg overflow-hidden" style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            type="button"
            onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            className="w-full flex justify-between gap-2 px-3 py-3 min-h-[44px] text-left text-xs font-semibold items-center"
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
  )
}

const SECTION_META: Record<BbxHubSectionId, { title: string; subtitle: string }> = {
  producto: { title: 'Plataforma completa', subtitle: 'Operación diaria, ventas y oyentes' },
  proceso: { title: 'Cómo trabajamos', subtitle: 'De diagnóstico a crecimiento' },
  negocio: { title: 'Modelo de negocio', subtitle: 'Ingresos adicionales con tu app' },
  planes: { title: 'Planes BBX', subtitle: 'Mensual + setup · sin permanencia' },
  faq: { title: 'Preguntas frecuentes', subtitle: 'Precios, PWA y upgrades' },
}

export function BbxSectionPanels({
  section,
  onClose,
}: {
  section: BbxHubSectionId | null
  onClose: () => void
}) {
  const meta = section ? SECTION_META[section] : null
  const hub = section ? BBX_HUB_SECTIONS.find(s => s.id === section) : null

  return (
    <BbxSectionSheet
      open={section !== null}
      title={meta?.title ?? ''}
      subtitle={meta?.subtitle}
      accent={hub?.accent}
      onClose={onClose}
    >
      {section === 'producto' && <ProductoPanel />}
      {section === 'proceso' && <ProcesoPanel />}
      {section === 'negocio' && (
        <div className="-mx-4 px-0">
          <BbxRevenueSection embedded />
        </div>
      )}
      {section === 'planes' && (
        <div className="-mx-4">
          <BbxPlansSection embedded />
        </div>
      )}
      {section === 'faq' && <FaqPanel />}
    </BbxSectionSheet>
  )
}
