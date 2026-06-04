import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'

export default function SaludosLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 pt-[var(--app-content-pad-y)]">
      <div className="h-8 w-40 rounded bg-white/10 animate-pulse mb-3" />
      <div className="h-2 w-full rounded-full bg-white/[0.06] animate-pulse mb-4" />
      <TabPanelSkeleton lines={4} />
    </div>
  )
}
