interface Episode {
  _id: string
  title: string
  date?: string
  duration?: string
  description?: string
}

export function ReplayList({ episodes }: { episodes: Episode[] }) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center text-[var(--color-ink-400)] text-sm py-10">
        No hay programas disponibles por el momento
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {episodes.map((ep) => (
        <div key={ep._id} className="pulso-card">
          <h2 className="text-white font-semibold text-base">{ep.title}</h2>
          {ep.date && (
            <p className="text-[var(--color-ink-400)] text-xs mt-1">{ep.date}</p>
          )}
          {ep.duration && (
            <p className="text-[var(--color-cyn-400)] text-xs mt-1">Duración: {ep.duration}</p>
          )}
          {ep.description && (
            <p className="text-[var(--color-ink-300)] text-sm mt-2">{ep.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}