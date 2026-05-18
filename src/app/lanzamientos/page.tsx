import { fetchLanzamientos } from '@/lib/api'
import { LanzamientosContent } from '@/components/releases/LanzamientosContent'
import type { Metadata } from 'next'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Lanzamientos — Radio Bienvenida 93.3 FM',
  description: 'Los últimos lanzamientos musicales que suenan en Radio Bienvenida 93.3 FM.',
}

export default async function LanzamientosPage() {
  const items = await fetchLanzamientos()

  return (
    <main className="min-h-screen bg-[var(--color-ink-900)] px-4 py-6 max-w-md md:max-w-3xl mx-auto flex flex-col gap-5">
      <header>
        <h1 className="font-display text-3xl text-white leading-none">Lanzamientos</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-1">Los nuevos temas que suenan en Bienvenida 93.3 FM</p>
      </header>

      <LanzamientosContent items={items} />
    </main>
  )
}
