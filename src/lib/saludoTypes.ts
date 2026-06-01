export const MOTIVOS = [
  { id: 'cumpleanos',  label: 'Cumpleaños',         emoji: '🎂' },
  { id: 'aniversario', label: 'Aniversario',         emoji: '💑' },
  { id: 'dedicatoria', label: 'Dedicatoria especial', emoji: '🎵' },
  { id: 'apoyo',       label: 'Apoyo y cariño',      emoji: '💪' },
  { id: 'extrañas',    label: 'Te extraño',           emoji: '💭' },
  { id: 'saludo',      label: 'Saludo especial',      emoji: '👋' },
] as const

export type MotivoId = typeof MOTIVOS[number]['id']

export interface Saludo {
  id: string
  para: string
  motivo: MotivoId
  de: string
  mensaje?: string
  cancion?: string
  artista?: string
  status: 'pending' | 'al_aire' | 'leido'
  submitted_at: string
}
