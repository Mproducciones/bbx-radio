/** Placeholder ligero mientras carga un panel de tab (Participa / Saludos). */
export function TabPanelSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div
      className="flex flex-1 flex-col min-h-0 rounded-2xl p-4 gap-3 animate-pulse"
      style={{ background: 'rgba(15,15,26,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}
      aria-hidden
    >
      <div className="h-3 w-24 rounded-full bg-white/10" />
      <div className="h-4 w-full max-w-[85%] rounded bg-white/10" />
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-[5rem]">
        <div className="rounded-xl bg-white/[0.06]" />
        <div className="rounded-xl bg-white/[0.06]" />
      </div>
      {lines > 2 && <div className="h-9 w-full rounded-xl bg-white/[0.06]" />}
    </div>
  )
}
