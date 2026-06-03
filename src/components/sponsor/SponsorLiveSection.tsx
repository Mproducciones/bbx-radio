'use client'

import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

export function SponsorLiveSection() {
  return (
    <section
      className="mb-6 rounded-xl p-3.5 md:p-4"
      style={{ background: '#0e0e16', border: '1px solid rgba(64,185,191,0.18)' }}
    >
      <p className="text-[#40B9BF] text-[11px] font-semibold uppercase tracking-wide mb-0.5">Prueba en vivo</p>
      <h2 className="font-display text-base text-white mb-1">¿Qué ya funciona en la app?</h2>
      <p className="text-white/55 text-xs mb-3 leading-relaxed">
        Podés abrir cada función y probarla ahora. Los spots FM se activan con cabina al cerrar campaña.
      </p>
      <ul className="space-y-1.5">
        {SPONSOR_LIVE.map(item => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-2.5 p-2.5 rounded-lg active:bg-white/[0.03] min-h-[44px]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span
                  className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'rgba(0,217,160,0.12)', color: '#00D9A0' }}
                >
                  {item.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-white/50 text-[11px] leading-snug">{item.note}</p>
                </div>
                <span className="text-white/30 text-xs shrink-0">→</span>
              </Link>
            ) : (
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-lg min-h-[44px] opacity-85"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <span
                  className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'rgba(219,137,24,0.12)', color: '#db8918' }}
                >
                  {item.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-white/50 text-[11px] leading-snug">{item.note}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
