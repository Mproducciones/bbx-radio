'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SPONSOR_VALUE, type SponsorValueLine } from '@/lib/sponsorContent'

function ValueRow({
  line,
  open,
  onToggle,
}: {
  line: SponsorValueLine
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3.5 text-left active:bg-white/[0.04]"
      >
        <div
          className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
          style={{ border: `1px solid ${line.color}40` }}
        >
          <Image src={line.image} alt="" fill className="object-cover" sizes="48px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{line.title}</p>
          <p className="text-xs text-white/50 mt-0.5 line-clamp-2 leading-relaxed">{line.hook}</p>
        </div>
        <span className="text-sm text-white/35 shrink-0 w-5 text-center">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-3.5 pb-3.5 pt-2 space-y-2.5 text-sm">
              <p className="text-white/70 leading-relaxed">{line.benefit}</p>
              <div className="rounded-lg border border-white/8 divide-y divide-white/8 overflow-hidden">
                {line.breakdown.map(r => (
                  <div key={r.label} className="flex justify-between gap-3 px-3 py-2.5 text-sm">
                    <span className="text-white/50">{r.label}</span>
                    <span className="text-white font-medium shrink-0 text-right">{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/55 text-xs leading-relaxed">
                <span className="font-semibold" style={{ color: line.color }}>Tip · </span>
                {line.tip}
              </p>
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
    <section className="mb-6">
      <h2 className="text-base font-semibold text-white">{SPONSOR_VALUE.title}</h2>
      <p className="text-white/55 text-sm mt-1.5 mb-3 leading-relaxed">{SPONSOR_VALUE.intro}</p>
      <div className="space-y-2">
        {SPONSOR_VALUE.lines.map(line => (
          <ValueRow
            key={line.id}
            line={line}
            open={openId === line.id}
            onToggle={() => setOpenId(openId === line.id ? null : line.id)}
          />
        ))}
      </div>
    </section>
  )
}
