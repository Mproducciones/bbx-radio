interface SectionHeaderProps {
  title: string
  compact?: boolean
}

export function SectionHeader({ title, compact }: SectionHeaderProps) {
  return (
    <header className={compact ? 'mb-2 shrink-0 md:mb-6' : 'mb-6'}>
      <h1 className={compact
        ? 'font-display text-2xl md:text-4xl text-white leading-none'
        : 'font-display text-3xl md:text-4xl text-white leading-none'
      }>
        {title}
      </h1>
    </header>
  )
}
