'use client'

import { motion } from 'framer-motion'

const FLOATIES = ['🎁', '✨', '🎉']

export type SorteoBannerData = {
  title: string
  prize: string
  sponsorName?: string | null
  deadline?: string | null
  imageUrl?: string | null
  /** Banner bajo — cabe con el formulario en móvil */
  compact?: boolean
}

function metaLine(sponsorName?: string | null, deadline?: string | null) {
  const parts: string[] = []
  if (sponsorName) parts.push(`Auspicia · ${sponsorName}`)
  if (deadline) parts.push(`Cierra · ${deadline}`)
  return parts.join(' · ')
}

export function SorteoLiveBanner({
  title,
  prize,
  sponsorName,
  deadline,
  imageUrl,
  compact = true,
}: SorteoBannerData) {
  const meta = metaLine(sponsorName, deadline)
  const showSubtitle =
    !compact
    && title.trim()
    && title.trim().toLowerCase() !== prize.trim().toLowerCase()
    && !title.toLowerCase().includes('sorteo en vivo')

  return (
    <div className={`sorteo-live-banner shrink-0 w-full min-w-0 max-w-full${compact ? ' sorteo-live-banner--compact' : ''}`}>
      <div className="sorteo-live-banner__visual relative overflow-hidden">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="sorteo-live-banner__img" />
            <div className="sorteo-live-banner__overlay sorteo-live-banner__overlay--photo" aria-hidden />
          </>
        ) : (
          <div className="sorteo-live-banner__fallback" aria-hidden>
            <div className="sorteo-live-banner__mesh" />
            {!compact && <div className="sorteo-live-banner__rays" />}
            {!compact && FLOATIES.map((emoji, i) => (
              <motion.span
                key={emoji}
                className="sorteo-live-banner__floatie"
                style={{ left: `${8 + i * 22}%`, top: `${14 + i * 18}%` }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
              >
                {emoji}
              </motion.span>
            ))}
            <span className="sorteo-live-banner__gift" aria-hidden>
              🎁
            </span>
          </div>
        )}

        <div className="sorteo-live-banner__content">
          <div className="sorteo-live-banner__head">
            <span className="sorteo-live-banner__live">
              <span className="sorteo-live-banner__live-dot" aria-hidden />
              Sorteo en vivo
            </span>
            <p className="sorteo-live-banner__prize">{prize}</p>
          </div>
          {showSubtitle && (
            <h3 className="sorteo-live-banner__title">{title}</h3>
          )}
          {meta && (
            <p className="sorteo-live-banner__meta-line">{meta}</p>
          )}
        </div>

        {!compact && <div className="sorteo-live-banner__shine" aria-hidden />}
      </div>
    </div>
  )
}
