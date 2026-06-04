import { FEATURES } from './plan'

/** Grupos del listado en sanity.config.ts (structureTool). */
export type StudioContentGroup = 'editorial' | 'radio' | 'publicidad'

export type StudioFeatureKey =
  | 'noticias'
  | 'eventos'
  | 'replay'
  | 'publicidad'
  | 'lanzamientos'
  | null

export interface StudioContentItem {
  schemaType: string
  title: string
  emoji: string
  description: string
  /** Ruta en la PWA; null si no hay página dedicada */
  appRoute: string | null
  feature: StudioFeatureKey
  color: string
  group: StudioContentGroup
}

export const STUDIO_PANEL_TITLE = 'Editor de contenido'

export const STUDIO_CONTENT_GROUPS: { id: StudioContentGroup; title: string }[] = [
  { id: 'publicidad', title: 'Publicidad (campañas en la app)' },
  { id: 'radio', title: 'Grilla y audio' },
  { id: 'editorial', title: 'Noticias y eventos' },
]

/** Espejo de `sanity.config.ts` → structureTool items (orden y tipos). */
export const STUDIO_CONTENT_ITEMS: StudioContentItem[] = [
  {
    schemaType: 'noticia',
    title: 'Noticias',
    emoji: '📰',
    description: 'Noticias locales y novedades de la radio',
    appRoute: '/noticias',
    feature: 'noticias',
    color: '#40B9BF',
    group: 'editorial',
  },
  {
    schemaType: 'evento',
    title: 'Eventos',
    emoji: '📅',
    description: 'Agenda de eventos y actividades',
    appRoute: '/eventos',
    feature: 'eventos',
    color: '#7D59B5',
    group: 'editorial',
  },
  {
    schemaType: 'programa',
    title: 'Grilla · Programas',
    emoji: '🎙️',
    description: 'Lo que ve el oyente en /programacion (+ patrocinador del bloque)',
    appRoute: '/programacion',
    feature: null,
    color: '#FF006E',
    group: 'radio',
  },
  {
    schemaType: 'replay',
    title: 'Replay',
    emoji: '▶️',
    description: 'Episodios y programas para escuchar después',
    appRoute: '/replay',
    feature: 'replay',
    color: '#00D9A0',
    group: 'radio',
  },
  {
    schemaType: 'lanzamiento',
    title: 'Lanzamientos',
    emoji: '🎵',
    description: 'Música nueva y estrenos',
    appRoute: '/lanzamientos',
    feature: 'lanzamientos',
    color: '#FF3860',
    group: 'radio',
  },
  {
    schemaType: 'publicidad',
    title: 'Campañas publicitarias',
    emoji: '📢',
    description: 'Arte y fechas de banners — ordénalo también en /admin → Comercial',
    appRoute: null,
    feature: 'publicidad',
    color: '#db8918',
    group: 'publicidad',
  },
  {
    schemaType: 'paquetesPublicitarios',
    title: 'Textos Anunciate',
    emoji: '💼',
    description: 'Precios de venta en /anunciate (no es lo que ve el oyente al escuchar)',
    appRoute: '/anunciate',
    feature: 'publicidad',
    color: '#e8a840',
    group: 'publicidad',
  },
]

export function studioStructurePath(schemaType: string): string {
  return `/studio/structure/${schemaType}`
}

/** Abrir un documento existente en Studio. */
export function studioEditDocument(schemaType: string, documentId: string): string {
  return `/studio/intent/edit/id=${documentId};type=${schemaType}`
}

/** Crear documento nuevo en Studio. */
export function studioCreateDocument(schemaType: string): string {
  return `/studio/intent/create?type=${schemaType}`
}

export function isStudioFeatureEnabled(feature: StudioFeatureKey): boolean {
  if (feature === null) return true
  return FEATURES[feature]
}

export function studioFeatureBadge(feature: StudioFeatureKey): 'Pro' | 'Premium' | null {
  if (feature === null || isStudioFeatureEnabled(feature)) return null
  return feature === 'lanzamientos' ? 'Premium' : 'Pro'
}

export function getStudioItemsByGroup(group: StudioContentGroup): StudioContentItem[] {
  return STUDIO_CONTENT_ITEMS.filter(i => i.group === group)
}

export function getPublicidadStudioItems(): StudioContentItem[] {
  return getStudioItemsByGroup('publicidad')
}
