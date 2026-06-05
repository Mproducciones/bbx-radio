/** Portadas y colores por programa — grilla, replay y cards sin imagen en CMS. */

export type ProgramArt = {
  color: string
  image: string
  shortLabel?: string
}

const UNSPLASH = (id: string, w = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`

export const PROGRAM_ART: Record<string, ProgramArt> = {
  'Madrugada musical': {
    color: '#5B6EE1',
    image: UNSPLASH('photo-1514525253161-7a46d19cd819'),
    shortLabel: 'Madrugada',
  },
  'Matinal Bienvenida': {
    color: '#FF8C42',
    image: UNSPLASH('photo-1614613535308-eb5fbd3d2c17'),
    shortLabel: 'Matinal',
  },
  'Mix del Día': {
    color: '#db8918',
    image: UNSPLASH('photo-1493225457124-a3eb161ffa5f'),
    shortLabel: 'Mix',
  },
  'Tarde en Rancagua': {
    color: '#40B9BF',
    image: UNSPLASH('photo-1511671782779-c97d3d27a1d4'),
    shortLabel: 'Tarde',
  },
  'Noche FM': {
    color: '#7D59B5',
    image: UNSPLASH('photo-1470225620780-dba8ba36b745'),
    shortLabel: 'Noche',
  },
  'Sábado Mix': {
    color: '#00D9A0',
    image: UNSPLASH('photo-1501386761578-eaa54b595471'),
    shortLabel: 'Sábado',
  },
  'Domingo Bienvenida': {
    color: '#E8A838',
    image: UNSPLASH('photo-1516280440614-37939bbacd81'),
    shortLabel: 'Domingo',
  },
}

const DEFAULT_ART: ProgramArt = {
  color: '#db8918',
  image: UNSPLASH('photo-1493225457124-a3eb161ffa5f'),
  shortLabel: 'Radio',
}

export function getProgramArt(programName?: string | null): ProgramArt {
  if (!programName?.trim()) return DEFAULT_ART
  return PROGRAM_ART[programName.trim()] ?? DEFAULT_ART
}

export function resolveProgramCover(programName?: string | null, coverUrl?: string | null): string {
  const trimmed = coverUrl?.trim()
  if (trimmed && trimmed.startsWith('http')) return trimmed
  return getProgramArt(programName).image
}

export function getProgramColor(programName?: string | null): string {
  return getProgramArt(programName).color
}
