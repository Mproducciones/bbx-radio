import type { Metadata } from 'next'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
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
    <AppMenuScreen>
      <div className="flex flex-col flex-1 min-h-0 max-md:gap-2 md:gap-5">
        <RotatingBanner position="top" compact className="shrink-0 max-md:mb-1" />
        <ProgramSchedule programs={programs} initialDay={initialDay} fill />
        <RotatingBanner position="bottom" compact className="shrink-0 max-md:mt-1" />
      </div>
    </AppMenuScreen>
  )
}
