'use client'

import Link from 'next/link'
import { Megaphone } from 'lucide-react'
import { RADIO } from '@/lib/radioConfig'
import { RADIO_PUBLIC_FACTS } from '@/lib/radioPublicFacts'
import { FEATURES } from '@/lib/plan'

/** Aviso visible para oyentes: pueden promocionar su negocio en la radio y la app. */
export function AnunciateDiscoverBanner({ className }: { className?: string }) {
  if (!FEATURES.publicidad) return null

  return (
    <Link
      href="/anunciate"
      className={`anunciate-discover flex items-center gap-3 rounded-xl px-3 py-2.5 shrink-0 transition-colors active:scale-[0.99] ${className ?? ''}`}
    >
      <span className="anunciate-discover__icon shrink-0" aria-hidden>
        <Megaphone className="w-4 h-4" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="anunciate-discover__title block text-[11px] font-bold text-white leading-tight">
          ¿Tienes un negocio en {RADIO.city}?
        </span>
        <span className="anunciate-discover__sub block text-[10px] text-white/45 mt-0.5 leading-snug">
          {RADIO_PUBLIC_FACTS.comunasRegion} comunas · FM + app · ver planes
        </span>
      </span>
      <span className="anunciate-discover__cta shrink-0 text-[10px] font-bold uppercase tracking-wide">
        Ver
      </span>
    </Link>
  )
}
