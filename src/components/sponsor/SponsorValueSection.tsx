'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SPONSOR_VALUE, type SponsorValueLine } from '@/lib/sponsorContent'

function ValueRow({
  line,
  open,
  onToggle,
  index,
}: {
  line: SponsorValueLine
  open: boolean
  onToggle: () => void
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        import('animejs').then(({ animate }) => {
          animate(el, {
            translateY: [16, 0],
            opacity: [0, 1],
            duration: 500,
            delay: index * 100,
            ease: 'out(3)',
          })
        })
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden opacity-0"
      style={{
        background: open ? `${line.color}08` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? line.color + '30' : 'rgba(255,255,255,0.08)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3.5 text-left active:bg-white/[0.04]"
      >
        {/* Thumbnail with color accent */}
        <div
          className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
          style={{ border: `1.5px solid ${line.color}${open ? '60' : '30'}`, transition: 'border-color 0.3s' }}
        >
          <Image src={line.image} alt="" fill className="object-cover" sizes="48px" loading="eager" />
          {open && (
            <div className="absolute inset-0" style={{ background: `${line.color}20` }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-white leading-snug">{line.title}</p>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: line.color }} />
          </div>
          <p className="text-xs text-white/55 leading-relaxed">{line.hook}</p>
          {!open && (
            <p className="text-[11px] text-white/35 mt-1 line-clamp-1">{line.benefit}</p>
          )}
        </div>

        {/* Toggle button */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{
            background: open ? `${line.color}20` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${open ? line.color + '40' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          <motion.svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={open ? line.color : 'rgba(255,255,255,0.4)'}
            strokeWidth={2.5} strokeLinecap="round"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-3.5 pb-4 pt-3 space-y-3 text-sm">
              <p className="text-white/70 leading-relaxed">{line.benefit}</p>

              {/* Breakdown table */}
              <div
                className="rounded-xl overflow-hidden divide-y divide-white/[0.06]"
                style={{ border: `1px solid ${line.color}20` }}
              >
                {line.breakdown.map(r => (
                  <div key={r.label} className="flex justify-between gap-3 px-3 py-2.5">
                    <span className="text-white/45 text-xs">{r.label}</span>
                    <span className="text-xs font-semibold shrink-0 text-right" style={{ color: line.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div
                className="rounded-xl px-3 py-2.5 flex gap-2 items-start"
                style={{ background: `${line.color}10`, border: `1px solid ${line.color}20` }}
              >
                <span className="text-base shrink-0">💡</span>
                <p className="text-white/60 text-xs leading-relaxed">
                  <span className="font-bold" style={{ color: line.color }}>Tip · </span>
                  {line.tip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SponsorValueSection() {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(['fm']))
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        import('animejs').then(({ animate }) => {
          animate(el, { translateY: [12, 0], opacity: [0, 1], duration: 450, ease: 'out(3)' })
        })
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll  = () => setOpenIds(new Set(SPONSOR_VALUE.lines.map(l => l.id)))
  const collapseAll = () => setOpenIds(new Set())

  return (
    <section id="beneficios" className="mb-6 scroll-mt-14">
      <div ref={titleRef} className="mb-4 opacity-0">
        <h2 className="text-base font-semibold text-white">{SPONSOR_VALUE.title}</h2>
        <p className="text-white/55 text-sm mt-1.5 mb-3 leading-relaxed">{SPONSOR_VALUE.intro}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/12 text-[#db8918] transition-colors hover:bg-[#db8918]/10"
          >
            Ver todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/12 text-white/45 transition-colors hover:bg-white/5"
          >
            Resumir
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {SPONSOR_VALUE.lines.map((line, i) => (
          <ValueRow
            key={line.id}
            line={line}
            open={openIds.has(line.id)}
            onToggle={() => toggle(line.id)}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
