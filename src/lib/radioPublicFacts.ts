/**
 * Datos públicos verificables de Radio Bienvenida.
 * Fuentes: El Rancagüino (oct 2021, oct 2023), declaraciones oficiales de la emisora.
 * No incluye rating Ipsos por emisora (no publicado para Bienvenida).
 */

export const RADIO_PUBLIC_FACTS = {
  foundedYear: 1989,
  foundedDate: '1989-10-19',
  comunasRegion: 33,
  fmSignals: 4,
  frequencies: [
    { city: 'Rancagua', freq: '93.3 FM' },
    { city: 'San Fernando', freq: '105.1 FM' },
    { city: 'Santa Cruz', freq: '100.9 FM' },
    { city: 'Pichilemu', freq: '97.1 FM' },
  ],
  /** El Rancagüino, 22 oct 2021 — cifra comunicada por la radio */
  socialFacebookMin: 37_000,
  /** El Rancagüino, 22 oct 2021 */
  socialInstagramMin: 3_000,
  /** Ipsos — mercado Rancagua, no share de emisora individual */
  rancaguaDailyRadioReachPct: 66.2,
  /** Ipsos — horario 18–20 h, Rancagua (personas que escuchan radio, cualquier emisora) */
  rancaguaEveningRadioListeners: 38_000,
  coverageClaim:
    'Única emisora por antena en las 33 comunas de la región de O\'Higgins',
} as const

/** Años completos desde la primera transmisión (19 oct 1989). */
export function getYearsOnAir(now = new Date()): number {
  const founded = new Date(`${RADIO_PUBLIC_FACTS.foundedDate}T12:00:00`)
  let years = now.getFullYear() - founded.getFullYear()
  const anniversary = new Date(now.getFullYear(), founded.getMonth(), founded.getDate())
  if (now < anniversary) years -= 1
  return Math.max(0, years)
}

/** Ej. 37000 → "37K+" */
export function formatThousandsPlus(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`
  return `${n}+`
}

export const RADIO_FM_FREQUENCIES_LABEL = RADIO_PUBLIC_FACTS.frequencies
  .map(f => f.freq)
  .join(' · ')
