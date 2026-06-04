export type NotificationsBellLayout = {
  x: number
  y: number
  minimized: boolean
}

const STORAGE_KEY = 'pulso_notif_bell_layout'
const BELL_SIZE = 40
const MINI_SIZE = 32
const EDGE = 8

export function bellFabSize(minimized: boolean) {
  return minimized ? MINI_SIZE : BELL_SIZE
}

export function loadBellLayout(): NotificationsBellLayout | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as NotificationsBellLayout
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null
    return {
      x: parsed.x,
      y: parsed.y,
      minimized: !!parsed.minimized,
    }
  } catch {
    return null
  }
}

export function saveBellLayout(layout: NotificationsBellLayout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
  } catch {
    /* ignore quota */
  }
}

function readPxVar(name: string, fallback: number) {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : fallback
}

export function defaultBellPosition(minimized: boolean) {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, minimized }
  }
  const size = bellFabSize(minimized)
  const gutterR = readPxVar('--app-gutter-right', 16)
  const safeTop = readPxVar('--app-safe-top', 0)
  const x = window.innerWidth - gutterR - size - 4
  const y = safeTop + 10
  return clampBellPosition(x, y, minimized)
}

export function clampBellPosition(x: number, y: number, minimized: boolean) {
  if (typeof window === 'undefined') return { x, y, minimized }
  const size = bellFabSize(minimized)
  const gutterL = readPxVar('--app-gutter-left', 16)
  const gutterR = readPxVar('--app-gutter-right', 16)
  const safeTop = readPxVar('--app-safe-top', 0)
  const navBottom = readPxVar('--app-nav-total', 72)

  const minX = gutterL + EDGE
  const maxX = window.innerWidth - gutterR - size - EDGE
  const minY = safeTop + EDGE
  const maxY = window.innerHeight - navBottom - size - EDGE

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
    minimized,
  }
}

export { BELL_SIZE, MINI_SIZE, EDGE }
