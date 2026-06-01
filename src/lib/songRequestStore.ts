// In-memory queue for song requests (MVP — single server instance)

export interface SongRequest {
  id: string
  song: string
  artist: string
  dedication?: string
  submittedAt: string  // ISO string
  status: 'pending' | 'approved' | 'played' | 'rejected'
}

const queue: SongRequest[] = []
let counter = 1

export function addRequest(data: Pick<SongRequest, 'song' | 'artist' | 'dedication'>): SongRequest {
  const req: SongRequest = {
    id: `req_${Date.now()}_${counter++}`,
    song: data.song.slice(0, 120),
    artist: data.artist.slice(0, 80),
    dedication: data.dedication?.slice(0, 200),
    submittedAt: new Date().toISOString(),
    status: 'pending',
  }
  queue.unshift(req)
  if (queue.length > 100) queue.pop()
  return req
}

export function getQueue(): SongRequest[] {
  return [...queue]
}

export function getPending(): SongRequest[] {
  return queue.filter(r => r.status === 'pending')
}

export function getQueuePosition(id: string): number {
  const pending = getPending()
  const i = pending.findIndex(r => r.id === id)
  return i === -1 ? -1 : i + 1
}

export function updateStatus(id: string, status: SongRequest['status']): boolean {
  const req = queue.find(r => r.id === id)
  if (!req) return false
  req.status = status
  return true
}
