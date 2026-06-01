// In-memory poll — el admin activa un duelo entre 2 canciones en tiempo real

export interface PollOption {
  id: string
  title: string
  artist: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  options: [PollOption, PollOption]
  active: boolean
  createdAt: string
  totalVotes: number
}

let currentPoll: Poll | null = {
  id: 'default',
  question: '¿Cuál quieres que suene ahora?',
  options: [
    { id: 'a', title: 'Hawái', artist: 'Maluma', votes: 0 },
    { id: 'b', title: 'Tusa', artist: 'KAROL G', votes: 0 },
  ],
  active: true,
  createdAt: new Date().toISOString(),
  totalVotes: 0,
}

// sessionId → optionId (evitar doble voto)
const votes = new Map<string, string>()

export function getPoll(): Poll | null { return currentPoll }

export function setPoll(q: string, a: { title: string; artist: string }, b: { title: string; artist: string }) {
  votes.clear()
  currentPoll = {
    id: Date.now().toString(),
    question: q,
    options: [
      { id: 'a', ...a, votes: 0 },
      { id: 'b', ...b, votes: 0 },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    totalVotes: 0,
  }
}

export function vote(sessionId: string, optionId: string): { ok: boolean; alreadyVoted: boolean } {
  if (!currentPoll?.active) return { ok: false, alreadyVoted: false }
  if (votes.has(sessionId)) return { ok: false, alreadyVoted: true }

  const opt = currentPoll.options.find(o => o.id === optionId)
  if (!opt) return { ok: false, alreadyVoted: false }

  opt.votes++
  currentPoll.totalVotes++
  votes.set(sessionId, optionId)
  return { ok: true, alreadyVoted: false }
}

export function closePoll() {
  if (currentPoll) currentPoll.active = false
}

export function getVote(sessionId: string): string | null {
  return votes.get(sessionId) ?? null
}
