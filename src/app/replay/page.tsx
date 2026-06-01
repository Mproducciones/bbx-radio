import { ReplayList } from '@/components/replay/ReplayList'
import { fetchReplay } from '@/lib/api'

export const revalidate = 1800

export default async function ReplayPage() {
  const episodes = await fetchReplay()

  return (
    <main className="min-h-screen px-4 py-6 max-w-md md:max-w-3xl mx-auto flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl text-white leading-none">Replay</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-1">
          Escucha los programas que te perdiste · Bienvenida 93.3 FM
        </p>
      </header>

      <ReplayList episodes={episodes} />
    </main>
  )
}
