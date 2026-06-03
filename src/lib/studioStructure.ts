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

export const STUDIO_PANEL_TITLE = 'Panel de contenido'

export const STUDIO_CONTENT_GROUPS: { id: StudioContentGroup; title: string }[] = [
  { id: 'editorial', title: 'Contenido editorial' },
  { id: 'radio', title: 'Radio' },
  { id: 'publicidad', title: 'Publicidad' },
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
    title: 'Programas',
    emoji: '🎙️',
    description: 'Parrilla y programas de la emisora',
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
    title: 'Publicidad (banners)',
    emoji: '📢',
    description: 'Banners y campañas visibles en la app',
    appRoute: null,
    feature: 'publicidad',
    color: '#db8918',
    group: 'publicidad',
  },
  {
    schemaType: 'paquetesPublicitarios',
    title: 'Paquetes Publicitarios',
    emoji: '💼',
    description: 'Tarifas y paquetes de la página Anúnciate',
    appRoute: '/anunciate',
    feature: 'publicidad',
    color: '#e8a840',
    group: 'publicidad',
  },
]

export function studioStructurePath(schemaType: string): string {
  return `/studio/structure/${schemaType}`
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
