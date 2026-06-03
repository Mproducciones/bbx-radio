'use client'

import Link from 'next/link'
import { SPONSOR_LIVE } from '@/lib/sponsorContent'

export function SponsorLiveSection() {
  return (
    <section id="probar" className="mb-6 border-t border-white/8 pt-5 scroll-mt-14">
      <div data-animate="fade" className="mb-3">
        <h2 className="text-base font-semibold text-white">Prueba en vivo</h2>
        <p className="text-white/55 text-sm mt-1 leading-relaxed">
          Abrí cada función en la app. Los spots FM se activan al cerrar la campaña.
        </p>
      </div>
      <ul className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/8">
        {SPONSOR_LIVE.map(item => (
          <li key={item.label} data-animate="tile">
            {item.href ? (
              <Link
                href={item.href}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-3.5 py-3.5 text-sm active:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md bg-[#00D9A0]/15 text-[#00D9A0]">
                    {item.status}
                  </span>
                  <span className="font-medium text-white/90">{item.label}</span>
                </div>
                <span className="text-xs text-white/45 sm:flex-1 sm:text-right">{item.note}</span>
                <span className="hidden sm:inline text-white/30 shrink-0">→</span>
              </Link>
            ) : (
              <div className="px-3.5 py-3.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#db8918]/15 text-[#db8918]">
                    {item.status}
                  </span>
                  <span className="font-medium text-white/85">{item.label}</span>
                </div>
                <p className="text-xs text-white/45 mt-1">{item.note}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
