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
  {
    _id: 'demo-ep1',
    title: 'Matinal Bienvenida — Especial de verano',
    program: 'Matinal Bienvenida',
    host: 'Por confirmar',
    date: '2025-01-13',
    duration: '2h 45min',
    description: 'El arranque del día con los mejores temas, entrevistas y las noticias más importantes de la región.',
  },
  {
    _id: 'demo-ep2',
    title: 'Mix del Día — Top 40 de la semana',
    program: 'Mix del Día',
    date: '2025-01-14',
    duration: '1h 30min',
    description: 'Los 40 temas más escuchados de la semana en un solo bloque sin interrupciones.',
  },
  {
    _id: 'demo-ep3',
    title: 'Tarde en Rancagua — Entrevista especial',
    program: 'Tarde en Rancagua',
    date: '2025-01-15',
    duration: '55min',
    description: 'Entrevista exclusiva y los mejores temas de la tarde.',
  },
  {
    _id: 'demo-ep4',
    title: 'Noche FM — Los clásicos de los 90 y 2000',
    program: 'Noche FM',
    date: '2025-01-16',
    duration: '2h 10min',
    description: 'Un viaje en el tiempo con los mejores temas que marcaron una generación.',
  },
  {
    _id: 'demo-ep5',
    title: 'Sábado Mix — Fiesta de verano',
    program: 'Sábado Mix',
    date: '2025-01-18',
    duration: '3h 00min',
    description: 'El mejor ritmo para tu sábado. Cumbia, pop y reggaeton para animar el fin de semana.',
  },
]

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  } catch {
    return dateStr
  }
}

export function ReplayList({ episodes }: { episodes: Episode[] }) {
  const display = episodes && episodes.length > 0 ? episodes : DEMO_EPISODES

  return (
    <div className="flex flex-col gap-4">
      {display.map((ep) => (
        <div key={ep._id} className="pulso-card flex flex-col gap-3">
          <div className="flex gap-4 items-start">
            {/* Ícono play */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-mag-400)]/15 flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-[var(--color-mag-400)] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              {ep.program && (
                <p className="text-[var(--color-mag-400)] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  {ep.program}{ep.host ? ` · ${ep.host}` : ''}
                </p>
              )}
              <h2 className="text-white font-semibold text-sm leading-snug">{ep.title}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {ep.date && (
                  <p className="text-[var(--color-ink-400)] text-xs">{formatDate(ep.date)}</p>
                )}
                {ep.duration && (
                  <span className="text-[var(--color-cyn-400)] text-xs font-medium">▸ {ep.duration}</span>
                )}
              </div>
              {ep.description && (
                <p className="text-[var(--color-ink-300)] text-xs mt-1.5 leading-relaxed line-clamp-2">
                  {ep.description}
                </p>
              )}
            </div>
          </div>

          {/* Links externos */}
          {(ep.youtubeUrl || ep.soundcloudUrl || ep.spotifyUrl) && (
            <div className="flex gap-2 flex-wrap pt-1 border-t border-[var(--color-ink-700)]">
              {ep.youtubeUrl && (
                <a
                  href={ep.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FF0000]/10 text-[#FF0000] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#FF0000]/20 transition-colors"
                  style={{ color: '#FF0000' }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              )}
              {ep.soundcloudUrl && (
                <a
                  href={ep.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FF5500]/10 text-[#FF5500] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#FF5500]/20 transition-colors"
                  style={{ color: '#FF5500' }}
                >
                  SoundCloud
                </a>
              )}
              {ep.spotifyUrl && (
                <a
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#1DB954]/10 text-[#1DB954] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1DB954]/20 transition-colors"
                  style={{ color: '#1DB954' }}
                >
                  Spotify
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
