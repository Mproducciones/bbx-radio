'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { RADIO_AD } from '@/lib/radioAdBranding'

export type AdBannerData = {
  nombre: string
  cliente?: string
  tagline?: string
  cta?: string
  colorAccent?: string
  imagenUrl?: string
}

type AdBannerVisualProps = {
  ad: AdBannerData
  className?: string
  imgClassName?: string
  minHeight?: number
  maxHeight?: number
  /** Borde y estilo plan Premium / Empresarial en En Vivo. */
  highlighted?: boolean
}

function FallbackBanner({
  ad,
  className,
  slotHeight,
  highlighted = false,
}: {
  ad: AdBannerData
  className?: string
  slotHeight: number
  highlighted?: boolean
}) {
  const accent = ad.colorAccent ?? '#db8918'
  const title = ad.cliente ?? ad.nombre

  return (
    <div
      className={cn(
        'ad-banner-slot relative w-full min-w-0 max-w-full overflow-hidden rounded-xl flex items-center px-3 max-md:px-2.5 gap-2 max-md:gap-1.5',
        className,
      )}
      style={{
        height: slotHeight,
        minHeight: slotHeight,
        maxHeight: slotHeight,
        background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 22%, #07070e) 0%, #0f0f1a 55%, color-mix(in srgb, ${accent} 12%, #07070e) 100%)`,
        border: highlighted
          ? `1.5px solid color-mix(in srgb, ${accent} 55%, transparent)`
          : `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
        boxShadow: highlighted ? `0 6px 20px -8px color-mix(in srgb, ${accent} 35%, transparent)` : undefined,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <div
        className="w-9 h-9 max-md:w-8 max-md:h-8 rounded-lg shrink-0 flex items-center justify-center font-display text-base font-bold"
        style={{ background: `${accent}25`, color: accent }}
      >
        {title.charAt(0)}
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="text-white font-bold text-sm max-md:text-xs truncate">{title}</p>
        {ad.tagline && <p className="text-white/55 text-xs max-md:text-[10px] truncate mt-0.5">{ad.tagline}</p>}
      </div>
      {ad.cta && (
        <span
          className="text-[10px] max-md:text-[9px] font-bold px-2 max-md:px-1.5 py-1 max-md:py-0.5 rounded-lg shrink-0"
          style={{ background: accent, color: '#07070e' }}
        >
          {ad.cta}
        </span>
      )}
      <p className="absolute bottom-1 left-2.5 right-2.5 max-md:bottom-0.5 text-[7px] text-white/35 truncate pointer-events-none">
        {RADIO_AD.stamp} · {RADIO_AD.adLabel}
      </p>
    </div>
  )
}

export function AdBannerVisual({
  ad,
  className,
  imgClassName,
  minHeight = 80,
  maxHeight = 180,
  highlighted = false,
}: AdBannerVisualProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const accent = ad.colorAccent ?? '#db8918'
  const slotHeight = compactHeight(minHeight, maxHeight)

  if (!ad.imagenUrl || imgFailed) {
    return (
      <FallbackBanner
        ad={ad}
        className={className}
        slotHeight={slotHeight}
        highlighted={highlighted}
      />
    )
  }

  return (
    <div
      className={cn('ad-banner-slot relative w-full min-w-0 max-w-full overflow-hidden rounded-xl', className)}
      style={{
        height: slotHeight,
        minHeight: slotHeight,
        maxHeight: slotHeight,
        border: highlighted ? `1.5px solid color-mix(in srgb, ${accent} 55%, transparent)` : undefined,
      }}
    >
      <img
        src={ad.imagenUrl}
        alt={ad.nombre}
        className={cn('absolute inset-0 w-full h-full object-cover block', imgClassName)}
        loading="eager"
        decoding="async"
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}

/** Altura única del slot — evita saltos al rotar banners (Android). */
function compactHeight(minHeight: number, maxHeight: number) {
  return maxHeight <= 88 || minHeight === maxHeight ? maxHeight : minHeight
}
