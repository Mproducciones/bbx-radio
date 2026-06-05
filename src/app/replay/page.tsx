import { ReplayList } from '@/components/replay/ReplayList'
import { fetchReplay } from '@/lib/api'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'

export const revalidate = 1800

export default async function ReplayPage() {
  const episodes = await fetchReplay()

  return (
    <AppMenuScreen scroll className="replay-route w-full min-w-0 max-w-full">
      <SectionHeader compact title="Archivo" />
      <p className="replay-route__sub shrink-0">Programas grabados para escuchar cuando quieras</p>
      <ReplayList episodes={episodes} />
    </AppMenuScreen>
  )
}
