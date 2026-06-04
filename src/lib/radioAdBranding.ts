import { NOW_PLAYING, PROGRAMS, RADIO } from '@/lib/radioConfig'

/** Programa destacado para patrocinio empresarial (demo). */
export const FEATURED_PROGRAM =
  PROGRAMS.find(p => p.name === 'Matinal Bienvenida') ?? PROGRAMS[0]

/** Textos y metadatos de emisora para publicidad, mockups y banners demo. */
export const RADIO_AD = {
  stationName: RADIO.name,
  frequency: RADIO.frequency,
  slogan: RADIO.slogan,
  city: RADIO.city,
  region: "Región de O'Higgins",
  featuredProgramName: FEATURED_PROGRAM.name,
  featuredProgramStart: FEATURED_PROGRAM.startTime,
  /** Línea corta bajo banners (app). */
  stamp: `${RADIO.name} · ${RADIO.frequency}`,
  stampFull: `${RADIO.name} ${RADIO.frequency} · ${RADIO.city}`,
  audience: `Oyentes en ${RADIO.city} y la Región de O'Higgins`,
  adLabel: 'Publicidad',
  pautaTagline: `Pauta en ${RADIO.frequency} + app · Desde $80.000/mes`,
  nowPlayingTitle: NOW_PLAYING.title,
  nowPlayingArtist: NOW_PLAYING.artist,
} as const

export function programPatrocinioLabel(programName = FEATURED_PROGRAM.name): string {
  return `Presenta: ${programName}`
}

export function floatingProgramLine(
  programName = FEATURED_PROGRAM.name,
  startTime = FEATURED_PROGRAM.startTime,
): string {
  return `Presenta: ${programName} · ${startTime}`
}

/** Guión demo de spot FM con marca de la radio. */
export function demoSpotScript(cliente: string, promo: string): string {
  return `“Hola ${RADIO.city}, en ${cliente} ${promo}… Te lo contamos en ${RADIO.name} ${RADIO.frequency}.”`
}
