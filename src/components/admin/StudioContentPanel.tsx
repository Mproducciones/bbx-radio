'use client'

import Link from 'next/link'
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
  const editorHref = studioStructurePath(item.schemaType)

  return (
    <div
      className="admin-studio-card relative flex flex-col"
      style={{ '--studio-accent': item.color } as React.CSSProperties}
    >
      <div className="p-5 flex gap-4 flex-1">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{
            background: `color-mix(in srgb, ${item.color} 16%, transparent)`,
            border: `1px solid color-mix(in srgb, ${item.color} 30%, transparent)`,
          }}
        >
          {item.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-base font-bold">{item.title}</p>
            {planBadge && <AdminBadge color="#FFB300">{planBadge}</AdminBadge>}
          </div>
          <p className="admin-hint mt-1.5">{item.description}</p>
        </div>
      </div>
      <div
        className="flex border-t border-white/[0.06] text-sm font-bold"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <a
          href={editorHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center transition-colors hover:text-white"
          style={{ color: item.color }}
        >
          Abrir editor →
        </a>
        {item.appRoute ? (
          <>
            <span className="w-px bg-white/[0.06] self-stretch" />
            {appEnabled ? (
              <a
                href={item.appRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 text-center text-white/45 hover:text-white/80 transition-colors"
              >
                Ver en app →
              </a>
            ) : (
              <span className="flex-1 py-3.5 text-center text-white/20 cursor-not-allowed" title={`Requiere plan ${planBadge}`}>
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
      <div
        className="admin-callout flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <p className="admin-label text-[#db8918]">Día a día</p>
          <p className="admin-body mt-1">
            Publicidad, clientes y en vivo → pestaña <strong className="text-white">Comercial</strong> o <strong className="text-white">En vivo</strong>.
          </p>
        </div>
        <Link href="/admin?section=commercial" className="admin-btn-ghost shrink-0 !text-[#db8918] !border-[#db8918]/30">
          Ir a Comercial
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <AdminSectionTitle>{STUDIO_PANEL_TITLE}</AdminSectionTitle>
          <p className="admin-hint mt-2 max-w-xl">
            Formularios para noticias, grilla y campañas. No reemplaza el panel operativo: es el “cargador” de
            textos e imágenes que la app muestra después.
          </p>
        </div>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn-primary shrink-0 !w-auto inline-flex px-5 py-2.5"
        >
          Abrir editor completo
        </a>
      </div>

      {STUDIO_CONTENT_GROUPS.map(group => (
        <section key={group.id}>
          <p className="admin-eyebrow mb-3">{group.title}</p>
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
