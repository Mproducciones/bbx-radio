'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Track {
  title: string
  artist: string
  minutesAgo: number
}

// Canciones típicas de radio regional chilena — mix cueca, cumbia, pop latino
const PLAYLIST: Track[] = [
  { title: 'Hawái',                  artist: 'Maluma',              minutesAgo: 4  },
  { title: 'Tusa',                   artist: 'KAROL G & Nicki Minaj', minutesAgo: 8  },
  { title: 'Bichota',                artist: 'KAROL G',             minutesAgo: 12 },
  { title: 'Con Calma',              artist: 'Daddy Yankee & Snow', minutesAgo: 16 },
  { title: 'Mi Gente',               artist: 'J Balvin',            minutesAgo: 20 },
  { title: 'Gasolina',               artist: 'Daddy Yankee',        minutesAgo: 25 },
  { title: 'La Bicicleta',           artist: 'Carlos Vives & Shakira', minutesAgo: 29 },
  { title: 'Despacito',              artist: 'Luis Fonsi ft. Daddy Yankee', minutesAgo: 33 },
  { title: 'Chantaje',               artist: 'Shakira ft. Maluma',  minutesAgo: 37 },
  { title: 'El Perdón',              artist: 'Nicky Jam & Enrique Iglesias', minutesAgo: 41 },
  { title: 'Danza Kuduro',           artist: 'Don Omar',            minutesAgo: 46 },
  { title: 'Reggaeton Lento',        artist: 'CNCO',                minutesAgo: 50 },
  { title: 'Me Rehúso',              artist: 'Danny Ocean',         minutesAgo: 54 },
  { title: 'Loco Contigo',           artist: 'DJ Snake, J. Balvin', minutesAgo: 58 },
  { title: 'Si Tu Novio Te Deja Sola', artist: 'J Balvin, Bad Bunny', minutesAgo: 63 },
]

function formatTime(minutesAgo: number): string {
  const now = new Date()
  const then = new Date(now.getTime() - minutesAgo * 60_000)
  return then.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function spotifySearch(title: string, artist: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`
}

const COLORS = ['#FF006E', '#00D4FF', '#7B2FFF', '#FFB300', '#00D9A0', '#FF6B35']

export function SongHistory() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? PLAYLIST : PLAYLIST.slice(0, 5)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A16', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse" />
          <p className="text-white text-sm font-semibold">Qué sonó hoy</p>
        </div>
        <span className="text-[#444468] text-xs">{PLAYLIST.length} canciones</span>
      </div>

      {/* Lista */}
      <div className="divide-y divide-white/[0.03]">
        <AnimatePresence initial={false}>
          {visible.map((track, i) => {
            const accent = COLORS[i % COLORS.length]
            return (
              <motion.a
                key={track.title}
                href={spotifySearch(track.title, track.artist)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
              >
                {/* Número / color dot */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all group-hover:scale-105"
                  style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
                >
                  {i === 0 ? '♪' : i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate leading-tight">{track.title}</p>
                  <p className="text-[#666690] text-xs truncate">{track.artist}</p>
                </div>

                {/* Tiempo + Spotify */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[#444468] text-xs tabular-nums">{formatTime(track.minutesAgo)}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#1DB954' }}>
                    <SpotifyIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Ver más */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full py-3 text-xs font-medium transition-colors text-[#666690] hover:text-white"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {expanded ? 'Ver menos ↑' : `Ver las ${PLAYLIST.length - 5} anteriores ↓`}
      </button>
    </div>
  )
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.858-6.832-2.271-11.322-1.241-.418.101-.851-.16-.952-.578-.101-.418.16-.851.578-.952 4.91-1.121 9.122-.641 12.533 1.441.39.241.49.721.24 1.09zm1.472-3.27c-.301.459-.919.601-1.38.301-3.459-2.131-8.73-2.75-12.82-1.509-.521.16-1.07-.131-1.23-.651-.16-.521.131-1.07.651-1.23 4.67-1.421 10.47-.719 14.44 1.721.46.3.6.92.3 1.38zm.127-3.41c-4.15-2.461-11.001-2.689-14.962-1.489-.631.19-1.299-.16-1.489-.791-.19-.631.16-1.299.791-1.489 4.551-1.381 12.109-1.111 16.891 1.72.571.341.762 1.069.42 1.64-.34.57-1.069.76-1.64.42z"/>
    </svg>
  )
}
