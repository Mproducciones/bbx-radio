export const MOTIVOS = [
  { id: 'cumpleanos',  label: 'Cumpleaños',  tagline: 'Que suene festejo en FM',     emoji: '🎂', color: '#db8918', glow: 'rgba(219,137,24,0.18)' },
  { id: 'aniversario', label: 'Aniversario', tagline: 'Amor que se escucha al aire', emoji: '💑', color: '#FF006E', glow: 'rgba(255,0,110,0.18)' },
  { id: 'dedicatoria', label: 'Dedicatoria', tagline: 'Con la canción que elijas',   emoji: '🎵', color: '#7D59B5', glow: 'rgba(125,89,181,0.18)' },
  { id: 'apoyo',       label: 'Apoyo',       tagline: 'Pa\' levantar el ánimo al tiro', emoji: '💪', color: '#00D9A0', glow: 'rgba(0,217,160,0.18)' },
  { id: 'extrañas',    label: 'Te extraño',  tagline: 'Kilómetros de distancia, cero de cariño', emoji: '💭', color: '#40B9BF', glow: 'rgba(64,185,191,0.18)' },
  { id: 'saludo',      label: 'Saludo',      tagline: 'Un hola para toda la región', emoji: '👋', color: '#FFB300', glow: 'rgba(255,179,0,0.18)' },
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
