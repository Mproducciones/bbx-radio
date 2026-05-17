export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  date: string          // ISO 8601
  imageUrl?: string
  link: string
  category?: string
}

export interface RadioEvent {
  id: string
  title: string
  date: string          // ISO 8601
  time?: string
  venue: string
  city: string
  imageUrl?: string
  ticketUrl?: string
  isFree: boolean
  price?: string
  description?: string
  isPast?: boolean
}

export interface ReplayEpisode {
  id: string
  title: string
  program: string
  host?: string
  broadcastDate: string // YYYY-MM-DD
  duration?: string     // "4h", "1h30m"
  description?: string
  imageUrl?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  spotifyUrl?: string
}

export interface MusicRelease {
  id: string
  title: string
  artist: string
  releaseType: 'Single' | 'EP' | 'Álbum' | 'Colaboración'
  genre?: string
  releaseDate: string   // YYYY-MM-DD
  description?: string
  coverUrl?: string
  spotifyUrl?: string
  youtubeUrl?: string
  appleMusicUrl?: string
}

export interface SponsorTier {
  name: string
  price: string
  highlight?: boolean
  benefits: string[]
  cta: string
}
