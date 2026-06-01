// In-memory listener session tracker
// Each playing client pings every 30s; sessions expire after 90s

const sessions = new Map<string, number>()

function cleanup() {
  const cutoff = Date.now() - 90_000
  for (const [id, lastSeen] of sessions) {
    if (lastSeen < cutoff) sessions.delete(id)
  }
}

export function joinListener(sessionId: string) {
  cleanup()
  sessions.set(sessionId, Date.now())
}

export function leaveListener(sessionId: string) {
  sessions.delete(sessionId)
}

export function getListenerCount(): number {
  cleanup()
  return sessions.size
}
