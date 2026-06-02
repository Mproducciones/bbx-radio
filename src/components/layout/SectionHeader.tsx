interface SectionHeaderProps {
  kicker?: string
  title: string
  subtitle?: string
  compact?: boolean
}

export function SectionHeader({ kicker, title, subtitle, compact }: SectionHeaderProps) {
  return (
    <header className={compact ? 'mb-2 shrink-0 md:mb-6' : 'mb-6'}>
      {kicker && (
        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--color-mag-400)] animate-pulse" />
          <p className="text-[var(--color-mag-400)] text-[10px] font-black uppercase tracking-widest">
            {kicker}
          </p>
        </div>
      )}
      <h1 className={compact
        ? 'font-display text-2xl md:text-4xl text-white leading-none'
        : 'font-display text-3xl md:text-4xl text-white leading-none'
      }>
        {title}
      </h1>
      {subtitle && (
        <p className={compact
          ? 'text-[var(--color-ink-400)] text-[11px] md:text-xs mt-1 font-medium line-clamp-1'
          : 'text-[var(--color-ink-400)] text-xs mt-2 font-medium'
        }>
          {subtitle}
        </p>
      )}
    </header>
  )
}
