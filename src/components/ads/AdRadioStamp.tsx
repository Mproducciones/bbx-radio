'use client'

import { RADIO_AD } from '@/lib/radioAdBranding'
import { cn } from '@/lib/utils'

type AdRadioStampProps = {
  className?: string
  compact?: boolean
}

/** Marca de emisora sobre banners (oyente sabe dónde ve la publicidad). */
export function AdRadioStamp({ className, compact }: AdRadioStampProps) {
  const label = compact ? RADIO_AD.frequency : RADIO_AD.stamp

  return (
    <div
      className={cn(
        'pointer-events-none absolute left-2 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-sm',
        compact ? 'bottom-1.5 px-1.5 py-0.5' : 'bottom-2 px-2 py-0.5',
        className,
      )}
    >
      <span
        className={cn('font-bold uppercase tracking-wide', compact ? 'text-[6px]' : 'text-[7px]')}
        style={{ color: '#db8918' }}
      >
        {RADIO_AD.adLabel}
      </span>
      <span className={cn('text-white/55 truncate max-w-[160px]', compact ? 'text-[6px]' : 'text-[7px]')}>
        {label}
      </span>
    </div>
  )
}
