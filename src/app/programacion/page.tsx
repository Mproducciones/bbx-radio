import type { Metadata } from 'next'
import { ProgramSchedule } from '@/components/schedule/ProgramSchedule'
import { RotatingBanner } from '@/components/ads/RotatingBanner'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
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
    <AppMenuScreen scroll fullWidth className="programacion-route scroll-tab-route w-full min-w-0 max-w-full">
      <SectionHeader
        compact
        letterReveal
        centered
        showLine={false}
        title="Programación"
        className="min-w-0 max-w-full overflow-x-hidden"
      />
      <div className="programacion-route__content scroll-tab-route__content flex flex-col gap-1.5 min-w-0 max-w-full md:gap-5 md:min-h-0 md:flex-1 md:flex md:flex-col">
        <RotatingBanner position="top" compact className="shrink-0 w-full min-w-0 max-w-full" />
        <ProgramSchedule
          programs={programs}
          initialDay={initialDay}
          fill
          hideHeader
          className="w-full min-w-0 max-w-full"
        />
      </div>
    </AppMenuScreen>
  )
}
