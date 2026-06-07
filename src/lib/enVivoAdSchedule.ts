/** Ritmo del banner en En Vivo — visible por intervalos, no fijo (prioriza el reproductor). */

export type EnVivoAdMode = 'standard' | 'highlighted' | 'exclusive'

export type EnVivoAdSchedule = {
  /** Tiempo visible (ms) */
  displayMs: number
  /** Pausa sin banner — reproductor libre (ms) */
  pauseMs: number
  /** Rotación entre campañas del mismo slot (ms) */
  rotateMs: number
  /** Espera antes del primer aviso (ms) */
  initialDelayMs: number
}

export const EN_VIVO_AD_SCHEDULE: Record<EnVivoAdMode, EnVivoAdSchedule> = {
  /** Plan Básico — banner_inferior en En Vivo */
  standard: {
    displayMs: 8_000,
    pauseMs: 40_000,
    rotateMs: 8_000,
    initialDelayMs: 8_000,
  },
  highlighted: {
    displayMs: 10_000,
    pauseMs: 32_000,
    rotateMs: 8_000,
    initialDelayMs: 6_000,
  },
  exclusive: {
    displayMs: 12_000,
    pauseMs: 26_000,
    rotateMs: 12_000,
    initialDelayMs: 6_000,
  },
}

export function resolveEnVivoAdMode(
  slotMode: 'standard' | 'highlighted',
  exclusive: boolean,
): EnVivoAdMode {
  if (exclusive) return 'exclusive'
  return slotMode
}

export function enVivoAdCycleSeconds(mode: EnVivoAdMode): number {
  const s = EN_VIVO_AD_SCHEDULE[mode]
  return Math.round((s.displayMs + s.pauseMs) / 1000)
}

export function enVivoAdDisplaySeconds(mode: EnVivoAdMode): number {
  return Math.round(EN_VIVO_AD_SCHEDULE[mode].displayMs / 1000)
}

/** Texto comercial corto — alineado al código de EnVivoAdSlot. */
export function enVivoAdSalesLine(mode: EnVivoAdMode): string {
  const show = enVivoAdDisplaySeconds(mode)
  const cycle = enVivoAdCycleSeconds(mode)
  return `En En Vivo: ~${show} s visibles cada ~${cycle} s (no ocupa el reproductor todo el tiempo)`
}

export const EN_VIVO_AD_POLICY =
  'El banner en En Vivo aparece por intervalos y cede el espacio al reproductor — nunca queda fijo tapando la experiencia de escucha.'
