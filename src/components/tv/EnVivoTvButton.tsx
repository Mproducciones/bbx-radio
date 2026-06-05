'use client'

import { Tv } from 'lucide-react'
import { useRadioPlayerContext } from '@/hooks/RadioPlayerContext'

/** Acceso directo a Bienvenida TV desde En Vivo. */
export function EnVivoTvButton({ className }: { className?: string }) {
  const { openTv, isTvOpen } = useRadioPlayerContext()

  return (
    <button
      type="button"
      onClick={() => openTv()}
      aria-label="Ver Bienvenida TV en vivo"
      aria-pressed={isTvOpen}
      className={`envivo-tv-btn inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 shrink-0 active:scale-95 transition-transform ${className ?? ''}`}
    >
      <Tv className="w-3.5 h-3.5" strokeWidth={2.25} aria-hidden />
      <span className="text-[10px] font-bold uppercase tracking-wide">TV</span>
    </button>
  )
}
