'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BBX_REVENUE, type BbxRevenueLine } from '@/lib/bbxContent'

function RevenueRow({ line, open, onToggle }: { line: BbxRevenueLine; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors"
      style={{
        background: open ? `${line.color}0c` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? `${line.color}45` : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-4 py-4 md:px-5 md:py-5 text-left"
      >
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-display text-lg"
          style={{ background: `${line.color}20`, color: line.color }}
        >
          +
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm md:text-base">{line.title}</p>
          <p className="text-white/40 text-xs mt-0.5 truncate">{line.hook}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-xl md:text-2xl leading-none" style={{ color: line.color }}>
            +{line.amountLabel}
          </p>
          <p className="text-white/30 text-[10px] mt-1">{open ? 'Ocultar' : 'Ver detalle'}</p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5 md:pb-6 pt-0 space-y-4 border-t border-white/5">
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${line.color}` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Para el dueño de la radio
                </p>
                <p className="text-white/85 text-sm leading-relaxed">{line.ownerBenefit}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">
                  Desglose del cálculo
                </p>
                <div className="rounded-xl overflow-hidden border border-white/6">
                  {line.breakdown.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex justify-between gap-3 px-3 py-2.5 text-sm"
                      style={{
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                      }}
                    >
                      <span className="text-white/55">{row.label}</span>
                      <span className="text-white font-medium shrink-0">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl px-3 py-3" style={{ background: `${line.color}10` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: line.color }}>
                  Cómo venderlo
                </p>
                <p className="text-white/60 text-xs leading-relaxed">{line.howToSell}</p>
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
    <section id="negocio" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <div className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(0,217,160,0.06) 0%, #0c0c14 40%, #07070e 100%)',
          border: '1px solid rgba(0,217,160,0.18)',
        }}
      >
        <div className="p-6 md:p-10">
          <p className="text-[#00D9A0] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Modelo de negocio
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white leading-none mb-3">
            {BBX_REVENUE.title}
          </h2>
          <p className="text-white/45 text-sm md:text-base max-w-2xl mb-4">{BBX_REVENUE.subtitle}</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-3xl mb-8 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {BBX_REVENUE.ownerIntro}
          </p>

          <p className="text-white/35 text-xs mb-3 uppercase tracking-wider font-semibold">
            Toca cada línea para ver el desglose
          </p>
          <div className="space-y-2">
            {BBX_REVENUE.lines.map(line => (
              <RevenueRow
                key={line.id}
                line={line}
                open={openId === line.id}
                onToggle={() => setOpenId(openId === line.id ? null : line.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAll(v => !v)}
            className="mt-4 text-xs font-semibold text-[#00D9A0] hover:underline"
          >
            {showAll ? 'Ocultar resumen' : 'Ver resumen para el dueño →'}
          </button>

          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-5 rounded-2xl"
                style={{ background: 'rgba(0,217,160,0.08)', border: '1px solid rgba(0,217,160,0.2)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
                  <div>
                    <p className="text-white/50 text-sm">Potencial extra mensual (ejemplo)</p>
                    <p className="font-display text-5xl text-[#00D9A0] leading-none mt-1">
                      +{BBX_REVENUE.totalLabel}
                    </p>
                  </div>
                  <p className="text-white/40 text-xs max-w-xs">{BBX_REVENUE.totalNote}</p>
                </div>
                <p className="text-white/60 text-sm leading-relaxed border-t border-[#00D9A0]/15 pt-3">
                  {BBX_REVENUE.roiNote}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
