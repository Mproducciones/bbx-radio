import { RADIO } from '@/lib/radioConfig'

/** Frases rotativas del hero — tono radio en vivo, chileno. */
export const PARTICIPA_HOOKS = [
  'Tu voto define el próximo tema',
  'Pide la canción y suena al aire',
  'Participa y quédate en la onda',
  `La ${RADIO.frequency} suena contigo`,
  'El locutor te está escuchando',
] as const

export const PARTICIPA_ACTIONS = {
  votar: {
    title: 'Votar',
    hook: 'Batalla de temas en vivo',
    emoji: '🎵',
    color: '#db8918',
    glow: 'rgba(219,137,24,0.22)',
  },
  pedir: {
    title: 'Pedir',
    hook: 'Manda tu canción al locutor',
    emoji: '🎙️',
    color: '#40B9BF',
    glow: 'rgba(64,185,191,0.22)',
  },
  sorteo: {
    title: 'Sorteo',
    hook: 'Premios y sorpresas al aire',
    emoji: '🎁',
    color: '#7D59B5',
    glow: 'rgba(125,89,181,0.25)',
  },
} as const
