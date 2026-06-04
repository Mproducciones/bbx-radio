import { FEATURES } from '@/lib/plan'

/** Una sola fuente: bottom nav + swipe entre tabs (mismas rutas, mismo orden) */
export const APP_NAV_ROUTES = [
  '/',
  '/programacion',
  '/participa',
  '/saludos',
  ...(FEATURES.replay ? (['/replay'] as const) : []),
  '/tv',
  ...(FEATURES.publicidad ? (['/anunciate'] as const) : []),
] as const

export type AppNavRoute = (typeof APP_NAV_ROUTES)[number]

export function appNavIndex(path: string): number {
  if (path === '/') return 0
  const i = APP_NAV_ROUTES.findIndex(r => r !== '/' && path.startsWith(r))
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
] as const

export function isAppScrollRoute(path: string): boolean {
  return APP_SCROLL_ROUTES.some(r => path.startsWith(r))
}

export function isAppTabRoute(path: string): boolean {
  return appNavIndex(path) !== -1
}
