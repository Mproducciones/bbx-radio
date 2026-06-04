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
    <AppMenuScreen scroll className="programacion-route w-full min-w-0">
      <div className="flex flex-col gap-2 md:gap-5 max-md:pb-3 md:min-h-0 md:flex-1 md:flex md:flex-col">
        <RotatingBanner position="top" compact className="shrink-0" />
        <ProgramSchedule programs={programs} initialDay={initialDay} fill className="max-md:shrink-0" />
        <RotatingBanner position="bottom" compact className="shrink-0 hidden md:block" />
      </div>
    </AppMenuScreen>
  )
}
