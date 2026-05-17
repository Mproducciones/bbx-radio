interface Episode {
  _id: string
  title: string
  date?: string
  duration?: string
  description?: string
}

const DEMO_EPISODES: Episode[] = [
  {
    _id: 'demo-ep1',
    title: 'Matinal Bienvenida — Edición especial de verano',
    date: 'Lunes 13 de enero · 06:00',
    duration: '2h 45min',
    description: 'El arranque del día con los mejores temas, entrevistas y las noticias más importantes de la región.',
  },
  {
    _id: 'demo-ep2',
    title: 'Mix del Día — Top 40 de la semana',
    date: 'Martes 14 de enero · 10:00',
    duration: '1h 30min',
    description: 'Los 40 temas más escuchados de la semana en un solo bloque sin interrupciones.',
  },
  {
    _id: 'demo-ep3',
    title: 'Tarde en Rancagua — Invitado: Alcalde de la ciudad',
    date: 'Miércoles 15 de enero · 15:00',
    duration: '55min',
    description: 'Entrevista exclusiva sobre los proyectos de infraestructura para este año y las novedades del municipio.',
  },
  {
    _id: 'demo-ep4',
    title: 'Noche FM — Los clásicos de los 90 y 2000',
    date: 'Jueves 16 de enero · 21:00',
    duration: '2h 10min',
    description: 'Un viaje en el tiempo con los mejores temas que marcaron una generación. Solicitudes del público en vivo.',
  },
  {
    _id: 'demo-ep5',
    title: 'Sábado Mix — Fiesta de verano',
    date: 'Sábado 18 de enero · 12:00',
    duration: '3h 00min',
    description: 'El mejor ritmo para tu sábado. Cumbia, pop y reggaeton para animar el fin de semana.',
  },
]

export function ReplayList({ episodes }: { episodes: Episode[] }) {
  const display = episodes && episodes.length > 0 ? episodes : DEMO_EPISODES

  return (
    <div className="flex flex-col gap-4">
      {display.map((ep) => (
        <div key={ep._id} className="pulso-card flex gap-4 items-start">
          {/* Play button */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-mag-400)]/15 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-[var(--color-mag-400)] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm leading-snug">{ep.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              {ep.date && (
                <p className="text-[var(--color-ink-400)] text-xs">{ep.date}</p>
              )}
              {ep.duration && (
                <span className="text-[var(--color-cyn-400)] text-xs font-medium">▸ {ep.duration}</span>
              )}
            </div>
            {ep.description && (
              <p className="text-[var(--color-ink-300)] text-xs mt-1.5 leading-relaxed line-clamp-2">{ep.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}