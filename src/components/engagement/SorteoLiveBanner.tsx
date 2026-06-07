'use client'

import { motion } from 'framer-motion'

const FLOATIES = ['🎁', '✨', '🎉', '⭐', '💜']

export type SorteoBannerData = {
  title: string
  prize: string
  sponsorName?: string | null
  deadline?: string | null
  imageUrl?: string | null
}

export function SorteoLiveBanner({
  title,
  prize,
  sponsorName,
  deadline,
  imageUrl,
}: SorteoBannerData) {
  return (
    <div className="sorteo-live-banner shrink-0 w-full min-w-0 max-w-full">
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
            <div className="sorteo-live-banner__rays" />
            {FLOATIES.map((emoji, i) => (
              <motion.span
                key={emoji}
                className="sorteo-live-banner__floatie"
                style={{ left: `${6 + i * 18}%`, top: `${10 + (i % 3) * 24}%` }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.2, 0.55, 0.2],
                  rotate: [-8, 8, -8],
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
          <span className="sorteo-live-banner__live">
            <span className="sorteo-live-banner__live-dot" aria-hidden />
            Sorteo en vivo
          </span>
          <p className="sorteo-live-banner__prize">{prize}</p>
          <h3 className="sorteo-live-banner__title">{title}</h3>
        </div>

        <div className="sorteo-live-banner__shine" aria-hidden />
      </div>

      {(sponsorName || deadline) && (
        <div className="sorteo-live-banner__meta">
          {sponsorName && <span className="sorteo-live-banner__sponsor">Auspicia · {sponsorName}</span>}
          {deadline && (
            <span className="sorteo-live-banner__deadline">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 shrink-0" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              Cierra · {deadline}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
