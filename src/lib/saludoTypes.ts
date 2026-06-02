export const MOTIVOS = [
  { id: 'cumpleanos',  label: 'Cumpleaños',         emoji: '🎂', color: '#db8918', glow: 'rgba(219,137,24,0.15)' },
  { id: 'aniversario', label: 'Aniversario',         emoji: '💑', color: '#FF006E', glow: 'rgba(255,0,110,0.15)' },
  { id: 'dedicatoria', label: 'Dedicatoria',         emoji: '🎵', color: '#7D59B5', glow: 'rgba(125,89,181,0.15)' },
  { id: 'apoyo',       label: 'Apoyo',               emoji: '💪', color: '#00D9A0', glow: 'rgba(0,217,160,0.15)' },
  { id: 'extrañas',    label: 'Te extraño',          emoji: '💭', color: '#40B9BF', glow: 'rgba(64,185,191,0.15)' },
  { id: 'saludo',      label: 'Saludo',              emoji: '👋', color: '#FFB300', glow: 'rgba(255,179,0,0.15)' },
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
