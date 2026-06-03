// In-memory listener session tracker
// Each playing client pings every 30s; sessions expire after 90s

const sessions = new Map<string, number>()
const MAX_SESSIONS = 50_000

function cleanup() {
  const cutoff = Date.now() - 90_000
  for (const [id, lastSeen] of sessions) {
    if (lastSeen < cutoff) sessions.delete(id)
  }
}

export function joinListener(sessionId: string): { ok: true } | { ok: false; error: string } {
  cleanup()
  if (sessions.size >= MAX_SESSIONS && !sessions.has(sessionId)) {
    return { ok: false, error: 'Service busy' }
  }
  sessions.set(sessionId, Date.now())
  return { ok: true }
}

export function leaveListener(sessionId: string) {
  sessions.delete(sessionId)
}

export function getListenerCount(): number {
  cleanup()
  return sessions.size
}
