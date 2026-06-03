'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SPONSOR_VALUE, type SponsorValueLine } from '@/lib/sponsorContent'
import { accentTileStyle } from '@/lib/accentUi'

function ValueTile({
  line,
  open,
  onToggle,
}: {
  line: SponsorValueLine
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="relative flex flex-col items-center text-center min-w-0 p-2 rounded-xl overflow-hidden transition-all active:scale-[0.98]"
      style={accentTileStyle(line.color, open)}
    >
      <div
        className="relative w-10 h-10 rounded-md overflow-hidden mb-1.5 shrink-0"
        style={{ border: `1px solid ${line.color}35` }}
      >
        <Image src={line.image} alt="" fill className="object-cover" sizes="40px" />
      </div>
      <p className="text-[10px] font-medium text-white leading-tight line-clamp-2">{line.title}</p>
      <span className="text-[9px] text-white/35 mt-1">{open ? '−' : '+'}</span>
    </button>
  )
}

export function SponsorValueSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openLine = SPONSOR_VALUE.lines.find(l => l.id === openId)

  return (
    <section className="mb-4">
      <h2 className="text-sm font-semibold text-white">{SPONSOR_VALUE.title}</h2>
      <p className="text-white/55 text-xs mt-1 mb-2 leading-relaxed">{SPONSOR_VALUE.intro}</p>

      <div className="grid grid-cols-3 gap-2">
        {SPONSOR_VALUE.lines.map(line => (
          <ValueTile
            key={line.id}
            line={line}
            open={openId === line.id}
            onToggle={() => setOpenId(openId === line.id ? null : line.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {openLine && (
          <motion.div
            key={openLine.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-white/8 px-2.5 py-2 text-xs space-y-2">
              <p className="text-white/45 text-[11px]">{openLine.hook}</p>
              <p className="text-white/70 leading-relaxed">{openLine.benefit}</p>
              <div className="divide-y divide-white/6">
                {openLine.breakdown.map(r => (
                  <div key={r.label} className="flex justify-between gap-2 py-1.5">
                    <span className="text-white/45">{r.label}</span>
                    <span className="text-white/85 shrink-0 text-right">{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 leading-relaxed pb-0.5">
                <span style={{ color: openLine.color }}>Tip: </span>
                {openLine.tip}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
