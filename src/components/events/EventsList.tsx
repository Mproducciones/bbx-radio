interface Event {
  _id: string
  title: string
  date?: string
  description?: string
}

const DEMO_EVENTS: Event[] = [
  {
    _id: 'demo-e1',
    title: 'Festival de Verano 2025',
    date: '15 de enero · 20:00 hrs · Parque Municipal',
    description: 'La gran fiesta de verano con los mejores artistas de la región. Entrada liberada para toda la familia.',
  },
  {
    _id: 'demo-e2',
    title: 'Noche de Cumbia en Vivo',
    date: '22 de enero · 21:30 hrs · Teatro Municipal',
    description: 'Una noche imperdible con las orquestas más reconocidas del género. Venta de entradas en boletería.',
  },
  {
    _id: 'demo-e3',
    title: 'Feria de Emprendedores Locales',
    date: '28 de enero · 10:00 a 20:00 hrs · Plaza de Armas',
    description: 'Apoya a los emprendedores de nuestra ciudad. Gastronomía, artesanía y música en vivo todo el día.',
  },
  {
    _id: 'demo-e4',
    title: 'Concierto Sinfónico al Aire Libre',
    date: '5 de febrero · 19:00 hrs · Anfiteatro',
    description: 'La orquesta sinfónica regional trae un programa especial para el verano. Entrada gratuita.',
  },
]

export function EventsList({ events }: { events: Event[] }) {
  const display = events && events.length > 0 ? events : DEMO_EVENTS

  return (
    <div className="flex flex-col gap-4">
      {display.map((event) => (
        <div key={event._id} className="pulso-card">
          <h2 className="text-white font-semibold text-base">{event.title}</h2>
          {event.date && (
            <p className="text-[var(--color-mag-400)] text-xs mt-1 font-medium">{event.date}</p>
          )}
          {event.description && (
            <p className="text-[var(--color-ink-300)] text-sm mt-2 leading-relaxed">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}