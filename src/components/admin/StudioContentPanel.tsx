'use client'

import {
  STUDIO_CONTENT_GROUPS,
  STUDIO_PANEL_TITLE,
  getStudioItemsByGroup,
  isStudioFeatureEnabled,
  studioFeatureBadge,
  studioStructurePath,
  type StudioContentItem,
} from '@/lib/studioStructure'
import { AdminBadge, AdminSectionTitle } from '@/components/admin/adminUi'

function StudioContentCard({ item }: { item: StudioContentItem }) {
  const planBadge = studioFeatureBadge(item.feature)
  const appEnabled = item.appRoute && isStudioFeatureEnabled(item.feature)
  const studioHref = studioStructurePath(item.schemaType)

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all"
      style={{
        background: 'rgba(14,14,22,0.92)',
        border: `1px solid ${item.color}22`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div className="p-4 flex gap-3 flex-1">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${item.color}16` }}
        >
          {item.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-sm font-bold">{item.title}</p>
            {planBadge && <AdminBadge color="#FFB300">{planBadge}</AdminBadge>}
          </div>
          <p className="text-white/35 text-xs mt-1 leading-relaxed">{item.description}</p>
        </div>
      </div>
      <div
        className="flex border-t border-white/[0.06] text-xs font-semibold"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <a
          href={studioHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 text-center transition-colors hover:text-white"
          style={{ color: item.color }}
        >
          Editar en Studio →
        </a>
        {item.appRoute ? (
          <>
            <span className="w-px bg-white/[0.06] self-stretch" />
            {appEnabled ? (
              <a
                href={item.appRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 text-center text-white/45 hover:text-white/80 transition-colors"
              >
                Ver en app →
              </a>
            ) : (
              <span className="flex-1 py-2.5 text-center text-white/20 cursor-not-allowed" title={`Requiere plan ${planBadge}`}>
                Ver en app
              </span>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

export function StudioContentPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <AdminSectionTitle>{STUDIO_PANEL_TITLE}</AdminSectionTitle>
          <p className="text-white/30 text-xs mt-1">
            Mismas secciones que Sanity Studio — edita contenido y previsualiza en la PWA.
          </p>
        </div>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #db8918, #e8a840)',
            color: '#07070E',
            boxShadow: '0 4px 16px rgba(219,137,24,0.25)',
          }}
        >
          Abrir Studio completo
        </a>
      </div>

      {STUDIO_CONTENT_GROUPS.map(group => (
        <section key={group.id}>
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{group.title}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {getStudioItemsByGroup(group.id).map(item => (
              <StudioContentCard key={item.schemaType} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
