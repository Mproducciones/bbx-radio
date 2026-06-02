import type { Metadata } from 'next'
import { SongPoll } from '@/components/engagement/SongPoll'
import { SongRequestForm } from '@/components/solicitudes/SongRequestForm'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SectionHeader } from '@/components/layout/SectionHeader'

export const metadata: Metadata = {
  title: 'Participá — Radio Bienvenida 93.3 FM',
  description: 'Votá tu canción favorita y pedí temas al locutor en vivo.',
}

export default function ParticipaPage() {
  return (
    <main className="min-h-screen px-4 pt-6 pb-24 max-w-md md:max-w-2xl mx-auto relative z-[1]">
      <SectionHeader
        kicker="Tu voz en la radio"
        title="Participá"
        subtitle="Votá y pedí canciones para que suenen al aire"
      />

      <div className="flex flex-col gap-5">
        <RotatingBanner position="top" />
        <SongPoll />
        <SongRequestForm />
        <RotatingBanner position="middle" />
      </div>
    </main>
  )
}
