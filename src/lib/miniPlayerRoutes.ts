/** Rutas con listas/contenido: mini player compacto (no pantalla completa) */
export const MINI_PLAYER_SLIM_ROUTES = [
  '/programacion',
  '/participa',
  '/saludos',
  '/noticias',
  '/eventos',
  '/replay',
] as const

export function isMiniPlayerSlimRoute(pathname: string): boolean {
  return MINI_PLAYER_SLIM_ROUTES.some(r => pathname.startsWith(r))
}
