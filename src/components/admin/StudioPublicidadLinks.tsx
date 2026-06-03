'use client'

import { getPublicidadStudioItems, studioStructurePath } from '@/lib/studioStructure'

/** Accesos rápidos al CMS de publicidad (métricas en AdsPanel). */
export function StudioPublicidadLinks() {
  const items = getPublicidadStudioItems()

  return (
    <div
      className="flex flex-wrap gap-2 rounded-xl px-3 py-2.5"
      style={{ background: 'rgba(219,137,24,0.06)', border: '1px solid rgba(219,137,24,0.15)' }}
    >
      <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wide w-full sm:w-auto sm:mr-1">
        CMS publicidad
      </span>
      {items.map(item => (
        <a
          key={item.schemaType}
          href={studioStructurePath(item.schemaType)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors hover:text-white"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)' }}
        >
          <span>{item.emoji}</span>
          <span>{item.title}</span>
        </a>
      ))}
    </div>
  )
}
