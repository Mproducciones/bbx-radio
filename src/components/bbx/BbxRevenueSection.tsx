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
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill={color} aria-hidden>
      <path d={paths[id] ?? paths.banners} />
    </svg>
  )
}

function RevenueRow({
  line,
  open,
  onToggle,
}: {
  line: BbxRevenueLine
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-colors"
      style={{
        background: open ? `${line.color}0c` : 'rgba(255,255,255,0.03)',
        border: open ? `1px solid ${line.color}45` : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left px-3.5 py-3 md:py-3.5 flex items-center gap-3 active:bg-white/[0.02]"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${line.color}18`, border: `1px solid ${line.color}35` }}
        >
          <RevenueIcon id={line.id} color={line.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-white font-semibold text-sm leading-tight truncate">{line.title}</p>
            <p className="font-semibold text-base tabular-nums shrink-0" style={{ color: line.color }}>
              +{line.amountLabel}
            </p>
          </div>
          <p className="text-white/55 text-xs mt-0.5 leading-snug line-clamp-1">{line.hook}</p>
        </div>

        <span className="text-white/35 text-xs shrink-0 w-14 text-right">
          {open ? 'Cerrar' : 'Desglose'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-white/[0.06] px-3.5 pb-3.5 pt-2.5 space-y-2.5"
          >
            <p className="text-white/75 text-sm leading-relaxed">{line.ownerBenefit}</p>
            <div className="space-y-1">
              {line.breakdown.map(row => (
                <div
                  key={row.label}
                  className="flex justify-between gap-3 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="text-white/50">{row.label}</span>
                  <span className="text-white font-medium shrink-0 text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-white/55">
              <span className="font-semibold" style={{ color: line.color }}>Cómo venderlo · </span>
              {line.howToSell}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BbxRevenueSection({ embedded }: { embedded?: boolean } = {}) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <section
      id={embedded ? undefined : 'negocio'}
      className={embedded ? 'py-0' : 'max-w-6xl mx-auto px-0 md:px-4 py-2 md:py-4'}
    >
      <div
        className="rounded-2xl"
        style={{
          background: 'linear-gradient(160deg, rgba(0,217,160,0.04) 0%, #0c0c14 38%, #07070e 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              {!embedded && (
                <p className="text-[#00D9A0] text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                  Modelo de negocio
                </p>
              )}
              <h2 className="font-display text-xl md:text-2xl text-white leading-tight mb-1">
                {BBX_REVENUE.title}
              </h2>
              <p className="text-white/55 text-sm max-w-xl leading-relaxed">{BBX_REVENUE.subtitle}</p>
            </div>
            <div
              className="shrink-0 rounded-lg px-3 py-2.5 text-center sm:text-right"
              style={{ background: 'rgba(0,217,160,0.08)', border: '1px solid rgba(0,217,160,0.2)' }}
            >
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Potencial extra</p>
              <p className="font-display text-xl text-[#00D9A0] leading-none mt-0.5 tabular-nums">
                +{BBX_REVENUE.totalLabel}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">/ mes · referencial</p>
            </div>
          </div>

          <p
            className="text-white/60 text-sm leading-relaxed mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {BBX_REVENUE.ownerIntro}
          </p>

          <div
            id="precios-capas"
            className="mb-5 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(219,137,24,0.05)',
              border: '1px solid rgba(219,137,24,0.12)',
            }}
          >
            <div className="px-3.5 py-3 border-b border-white/6">
              <p className="text-[#db8918] text-[10px] font-bold uppercase tracking-wide mb-0.5">Importante</p>
              <h3 className="font-display text-base md:text-lg text-white leading-tight">{BBX_PRICING_LAYERS.title}</h3>
              <p className="text-white/55 text-xs mt-1 leading-relaxed max-w-2xl">{BBX_PRICING_LAYERS.intro}</p>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
              {BBX_PRICING_LAYERS.layers.map(layer => (
                <div key={layer.id} className="p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: `${layer.accent}20`, color: layer.accent }}
                    >
                      {layer.id === 'bbx-radio' ? '1' : '2'}
                    </span>
                    <div>
                      <p className="text-white font-medium text-xs">{layer.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: layer.accent }}>{layer.flow}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {layer.examples.map(row => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs"
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <span className="text-white/50">{row.label}</span>
                        <span className="text-white/85 font-medium shrink-0 text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/45 text-[11px] leading-relaxed mt-2">{layer.note}</p>
                </div>
              ))}
            </div>
            <p className="px-3.5 py-2 text-[11px] text-white/40 border-t border-white/6 leading-relaxed">
              {BBX_PRICING_LAYERS.footnote}
            </p>
          </div>

          <p className="text-white/45 text-xs mb-2">Ingresos desglosados · toca para ver detalle</p>
          <div className="space-y-2">
            {BBX_REVENUE.lines.map(line => (
              <RevenueRow
                key={line.id}
                line={line}
                open={openId === line.id}
                onToggle={() => toggle(line.id)}
              />
            ))}
          </div>

          <div
            className="mt-4 rounded-lg px-3.5 py-2.5"
            style={{ background: 'rgba(0,217,160,0.06)', border: '1px solid rgba(0,217,160,0.14)' }}
          >
            <p className="text-white/60 text-xs leading-relaxed">{BBX_REVENUE.roiNote}</p>
            <p className="text-white/40 text-[11px] mt-1">{BBX_REVENUE.totalNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
