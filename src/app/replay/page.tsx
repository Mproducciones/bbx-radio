import { ReplayList } from '@/components/replay/ReplayList'
import { fetchReplay } from '@/lib/api'
import { AppMenuScreen } from '@/components/layout/AppMenuScreen'
import { SectionHeader } from '@/components/layout/SectionHeader'

export const revalidate = 1800

export default async function ReplayPage() {
  const episodes = await fetchReplay()

  return (
    <AppMenuScreen scroll>
      <SectionHeader compact title="Replay" />
      <div className="flex-1 min-h-0 md:flex-none">
        <ReplayList episodes={episodes} compact />
      </div>
    </AppMenuScreen>
  )
}
