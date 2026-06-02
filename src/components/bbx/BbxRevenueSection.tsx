'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_REVENUE, BBX_PRICING_LAYERS, type BbxRevenueLine } from '@/lib/bbxContent'

function RevenueRow({ line, open, onToggle }: { line: BbxRevenueLine; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: open ? `${line.color}0c` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${open ? `${line.color}40` : 'rgba(255,255,255,0.07)'}`,
    }}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-3 md:px-4 md:py-3.5 text-left min-h-[52px]">
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-display text-sm"
          style={{ background: `${line.color}18`, color: line.color }}>+</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-xs md:text-sm">{line.title}</p>
          <p className="text-white/40 text-[10px] mt-0.5 truncate">{line.hook}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-lg md:text-xl leading-none" style={{ color: line.color }}>+{line.amountLabel}</p>
          <p className="text-white/30 text-[9px] mt-0.5">{open ? 'Cerrar' : 'Detalle'}</p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pb-4 md:px-4 md:pb-5 space-y-3 border-t border-white/5">
              <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(0,0,0,0.22)', borderLeft: `3px solid ${line.color}` }}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/35 mb-0.5">Para el dueño</p>
                <p className="text-white/80 text-xs leading-relaxed">{line.ownerBenefit}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30 mb-1.5">Desglose</p>
                <div className="rounded-lg overflow-hidden border border-white/5">
                  {line.breakdown.map((row, i) => (
                    <div key={row.label} className="flex justify-between gap-2 px-2.5 py-2 text-xs"
                      style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.02)', borderTop: i ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                      <span className="text-white/50">{row.label}</span>
                      <span className="text-white font-medium shrink-0">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg px-2.5 py-2" style={{ background: `${line.color}0c` }}>
                <p className="text-[9px] font-bold uppercase mb-0.5" style={{ color: line.color }}>Cómo venderlo</p>
                <p className="text-white/55 text-[10px] leading-relaxed">{line.howToSell}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BbxRevenueSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  return (
    <section id="negocio" className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(0,217,160,0.05) 0%, #0c0c14 40%, #07070e 100%)',
        border: '1px solid rgba(0,217,160,0.15)',
      }}>
        <div className="p-4 md:p-7">
          <p className="text-[#00D9A0] text-[9px] font-black uppercase tracking-[0.18em] mb-1">Modelo de negocio</p>
          <h2 className="font-display text-2xl md:text-3xl text-white leading-none mb-2">{BBX_REVENUE.title}</h2>
          <p className="text-white/45 text-xs md:text-sm max-w-2xl mb-3">{BBX_REVENUE.subtitle}</p>
          <p className="text-white/65 text-xs leading-relaxed max-w-3xl mb-4 p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {BBX_REVENUE.ownerIntro}
          </p>

          <div id="precios-capas" className="mb-5 rounded-xl overflow-hidden border border-white/8"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="px-3 py-3 md:px-4 md:py-4 border-b border-white/6">
              <p className="text-[#db8918] text-[9px] font-black uppercase tracking-[0.16em] mb-1">Importante</p>
              <h3 className="font-display text-lg md:text-xl text-white leading-tight">{BBX_PRICING_LAYERS.title}</h3>
              <p className="text-white/50 text-[11px] md:text-xs mt-1.5 leading-relaxed max-w-2xl">{BBX_PRICING_LAYERS.intro}</p>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
              {BBX_PRICING_LAYERS.layers.map(layer => (
                <div key={layer.id} className="p-3 md:p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: layer.accent }} />
                    <div>
                      <p className="text-white font-semibold text-xs">{layer.title}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: layer.accent }}>{layer.flow}</p>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-white/5 mb-2">
                    {layer.examples.map((row, i) => (
                      <div key={row.label} className="flex justify-between gap-2 px-2.5 py-1.5 text-[10px] md:text-xs"
                        style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.02)', borderTop: i ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                        <span className="text-white/45">{row.label}</span>
                        <span className="text-white/85 font-medium shrink-0 text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-[10px] leading-relaxed">{layer.note}</p>
                </div>
              ))}
            </div>
            <p className="px-3 py-2.5 md:px-4 text-[10px] text-white/35 border-t border-white/6 leading-relaxed"
              style={{ background: 'rgba(0,217,160,0.04)' }}>
              {BBX_PRICING_LAYERS.footnote}
            </p>
          </div>

          <p className="text-white/30 text-[9px] mb-2 uppercase tracking-wider font-semibold">Toca cada línea</p>
          <div className="space-y-1.5">
            {BBX_REVENUE.lines.map(line => (
              <RevenueRow key={line.id} line={line} open={openId === line.id} onToggle={() => setOpenId(openId === line.id ? null : line.id)} />
            ))}
          </div>

          <button type="button" onClick={() => setShowAll(v => !v)} className="mt-3 text-[10px] font-semibold text-[#00D9A0]">
            {showAll ? 'Ocultar resumen' : 'Ver resumen para el dueño →'}
          </button>

          <AnimatePresence>
            {showAll && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(0,217,160,0.07)', border: '1px solid rgba(0,217,160,0.18)' }}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
                  <div>
                    <p className="text-white/45 text-xs">Potencial extra mensual</p>
                    <p className="font-display text-4xl text-[#00D9A0] leading-none mt-0.5">+{BBX_REVENUE.totalLabel}</p>
                  </div>
                  <p className="text-white/35 text-[10px] max-w-xs">{BBX_REVENUE.totalNote}</p>
                </div>
                <p className="text-white/55 text-xs leading-relaxed border-t border-[#00D9A0]/12 pt-2">{BBX_REVENUE.roiNote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
