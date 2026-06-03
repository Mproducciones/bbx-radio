'use client'

import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

export function SponsorLiveSection() {
  return (
    <section className="mb-4 border-t border-white/8 pt-4">
      <h2 className="text-sm font-semibold text-white">Prueba en vivo</h2>
      <p className="text-white/45 text-[11px] mt-0.5 mb-2 leading-relaxed">
        Abrí cada función en la app. FM se activa al cerrar campaña.
      </p>
      <ul className="divide-y divide-white/6 border-y border-white/6">
        {SPONSOR_LIVE.map(item => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-2 py-2 text-xs active:bg-white/[0.02]"
              >
                <span className="text-[9px] font-medium uppercase shrink-0 text-[#00D9A0]">{item.status}</span>
                <span className="flex-1 min-w-0 text-white/85">{item.label}</span>
                <span className="text-white/30 shrink-0">→</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 py-2 text-xs opacity-80">
                <span className="text-[9px] font-medium uppercase shrink-0 text-[#db8918]">{item.status}</span>
                <span className="flex-1 min-w-0 text-white/85">{item.label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
