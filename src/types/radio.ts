export interface RadioConfig {
  id: string
  name: string
  slogan: string
  frequency: string
  streamUrl: string
  zenoSlug?: string        // slug de zeno.fm para embed fallback
  logoUrl?: string
  primaryColor?: string
  city: string
  country: string
}

export interface NowPlaying {
  title: string
  artist: string
  albumArt?: string
  startedAt: Date
  isLive: boolean
}

export interface Program {
  id: string
  name: string
  host: string
  startTime: string
  endTime: string
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  description?: string
  imageUrl?: string
  isLive?: boolean
}

export interface SongRequest {
  id: string
  song: string
  artist: string
  requestedBy: string
  message?: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'played'
}
