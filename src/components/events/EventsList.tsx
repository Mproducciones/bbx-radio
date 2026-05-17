interface Event {
  _id: string
  title: string
  date?: string
  description?: string
}

export function EventsList({ events }: { events: Event[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center text-[var(--color-ink-400)] text-sm py-10">
        No hay eventos por el momento
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <div key={event._id} className="pulso-card">
          <h2 className="text-white font-semibold text-base">{event.title}</h2>
          {event.date && (
            <p className="text-[var(--color-ink-400)] text-xs mt-1">{event.date}</p>
          )}
          {event.description && (
            <p className="text-[var(--color-ink-300)] text-sm mt-2">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}