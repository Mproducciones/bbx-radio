'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_REVENUE, BBX_PRICING_LAYERS, type BbxRevenueLine } from '@/lib/bbxContent'

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
    <div className="border-b border-white/6 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left py-2.5 flex items-baseline justify-between gap-2 text-xs active:bg-white/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium truncate">{line.title}</p>
          <p className="text-white/45 text-[11px] mt-0.5 truncate">{line.hook}</p>
        </div>
        <span className="font-medium tabular-nums shrink-0" style={{ color: line.color }}>
          +{line.amountLabel}
        </span>
        <span className="text-white/30 shrink-0 w-3">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-2.5 space-y-2 text-xs">
              <p className="text-white/70 leading-relaxed">{line.ownerBenefit}</p>
              <div className="divide-y divide-white/6">
                {line.breakdown.map(row => (
                  <div key={row.label} className="flex justify-between gap-2 py-1.5">
                    <span className="text-white/45">{row.label}</span>
                    <span className="text-white/85 shrink-0 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 leading-relaxed">
                <span className="font-medium" style={{ color: line.color }}>Venta · </span>
                {line.howToSell}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BbxRevenueSection({ embedded }: { embedded?: boolean } = {}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [layersOpen, setLayersOpen] = useState(false)

  return (
    <section id={embedded ? undefined : 'negocio'} className={embedded ? 'py-0' : 'py-2'}>
      {!embedded && (
        <p className="text-[#00D9A0] text-[10px] font-medium uppercase tracking-wide mb-1">Modelo de negocio</p>
      )}
      <h2 className="text-sm font-semibold text-white leading-snug">{BBX_REVENUE.title}</h2>
      <p className="text-white/55 text-xs mt-1 mb-2 leading-relaxed">{BBX_REVENUE.subtitle}</p>
      <p className="text-xs text-white/50 mb-3">
        Potencial extra <span className="text-[#00D9A0] font-medium">+{BBX_REVENUE.totalLabel}</span>/mes · referencial
      </p>

      <p className="text-white/60 text-xs leading-relaxed mb-3">{BBX_REVENUE.ownerIntro}</p>

      <button
        type="button"
        onClick={() => setLayersOpen(!layersOpen)}
        className="w-full flex items-center justify-between gap-2 py-2 text-left text-xs border-y border-white/8 mb-3 active:bg-white/[0.02]"
      >
        <span className="text-white font-medium">{BBX_PRICING_LAYERS.title}</span>
        <span className="text-white/30">{layersOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {layersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3 text-xs space-y-3"
          >
            <p className="text-white/55 leading-relaxed">{BBX_PRICING_LAYERS.intro}</p>
            {BBX_PRICING_LAYERS.layers.map(layer => (
              <div key={layer.id}>
                <p className="text-white font-medium">{layer.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: layer.accent }}>{layer.flow}</p>
                <div className="mt-1 divide-y divide-white/6">
                  {layer.examples.map(row => (
                    <div key={row.label} className="flex justify-between gap-2 py-1.5">
                      <span className="text-white/45">{row.label}</span>
                      <span className="text-white/85 shrink-0">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/45 text-[11px] mt-1">{layer.note}</p>
              </div>
            ))}
            <p className="text-white/40 text-[11px]">{BBX_PRICING_LAYERS.footnote}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/45 text-[11px] mb-1">Ingresos · toca para detalle</p>
      <div className="rounded-lg border border-white/8 px-2 mb-3">
        {BBX_REVENUE.lines.map(line => (
          <RevenueRow
            key={line.id}
            line={line}
            open={openId === line.id}
            onToggle={() => setOpenId(openId === line.id ? null : line.id)}
          />
        ))}
      </div>

      <p className="text-white/55 text-xs leading-relaxed">{BBX_REVENUE.roiNote}</p>
      <p className="text-white/40 text-[11px] mt-1">{BBX_REVENUE.totalNote}</p>
    </section>
  )
}
