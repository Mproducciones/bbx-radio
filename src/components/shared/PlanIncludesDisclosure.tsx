'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ListChecks } from 'lucide-react'

type PlanIncludesDisclosureProps = {
  items: string[]
  accent: string
  showList: boolean
  onToggle: () => void
}

export function PlanIncludesDisclosure({ items, accent, showList, onToggle }: PlanIncludesDisclosureProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={showList}
        className="mt-4 w-full flex items-center gap-3 rounded-xl px-3 py-3 min-h-[48px] text-left transition-[filter,transform] active:scale-[0.99]"
        style={{
          background: `color-mix(in srgb, ${accent} 10%, rgba(255,255,255,0.04))`,
          border: `1px solid color-mix(in srgb, ${accent} 28%, rgba(255,255,255,0.08))`,
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
        >
          <ListChecks className="w-4 h-4" strokeWidth={2.25} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Qué incluye</p>
          <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
            {showList ? 'Ocultar lista' : `${items.length} beneficios · ver detalle`}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${showList ? 'rotate-180' : ''}`}
          style={{ color: accent }}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {showList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pt-3 pb-1">
              {items.map(item => (
                <li key={item} className="flex gap-2.5 text-xs text-white/70 leading-relaxed">
                  <span
                    className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `color-mix(in srgb, ${accent} 20%, transparent)`, color: accent }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
