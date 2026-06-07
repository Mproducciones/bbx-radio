import { RADIO, RADIO_TAGLINE } from '@/lib/radioConfig'

/** Frases rotativas — tono oyente FM, chileno. */
export const SALUDOS_HOOKS = [
  'Mándale cariño al aire en un toque',
  'El locutor lo lee en vivo — tú mandas',
  `Desde ${RADIO.city} pa' quien tú quieras`,
  'Tu voz suena en la 93.3',
  RADIO_TAGLINE,
  'Pa\' la mamá, el pololo, el compadre…',
] as const

/** Marquesina cabina. */
export const SALUDOS_TICKER = [
  'ON AIR',
  'SALUDOS AL AIRE',
  'DIRECTO A CABINA',
  RADIO.frequency,
  'EL LOCUTOR TE ESCUCHA',
  'MANDA TU MENSAJE',
] as const

export const SALUDOS_STEPS = [
  { id: 'motivo', emoji: '🎁', label: 'Elige' },
  { id: 'escribe', emoji: '✍️', label: 'Escribe' },
] as const
