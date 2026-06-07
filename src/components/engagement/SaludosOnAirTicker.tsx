'use client'

import { SALUDOS_TICKER } from '@/lib/saludosCopy'

export function SaludosOnAirTicker() {
  const line = SALUDOS_TICKER.join('  ·  ')

  return (
    <div className="saludos-ticker shrink-0 w-full min-w-0 overflow-hidden" aria-hidden>
      <div className="saludos-ticker__live">
        <span className="saludos-ticker__dot" />
        ON AIR
      </div>
      <div className="saludos-ticker__track">
        <span className="saludos-ticker__text">{line}</span>
        <span className="saludos-ticker__text" aria-hidden>
          {line}
        </span>
      </div>
    </div>
  )
}
