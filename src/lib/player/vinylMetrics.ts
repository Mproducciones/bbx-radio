/** Métricas compartidas boot ↔ reproductor — misma escala, misma posición. */
export const VINYL_DISC_SIZE = 220
export const VINYL_RING = 56
export const VINYL_OUTER = VINYL_DISC_SIZE + VINYL_RING
export const VINYL_LABEL = 130

export const ENVIVO_VINYL_ANCHOR_ID = 'envivo-vinyl-anchor'
export const ENVIVO_VINYL_LABEL_ID = 'envivo-vinyl-label'
export const ENVIVO_VINYL_DISC_ID = 'envivo-vinyl-disc'

export interface VinylAnchorMetrics {
  cx: number
  cy: number
  outerDiameter: number
  outerRadius: number
  labelSize: number
}

export function measureVinylAnchor(): VinylAnchorMetrics | null {
  const anchor = document.getElementById(ENVIVO_VINYL_ANCHOR_ID)
  if (!anchor) return null

  const rect = anchor.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  let labelSize = (VINYL_LABEL / VINYL_OUTER) * rect.width
  const label = document.getElementById(ENVIVO_VINYL_LABEL_ID)
  if (label) {
    const lr = label.getBoundingClientRect()
    if (lr.width > 8) labelSize = lr.width
  }

  return {
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
    outerDiameter: rect.width,
    outerRadius: rect.width / 2 - 1,
    labelSize,
  }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function getCanvasDpr(): number {
  return Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
}

function readRootPxVar(name: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const value = parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

/** Centro óptico del escenario En Vivo (entre safe-top y bottom nav). */
export function getEnvivoStageCenter(): { cx: number; cy: number } {
  if (typeof window === 'undefined') return { cx: 0, cy: 0 }

  const w = window.innerWidth
  const h = window.innerHeight
  const safeTop = readRootPxVar('--app-safe-top', 0)
  const navTotal = readRootPxVar('--app-nav-total', 72)

  return {
    cx: w / 2,
    cy: safeTop + (h - safeTop - navTotal) / 2,
  }
}
