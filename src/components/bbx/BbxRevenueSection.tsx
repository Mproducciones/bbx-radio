'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_REVENUE, BBX_PRICING_LAYERS, type BbxRevenueLine } from '@/lib/bbxContent'

function RevenueIcon({ id, color }: { id: string; color: string }) {
  const paths: Record<string, string> = {
    banners:
      'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 2v1h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h16v12z',
    sorteos:
      'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
    programatico:
      'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={color} aria-hidden>
      <path d={paths[id] ?? paths.banners} />
    </svg>
  )
}

function RevenueDetail({ line }: { line: BbxRevenueLine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl overflow-hidden mt-3"
      style={{
        background: `linear-gradient(165deg, ${line.color}12 0%, rgba(12,12,20,0.95) 55%)`,
        border: `1px solid ${line.color}35`,
      }}
    >
      <div className="p-4 space-y-3">
        <p className="text-white/75 text-sm leading-relaxed">{line.ownerBenefit}</p>
        <div className="grid gap-2">
          {line.breakdown.map(row => (
            <div
              key={row.label}
              className="flex justify-between gap-3 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-white/45 leading-snug">{row.label}</span>
              <span className="text-white font-semibold shrink-0 text-right">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] leading-relaxed text-white/50 pt-1 border-t border-white/6">
          <span className="font-bold" style={{ color: line.color }}>Cómo venderlo · </span>
          {line.howToSell}
        </p>
      </div>
    </motion.div>
  )
}

function RevenueCard({
  line,
  open,
  onToggle,
  compact,
}: {
  line: BbxRevenueLine
  open: boolean
  onToggle: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative text-left overflow-hidden rounded-2xl transition-all duration-200 active:scale-[0.98] ${
        compact ? 'w-[min(76vw,272px)] shrink-0 snap-center' : 'w-full'
      }`}
      style={{
        background: open
          ? `linear-gradient(145deg, ${line.color}18 0%, rgba(14,14,22,0.98) 45%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(14,14,22,0.98) 100%)',
        border: open ? `1.5px solid ${line.color}55` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: open ? `0 8px 32px ${line.color}20` : undefined,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${line.color}, ${line.color}44)` }}
      />

      <div className="relative pl-4 pr-3.5 py-3.5 md:py-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${line.color}1a`, border: `1px solid ${line.color}30` }}
          >
            <RevenueIcon id={line.id} color={line.color} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{ background: `${line.color}18`, color: line.color }}
          >
            {open ? 'Activo' : 'Ver'}
          </span>
        </div>

        <p className="font-display text-2xl md:text-3xl leading-none mb-1" style={{ color: line.color }}>
          +{line.amountLabel}
        </p>
        <p className="text-white font-semibold text-sm leading-tight mb-1">{line.title}</p>
        <p className="text-white/40 text-[11px] leading-snug line-clamp-2">{line.hook}</p>

        <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-white/30">
          <span>{open ? 'Cerrar' : 'Desglose'}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            ▾
          </motion.span>
        </div>
      </div>
    </button>
  )
}

export function BbxRevenueSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openLine = BBX_REVENUE.lines.find(l => l.id === openId) ?? null

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <section id="negocio" className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(0,217,160,0.04) 0%, #0c0c14 38%, #07070e 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="p-4 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-[#00D9A0] text-[9px] font-black uppercase tracking-[0.18em] mb-1">
                Modelo de negocio
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-white leading-none mb-1.5">
                {BBX_REVENUE.title}
              </h2>
              <p className="text-white/45 text-xs md:text-sm max-w-xl">{BBX_REVENUE.subtitle}</p>
            </div>
            <div
              className="shrink-0 rounded-xl px-4 py-3 text-center sm:text-right"
              style={{ background: 'rgba(0,217,160,0.08)', border: '1px solid rgba(0,217,160,0.2)' }}
            >
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Potencial extra</p>
              <p className="font-display text-2xl md:text-3xl text-[#00D9A0] leading-none mt-0.5">
                +{BBX_REVENUE.totalLabel}
              </p>
              <p className="text-[9px] text-white/35 mt-1">/ mes · referencial</p>
            </div>
          </div>

          <p
            className="text-white/55 text-xs leading-relaxed mb-5 p-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {BBX_REVENUE.ownerIntro}
          </p>

          <div
            id="precios-capas"
            className="mb-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(219,137,24,0.06) 0%, rgba(12,12,20,0.6) 100%)',
              border: '1px solid rgba(219,137,24,0.15)',
            }}
          >
            <div className="px-4 py-3.5 border-b border-white/6">
              <p className="text-[#db8918] text-[9px] font-black uppercase tracking-[0.16em] mb-1">Importante</p>
              <h3 className="font-display text-lg md:text-xl text-white leading-tight">{BBX_PRICING_LAYERS.title}</h3>
              <p className="text-white/50 text-[11px] md:text-xs mt-1.5 leading-relaxed max-w-2xl">
                {BBX_PRICING_LAYERS.intro}
              </p>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
              {BBX_PRICING_LAYERS.layers.map(layer => (
                <div key={layer.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ background: `${layer.accent}20`, color: layer.accent }}
                    >
                      {layer.id === 'bbx-radio' ? '1' : '2'}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-xs">{layer.title}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: layer.accent }}>
                        {layer.flow}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {layer.examples.map(row => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-2 px-3 py-2 rounded-lg text-[10px] md:text-xs"
                        style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <span className="text-white/45">{row.label}</span>
                        <span className="text-white/90 font-medium shrink-0 text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/38 text-[10px] leading-relaxed mt-2.5">{layer.note}</p>
                </div>
              ))}
            </div>
            <p
              className="px-4 py-2.5 text-[10px] text-white/35 border-t border-white/6 leading-relaxed"
              style={{ background: 'rgba(0,217,160,0.04)' }}
            >
              {BBX_PRICING_LAYERS.footnote}
            </p>
          </div>

          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-lg text-white leading-none">Ingresos desglosados</h3>
              <p className="text-white/35 text-[10px] mt-1">Toca una tarjeta · ejemplo mensual</p>
            </div>
          </div>

          {/* Móvil: carrusel horizontal */}
          <div className="md:hidden flex gap-2.5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            {BBX_REVENUE.lines.map(line => (
              <RevenueCard
                key={line.id}
                line={line}
                open={openId === line.id}
                onToggle={() => toggle(line.id)}
                compact
              />
            ))}
          </div>

          {/* Desktop: lista vertical */}
          <div className="hidden md:grid md:grid-cols-3 gap-3">
            {BBX_REVENUE.lines.map(line => (
              <RevenueCard
                key={line.id}
                line={line}
                open={openId === line.id}
                onToggle={() => toggle(line.id)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {openLine && <RevenueDetail key={openLine.id} line={openLine} />}
          </AnimatePresence>

          <div
            className="mt-4 rounded-xl px-4 py-3"
            style={{ background: 'rgba(0,217,160,0.06)', border: '1px solid rgba(0,217,160,0.14)' }}
          >
            <p className="text-white/55 text-xs leading-relaxed">{BBX_REVENUE.roiNote}</p>
            <p className="text-white/30 text-[10px] mt-1.5">{BBX_REVENUE.totalNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
