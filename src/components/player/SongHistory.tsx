'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNowPlaying, type Track } from '@/hooks/useNowPlaying'

const COLORS = ['#FF006E', '#00D4FF', '#7B2FFF', '#FFB300', '#00D9A0', '#FF6B35']

function spotifySearch(title: string, artist: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

export function SongHistory() {
  const { current, history } = useNowPlaying()
  const [expanded, setExpanded] = useState(false)

  const all: Track[] = [
    ...(current && current.title !== 'En Vivo' ? [current] : []),
    ...history,
  ]

  const visible = expanded ? all : all.slice(0, 5)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A16', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9A0] animate-pulse" />
          <p className="text-white text-sm font-semibold">Qué sonó hoy</p>
        </div>
        <span className="text-[#444468] text-xs">
          {all.length > 0 ? `${all.length} canciones` : 'Cargando…'}
        </span>
      </div>

      {/* Canción actual destacada */}
      {current && current.title !== 'En Vivo' && (
        <motion.a
          href={spotifySearch(current.title, current.artist)}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-4 py-3 group"
          style={{ background: 'rgba(255,0,110,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(255,0,110,0.2)', color: '#FF006E', border: '1px solid rgba(255,0,110,0.3)' }}>
            ♪
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{current.title}</p>
            <p className="text-[#666690] text-xs truncate">{current.artist}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ color: '#FF006E', background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.2)' }}>
            Ahora
          </span>
        </motion.a>
      )}

      {/* Historial */}
      {visible.length === 0 ? (
        <div className="px-4 py-8 text-center text-[#444468] text-xs">
          El historial se irá llenando mientras suena la radio
        </div>
      ) : (
        <div className="divide-y divide-white/[0.03]">
          <AnimatePresence initial={false}>
            {visible.slice(current && current.title !== 'En Vivo' ? 1 : 0).map((track, i) => {
              const accent = COLORS[(i + 1) % COLORS.length]
              return (
                <motion.a
                  key={track.playedAt}
                  href={spotifySearch(track.title, track.artist)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}>
                    {i + 2}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{track.title}</p>
                    <p className="text-[#666690] text-xs truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[#444468] text-xs tabular-nums">{formatTime(track.playedAt)}</span>
                    <div className="w-6 h-6 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                      style={{ background: '#1DB954' }}>
                      <SpotifyIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {all.length > 5 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full py-3 text-xs font-medium transition-colors text-[#666690] hover:text-white"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          {expanded ? 'Ver menos ↑' : `Ver ${all.length - 5} más ↓`}
        </button>
      )}
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
