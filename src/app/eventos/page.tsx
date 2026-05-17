import { fetchEventos } from '@/lib/api'
import { EventsList } from '@/components/events/EventsList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos — Radio Bienvenida 93.3 FM',
  description: 'Conciertos, shows y eventos en Rancagua y la Sexta Región. Agenda de Radio Bienvenida.',
}

export default async function EventosPage() {
  const events = await fetchEventos()

  return (
    <main className="min-h-screen bg-[var(--color-ink-900)] px-4 py-6 max-w-md md:max-w-3xl mx-auto flex flex-col gap-5">
      <header>
        <h1 className="font-display text-3xl text-white leading-none">Eventos</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-1">Conciertos y shows en tu región</p>
      </header>

      <EventsList events={events} />
    </main>
  )
}
