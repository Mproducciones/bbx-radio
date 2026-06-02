/**
 * Vibración segura: Chrome/Edge solo permiten vibrate() dentro de un gesto del usuario.
 * Las llamadas desde setInterval/setTimeout deben usar queueVibrate + flush en touchend.
 */

let pending: number | number[] | null = null
let listenersAttached = false

function attachFlushListeners() {
  if (listenersAttached || typeof window === 'undefined') return
  listenersAttached = true
  const flush = () => flushVibrate()
  window.addEventListener('touchend', flush, { passive: true, capture: true })
  window.addEventListener('pointerup', flush, { passive: true, capture: true })
}

/** Encola vibración; se ejecuta en el próximo touchend/pointerup del usuario */
export function queueVibrate(pattern: number | number[]) {
  pending = pattern
  attachFlushListeners()
}

/** Ejecuta vibración encolada (p. ej. al soltar el logo tras mantener pulsado) */
export function flushVibrate() {
  if (!pending || typeof navigator === 'undefined' || !navigator.vibrate) {
    pending = null
    return
  }
  try {
    navigator.vibrate(pending)
  } catch {
    // Navegador bloqueó o no soporta
  }
  pending = null
}

/** Solo usar dentro de handlers directos click/touch (play, botones) */
export function vibrateNow(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return false
  try {
    return navigator.vibrate(pattern)
  } catch {
    return false
  }
}
