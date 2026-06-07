/** Estado de morph compartido boot ↔ reproductor (actualizado por rAF, sin lag de React). */
export type BootMorphSnapshot = {
  morphT: number
  eqMorphT: number
  vinylScale: number
  vinylOpacity: number
  vinylRotationRad: number
  /** Opacidad barras canvas overlay (crossfade hacia CircularBars) */
  overlayEqOpacity: number
  /** Opacidad barras EQ del reproductor */
  playerEqOpacity: number
  showPlayerLogo: boolean
  /** Opacidad logo DOM (crossfade desde canvas) */
  playerLogoOpacity: number
  /** Opacidad logo canvas overlay */
  overlayLogoAlpha: number
  drawOverlayLogo: boolean
  overlayLogo: {
    cx: number
    cy: number
    size: number
    pulse: boolean
  } | null
  bgAlpha: number
  /** Opacidad del overlay full-screen (1 → 0 revela el reproductor) */
  overlayOpacity: number
  /** 0 → 1: chrome superior (TV/FM/notifs) entra tras el morph del logo */
  chromeRevealT: number
}

export const BOOT_MORPH_IDLE: BootMorphSnapshot = {
  morphT: 1,
  eqMorphT: 1,
  vinylScale: 1,
  vinylOpacity: 1,
  vinylRotationRad: 0,
  overlayEqOpacity: 0,
  playerEqOpacity: 1,
  showPlayerLogo: true,
  playerLogoOpacity: 1,
  overlayLogoAlpha: 0,
  drawOverlayLogo: false,
  overlayLogo: null,
  bgAlpha: 0,
  overlayOpacity: 0,
  chromeRevealT: 1,
}

export const bootMorphStore: BootMorphSnapshot = { ...BOOT_MORPH_IDLE }

export function resetBootMorphStore() {
  Object.assign(bootMorphStore, BOOT_MORPH_IDLE)
}

export function setBootMorph(partial: Partial<BootMorphSnapshot>) {
  Object.assign(bootMorphStore, partial)
}

const listeners = new Set<() => void>()
let bootMorphFrame = 0

export function getBootMorphFrame() {
  return bootMorphFrame
}

export function subscribeBootMorph(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifyBootMorph() {
  listeners.forEach(l => l())
}

export function publishBootMorph(partial: Partial<BootMorphSnapshot>) {
  setBootMorph(partial)
  bootMorphFrame++
  notifyBootMorph()
}
