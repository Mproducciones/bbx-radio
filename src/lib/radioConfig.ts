import type { RadioConfig, NowPlaying, Program } from '@/types/radio'

export const RADIO: RadioConfig = {
  id: 'bienvenida-933',
  name: 'Radio Bienvenida',
  slogan: 'Tu radio · 93.3 FM',
  frequency: '93.3 FM',
  streamUrl: 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida',
  zenoSlug: 'radio-bienvenida-fm',
  city: 'Rancagua',
  country: 'CL',
}

export const NOW_PLAYING: NowPlaying = {
  title: 'En Vivo',
  artist: 'Radio Bienvenida 93.3 FM',
  isLive: true,
  startedAt: new Date(0),
}

export const PROGRAMS: Program[] = [
  { id: '1', name: 'Matinal Bienvenida', host: 'Por confirmar', startTime: '06:00', endTime: '10:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'], description: 'Arranca el día con la mejor energía' },
  { id: '2', name: 'Mix del Día', host: 'Por confirmar', startTime: '10:00', endTime: '14:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'], description: 'Los hits del momento' },
  { id: '3', name: 'Tarde en Rancagua', host: 'Por confirmar', startTime: '14:00', endTime: '19:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'], description: 'Tarde cargada de música' },
  { id: '4', name: 'Noche FM', host: 'Por confirmar', startTime: '20:00', endTime: '00:00', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], description: 'La mejor música para la noche' },
  { id: '5', name: 'Sábado Mix', host: 'Por confirmar', startTime: '10:00', endTime: '16:00', days: ['sat'], description: 'El mejor sábado' },
  { id: '6', name: 'Domingo Bienvenida', host: 'Por confirmar', startTime: '12:00', endTime: '18:00', days: ['sun'], description: 'Domingo de música y buen ambiente' },
]

export const RADIO_TV_HLS = 'https://panel.tvstream.cl:1936/8012/8012/playlist.m3u8'
