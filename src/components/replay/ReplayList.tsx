'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import AudioPlayer from '@/components/ui/audio-player'
import { cn } from '@/lib/utils'
import { getProgramArt, resolveProgramCover } from '@/lib/programArt'

interface Episode {
  _id: string
  title: string
  program?: string
  host?: string
  date?: string
  duration?: string
  description?: string
  audioUrl?: string
  coverUrl?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  spotifyUrl?: string
}

const DEMO_EPISODES: Episode[] = [
  {
    _id: 'ep1',
    title: 'Matinal Bienvenida — Especial de verano',
    program: 'Matinal Bienvenida', host: 'Equipo Matinal',
    date: '2025-01-13', duration: '2h 45min',
    description: 'El arranque del día con los mejores temas, entrevistas y noticias de la región.',
    audioUrl: 'https://ui.webmakers.studio/audio/ncs.mp3',
  },
  {
    _id: 'ep2',
    title: 'Mix del Día — Top 40 de la semana',
    program: 'Mix del Día',
    date: '2025-01-14', duration: '1h 30min',
    description: 'Los 40 temas más escuchados de la semana en un solo bloque sin interrupciones.',
    audioUrl: 'https://ui.webmakers.studio/audio/ncs.mp3',
  },
  {
    _id: 'ep3',
    title: 'Tarde en Rancagua — Entrevista especial',
    program: 'Tarde en Rancagua',
    date: '2025-01-15', duration: '55min',
    description: 'Entrevista exclusiva y los mejores temas de la tarde.',
  },
  {
    _id: 'ep4',
    title: 'Noche FM — Los clásicos de los 90 y 2000',
    program: 'Noche FM',
    date: '2025-01-16', duration: '2h 10min',
    description: 'Un viaje en el tiempo con los temas que marcaron una generación.',
  },
  {
    _id: 'ep5',
    title: 'Sábado Mix — Fiesta de verano',
    program: 'Sábado Mix',
    date: '2025-01-18', duration: '3h 00min',
    description: 'El mejor ritmo para tu sábado. Cumbia, pop y reggaeton para el fin de semana.',
    audioUrl: 'https://ui.webmakers.studio/audio/ncs.mp3',
  },
]

function formatDateShort(s: string) {
  try {
    return new Date(s).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  } catch {
    return s
  }
}

function EpisodeCover({ ep, color }: { ep: Episode; color: string }) {
  const [failed, setFailed] = useState(false)
  const src = resolveProgramCover(ep.program, failed ? null : ep.coverUrl)
  const art = getProgramArt(ep.program)
  const label = art.shortLabel ?? (ep.program ?? ep.title).charAt(0).toUpperCase()

  if (!src || failed) {
    return (
      <div
        className="replay-card__cover replay-card__cover--fallback"
        style={{ background: `linear-gradient(145deg, ${color}88 0%, ${color}22 55%, rgba(7,7,14,0.9) 100%)` }}
        aria-hidden
      >
        <span className="replay-card__cover-label">{label}</span>
      </div>
    )
  }

  return (
    <div className="replay-card__cover" style={{ '--replay-accent': color } as React.CSSProperties}>
      <Image
        src={src}
        alt=""
        width={112}
        height={112}
        className="replay-card__cover-img"
        unoptimized
        onError={() => setFailed(true)}
      />
      <div className="replay-card__cover-shade" aria-hidden />
    </div>
  )
}

function ExternalLinks({ ep }: { ep: Episode }) {
  if (!ep.youtubeUrl && !ep.soundcloudUrl && !ep.spotifyUrl) return null
  return (
    <div className="replay-card__links">
      {ep.youtubeUrl && (
        <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="replay-card__link replay-card__link--yt">
          YouTube
        </a>
      )}
      {ep.soundcloudUrl && (
        <a href={ep.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="replay-card__link replay-card__link--sc">
          SoundCloud
        </a>
      )}
      {ep.spotifyUrl && (
        <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="replay-card__link replay-card__link--sp">
          Spotify
        </a>
      )}
    </div>
  )
}

export function ReplayList({ episodes }: { episodes: Episode[]; compact?: boolean }) {
  const display = episodes?.length > 0 ? episodes : DEMO_EPISODES
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="replay-list">
      <p className="replay-list__count">
        {display.length} {display.length === 1 ? 'programa' : 'programas'} archivados
      </p>

      {display.map((ep, i) => {
        const color = getProgramArt(ep.program).color
        const isActive = activeId === ep._id
        const hasAudio = Boolean(ep.audioUrl)
        const displayTitle = ep.title?.trim() || ep.program || 'Programa archivado'

        return (
          <motion.article
            key={ep._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.24) }}
            className={cn('replay-card', isActive && 'is-active')}
            style={{ '--replay-accent': color } as React.CSSProperties}
          >
            <button
              type="button"
              className="replay-card__row"
              onClick={() => setActiveId(isActive ? null : ep._id)}
              aria-expanded={isActive}
            >
              <EpisodeCover ep={ep} color={color} />

              <div className="replay-card__body min-w-0 flex-1">
                {ep.program && (
                  <span className="replay-card__program">{ep.program}</span>
                )}
                <h2 className="replay-card__title">{displayTitle}</h2>
                <div className="replay-card__meta-row">
                  {ep.date && (
                    <span className="replay-card__chip">{formatDateShort(ep.date)}</span>
                  )}
                  {ep.duration && (
                    <span className="replay-card__chip">{ep.duration}</span>
                  )}
                  {hasAudio && (
                    <span className="replay-card__chip replay-card__chip--audio">Audio</span>
                  )}
                </div>
              </div>

              <div className="replay-card__action shrink-0" aria-hidden>
                {isActive ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="replay-card__panel"
                >
                  {ep.description && (
                    <p className="replay-card__desc">{ep.description}</p>
                  )}

                  {ep.audioUrl ? (
                    <AudioPlayer
                      src={ep.audioUrl}
                      cover={resolveProgramCover(ep.program, ep.coverUrl)}
                      title={displayTitle}
                      artist={ep.program}
                    />
                  ) : (
                    <>
                      {!ep.description && (
                        <p className="replay-card__desc replay-card__desc--muted">
                          Audio no disponible todavía.
                        </p>
                      )}
                      <ExternalLinks ep={ep} />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )
      })}
    </div>
  )
}
