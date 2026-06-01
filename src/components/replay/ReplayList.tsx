'use client'

import { motion } from 'framer-motion'

interface Episode {
  _id: string
  title: string
  program?: string
  host?: string
  date?: string
  duration?: string
  description?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  spotifyUrl?: string
}

const DEMO_EPISODES: Episode[] = [
  { _id: 'ep1', title: 'Matinal Bienvenida — Especial de verano',  program: 'Matinal Bienvenida', host: 'Equipo Matinal', date: '2025-01-13', duration: '2h 45min', description: 'El arranque del día con los mejores temas, entrevistas y noticias de la región.' },
  { _id: 'ep2', title: 'Mix del Día — Top 40 de la semana',        program: 'Mix del Día',         date: '2025-01-14', duration: '1h 30min', description: 'Los 40 temas más escuchados de la semana en un solo bloque sin interrupciones.' },
  { _id: 'ep3', title: 'Tarde en Rancagua — Entrevista especial',  program: 'Tarde en Rancagua',   date: '2025-01-15', duration: '55min',    description: 'Entrevista exclusiva y los mejores temas de la tarde.' },
  { _id: 'ep4', title: 'Noche FM — Los clásicos de los 90 y 2000', program: 'Noche FM',            date: '2025-01-16', duration: '2h 10min', description: 'Un viaje en el tiempo con los temas que marcaron una generación.' },
  { _id: 'ep5', title: 'Sábado Mix — Fiesta de verano',            program: 'Sábado Mix',          date: '2025-01-18', duration: '3h 00min', description: 'El mejor ritmo para tu sábado. Cumbia, pop y reggaeton para el fin de semana.' },
]

const PROGRAM_COLORS: Record<string, string> = {
  'Matinal Bienvenida': '#FF8C42',
  'Mix del Día':        '#db8918',
  'Tarde en Rancagua':  '#40B9BF',
  'Noche FM':           '#7D59B5',
  'Sábado Mix':         '#00D9A0',
}

function formatDate(s: string) {
  try { return new Date(s).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }) } catch { return s }
}

// Waveform visual estático — 28 barras con altura aleatoria pero seed por programa
function Waveform({ seed, color }: { seed: string; color: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => {
    const n = (seed.charCodeAt(i % seed.length) + i * 7) % 100
    return 20 + n * 0.6
  })
  return (
    <div className="flex items-center gap-0.5 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="rounded-full flex-shrink-0 opacity-60"
          style={{ width: 2, height: `${h}%`, background: color }}
        />
      ))}
    </div>
  )
}

export function ReplayList({ episodes }: { episodes: Episode[] }) {
  const display = episodes?.length > 0 ? episodes : DEMO_EPISODES

  return (
    <div className="flex flex-col gap-3">
      {display.map((ep, i) => {
        const color = PROGRAM_COLORS[ep.program ?? ''] ?? '#db8918'
        return (
          <motion.div
            key={ep._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(15,15,26,0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${color}20`,
            }}
          >
            {/* Accent top */}
            <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

            <div className="p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start gap-3">
                {/* Play icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill={color}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  {ep.program && (
                    <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color }}>
                      {ep.program}{ep.host ? ` · ${ep.host}` : ''}
                    </p>
                  )}
                  <h2 className="text-white font-semibold text-sm leading-snug">{ep.title}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {ep.date && <p className="text-white/30 text-[10px]">{formatDate(ep.date)}</p>}
                    {ep.duration && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color, background: `${color}15` }}>
                        {ep.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Waveform visual */}
              <Waveform seed={ep._id} color={color} />

              {ep.description && (
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{ep.description}</p>
              )}

              {/* Links */}
              {(ep.youtubeUrl || ep.soundcloudUrl || ep.spotifyUrl) && (
                <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                  {ep.youtubeUrl && (
                    <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                      style={{ background: 'rgba(255,0,0,0.12)', color: '#FF4444' }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.53 3.55 12 3.55 12 3.55s-7.53 0-9.38.5a3.02 3.02 0 00-2.12 2.14C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 002.12 2.14C4.47 20.45 12 20.45 12 20.45s7.53 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
                      YouTube
                    </a>
                  )}
                  {ep.soundcloudUrl && (
                    <a href={ep.soundcloudUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-colors"
                      style={{ background: 'rgba(255,85,0,0.12)', color: '#FF5500' }}>SoundCloud</a>
                  )}
                  {ep.spotifyUrl && (
                    <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-colors"
                      style={{ background: 'rgba(29,185,84,0.12)', color: '#1DB954' }}>Spotify</a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
