import { fetchNoticias, fetchLanzamientos } from '@/lib/api'
import { NoticiasContent } from '@/components/news/NoticiasContent'
import type { Metadata } from 'next'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Noticias — Radio Bienvenida 93.3 FM',
  description: 'Las últimas noticias de Radio Bienvenida, música y entretenimiento desde Rancagua.',
}

export default async function NoticiasPage() {
  const [articles, releases] = await Promise.all([
    fetchNoticias(),
    fetchLanzamientos(),
  ])

  return (
    <main className="min-h-screen px-4 py-6 max-w-md md:max-w-3xl mx-auto flex flex-col gap-5">
      <header>
        <h1 className="font-display text-3xl text-white leading-none">Noticias</h1>
        <p className="text-[var(--color-ink-400)] text-xs mt-1">Lo último de Bienvenida, música y lanzamientos</p>
      </header>

      <NoticiasContent articles={articles} releases={releases} />
    </main>
  )
}
