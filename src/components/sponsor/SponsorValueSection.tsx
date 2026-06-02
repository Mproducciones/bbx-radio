'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPONSOR_VALUE, type SponsorValueLine } from '@/lib/sponsorContent'

function ValueRow({ line, open, onToggle }: { line: SponsorValueLine; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: open ? `${line.color}0c` : '#0e0e16',
      border: `1px solid ${open ? `${line.color}40` : 'rgba(255,255,255,0.07)'}`,
    }}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-4 min-h-[52px] text-left active:bg-white/[0.02]">
        <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm"
          style={{ background: `${line.color}20`, color: line.color }}>+</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{line.title}</p>
          <p className="text-white/40 text-xs mt-0.5">{line.hook}</p>
        </div>
        <span className="text-[10px] text-white/30 shrink-0">{open ? 'Cerrar' : 'Detalle'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <p className="text-white/75 text-sm leading-relaxed pt-3">{line.benefit}</p>
              <div className="rounded-xl overflow-hidden border border-white/6">
                {line.breakdown.map((r, i) => (
                  <div key={r.label} className="flex justify-between gap-2 px-3 py-2 text-xs"
                    style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.02)', borderTop: i ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                    <span className="text-white/50">{r.label}</span>
                    <span className="text-white font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/45"><span style={{ color: line.color }} className="font-semibold">Tip: </span>{line.tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SponsorValueSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <section className="mb-8 md:mb-10">
      <h2 className="font-display text-xl md:text-3xl text-white mb-1.5 md:mb-2">{SPONSOR_VALUE.title}</h2>
      <p className="text-white/45 text-sm mb-4 md:mb-5 leading-relaxed">{SPONSOR_VALUE.intro}</p>
      <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold mb-2">Toca para ver qué incluye</p>
      <div className="space-y-2">
        {SPONSOR_VALUE.lines.map(line => (
          <ValueRow key={line.id} line={line} open={openId === line.id} onToggle={() => setOpenId(openId === line.id ? null : line.id)} />
        ))}
      </div>
    </section>
  )
}
