'use client'

import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

export function SponsorLiveSection() {
  return (
    <section className="mb-6 border-t border-white/8 pt-5">
      <h2 className="text-base font-semibold text-white">Prueba en vivo</h2>
      <p className="text-white/55 text-sm mt-1.5 mb-3 leading-relaxed">
        Abrí cada función en la app. La FM se activa al cerrar la campaña.
      </p>
      <ul className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/8">
        {SPONSOR_LIVE.map(item => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-3.5 text-sm active:bg-white/[0.04]"
              >
                <span className="text-[10px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md bg-[#00D9A0]/15 text-[#00D9A0]">
                  {item.status}
                </span>
                <span className="flex-1 min-w-0 text-white/90 font-medium">{item.label}</span>
                <span className="text-white/35 shrink-0">→</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-3.5 py-3.5 text-sm">
                <span className="text-[10px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md bg-[#db8918]/15 text-[#db8918]">
                  {item.status}
                </span>
                <span className="flex-1 min-w-0 text-white/75">{item.label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
