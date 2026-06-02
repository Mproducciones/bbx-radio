'use client'

import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

export function SponsorLiveSection() {
  return (
    <section className="mb-8 md:mb-10 rounded-2xl p-4 md:p-6" style={{ background: '#0e0e16', border: '1px solid rgba(64,185,191,0.2)' }}>
      <p className="text-[#40B9BF] text-[10px] font-bold uppercase tracking-[0.15em] mb-1">Prueba en vivo</p>
      <h2 className="font-display text-lg md:text-xl text-white mb-2">¿Qué ya funciona en la app?</h2>
      <p className="text-white/45 text-xs mb-4 leading-relaxed">
        Esto no es solo maqueta de ventas: podés abrir cada función y probarla ahora. Los spots FM se activan con cabina cuando cierras campaña.
      </p>
      <ul className="space-y-2">
        {SPONSOR_LIVE.map(item => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl active:bg-white/[0.03] min-h-[52px]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(0,217,160,0.15)', color: '#00D9A0' }}>
                  {item.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/40 text-[10px]">{item.note}</p>
                </div>
                <span className="text-white/30 text-xs shrink-0">→</span>
              </Link>
            ) : (
              <div
                className="flex items-center gap-3 p-3 rounded-xl min-h-[52px] opacity-80"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(219,137,24,0.15)', color: '#db8918' }}>
                  {item.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/40 text-[10px]">{item.note}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
