import { TabPanelSkeleton } from '@/components/ui/TabPanelSkeleton'

export default function ParticipaLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 pt-[var(--app-content-pad-y)]">
      <div className="h-8 w-32 rounded bg-white/10 animate-pulse mb-3" />
      <div className="h-11 rounded-2xl bg-white/[0.04] animate-pulse mb-3" />
      <TabPanelSkeleton />
    </div>
  )
}
