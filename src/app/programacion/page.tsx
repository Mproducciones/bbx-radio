import type { Metadata } from 'next'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { getPrograms } from '@/lib/programs'
import { getTodayInTimezone } from '@/lib/programSchedule'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Programación — Radio Bienvenida 93.3 FM',
  description: 'Parrilla semanal de Radio Bienvenida. Consulta horarios y programa en vivo.',
}

export default async function ProgramacionPage() {
  const programs = await getPrograms()
  const initialDay = getTodayInTimezone('America/Santiago')

  return (
    <main className="min-h-screen px-4 pt-6 pb-24 max-w-md md:max-w-2xl mx-auto relative z-[1]">
      <SectionHeader
        kicker="Grilla semanal"
        title="Programación"
        subtitle="Horarios y espacios al aire · actualizado desde el panel"
      />

      <div className="flex flex-col gap-5">
        <RotatingBanner position="top" />
        <ProgramSchedule programs={programs} initialDay={initialDay} />
        <RotatingBanner position="bottom" />
      </div>
    </main>
  )
}
