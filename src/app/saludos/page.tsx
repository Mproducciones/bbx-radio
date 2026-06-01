import type { Metadata } from 'next'
import { SaludoForm } from '@/components/engagement/SaludoForm'

export const metadata: Metadata = {
  title: 'Saludos al Aire — Radio Bienvenida 93.3 FM',
  description: 'Mandá un saludo al aire. El locutor lo lee en vivo para quien vos quieras.',
}

export default function SaludosPage() {
  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto flex flex-col gap-5">
      <header>
        <h1 className="font-display text-3xl text-white leading-none">Saludos al Aire</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-1">
          El locutor lo lee en vivo — para quien vos quieras
        </p>
      </header>

      <SaludoForm />
    </main>
  )
}
