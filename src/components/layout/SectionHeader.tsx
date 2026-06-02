interface SectionHeaderProps {
  kicker?: string
  title: string
  subtitle?: string
}

export function SectionHeader({ kicker, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="mb-6">
      {kicker && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--color-mag-400)] animate-pulse" />
          <p className="text-[var(--color-mag-400)] text-[10px] font-black uppercase tracking-widest">
            {kicker}
          </p>
        </div>
      )}
      <h1 className="font-display text-3xl md:text-4xl text-white leading-none">{title}</h1>
      {subtitle && (
        <p className="text-[var(--color-ink-400)] text-xs mt-2 font-medium">{subtitle}</p>
      )}
    </header>
  )
}
