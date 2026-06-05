'use client'

import { ChevronDown, ListChecks } from 'lucide-react'

type PlanIncludesDisclosureProps = {
  items: string[]
  accent: string
  showList: boolean
  onToggle: () => void
}

export function PlanIncludesDisclosure({ items, accent, showList, onToggle }: PlanIncludesDisclosureProps) {
  return (
    <div className="plan-includes">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={showList}
        className="plan-includes__toggle"
        style={{
          background: `color-mix(in srgb, ${accent} 10%, rgba(255,255,255,0.04))`,
          border: `1px solid color-mix(in srgb, ${accent} 28%, rgba(255,255,255,0.08))`,
        }}
      >
        <div
          className="plan-includes__icon"
          style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
        >
          <ListChecks className="w-4 h-4" strokeWidth={2.25} aria-hidden />
        </div>
        <div className="plan-includes__toggle-copy">
          <p className="plan-includes__toggle-eyebrow">Qué incluye</p>
          <p className="plan-includes__toggle-label">
            {showList ? 'Ocultar lista' : `${items.length} beneficios · ver detalle`}
          </p>
        </div>
        <ChevronDown
          className={`plan-includes__chevron ${showList ? 'is-open' : ''}`}
          style={{ color: accent }}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>

      {showList && (
        <ul className="plan-includes__list">
          {items.map(item => (
            <li key={item} className="plan-includes__item">
              <span
                className="plan-includes__check"
                style={{ background: `color-mix(in srgb, ${accent} 20%, transparent)`, color: accent }}
              >
                ✓
              </span>
              <span className="plan-includes__text">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
