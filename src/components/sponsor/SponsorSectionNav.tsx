'use client'

const SECTIONS = [
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'planes', label: 'Planes' },
  { id: 'probar', label: 'Probar' },
  { id: 'pasos', label: 'Cómo' },
  { id: 'faq', label: 'FAQ' },
] as const

export function SponsorSectionNav() {
  return (
    <nav
      className="sticky z-20 py-2 mb-4 border-b border-white/8 backdrop-blur-xl w-full min-w-0"
      style={{ top: 0, background: 'rgba(7,7,14,0.92)' }}
      aria-label="Secciones de publicidad"
    >
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70 border border-white/12 hover:text-white hover:border-[#db8918]/50 active:bg-white/[0.06] transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
