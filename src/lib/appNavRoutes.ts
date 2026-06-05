import { FEATURES } from '@/lib/plan'

/** Bottom nav principal (4 tabs + botón Más) */
export const APP_PRIMARY_NAV_ROUTES = [
  '/',
  '/programacion',
  '/participa',
  '/saludos',
] as const

/** Rutas secundarias vinculadas al botón Más (TV se abre como overlay, no como página) */
export const APP_MORE_NAV_ROUTES = [
  ...(FEATURES.publicidad ? (['/anunciate'] as const) : []),
] as const

/** Swipe horizontal solo entre tabs principales */
export const APP_NAV_ROUTES = APP_PRIMARY_NAV_ROUTES

export type AppPrimaryNavRoute = (typeof APP_PRIMARY_NAV_ROUTES)[number]
export type AppMoreNavRoute = (typeof APP_MORE_NAV_ROUTES)[number]
export type AppNavRoute = AppPrimaryNavRoute | AppMoreNavRoute

export function isMoreNavRoute(path: string): boolean {
  return APP_MORE_NAV_ROUTES.some(r => path.startsWith(r))
}

export function appNavIndex(path: string): number {
  if (path === '/') return 0
  const i = APP_PRIMARY_NAV_ROUTES.findIndex(r => r !== '/' && path.startsWith(r))
  return i
}

/** Rutas con scroll propio — sin animación swipe del shell */
export const APP_SCROLL_ROUTES = [
  '/programacion',
  '/participa',
  '/saludos',
  '/bbx',
  '/anunciate',
  '/admin',
  '/studio',
  '/patrocinadores',
  '/lanzamientos',
  '/replay',
  '/tv',
] as const

export function isAppScrollRoute(path: string): boolean {
  return APP_SCROLL_ROUTES.some(r => path.startsWith(r))
}

export function isAppTabRoute(path: string): boolean {
  return appNavIndex(path) !== -1 || isMoreNavRoute(path)
}
