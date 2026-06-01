// Registro de oyentes para sorteos — base de datos de leads

export interface Listener {
  id: string
  name: string
  phone: string   // WhatsApp
  registeredAt: string
  contest: string // nombre del sorteo al que se inscribió
}

const registry: Listener[] = []
let counter = 1

// IP rate limit — 1 registro por IP por sorteo
const ipLog = new Map<string, Set<string>>()

export function register(data: { name: string; phone: string; contest: string }, ip: string): { ok: boolean; position: number; error?: string } {
  const cleanPhone = data.phone.replace(/\D/g, '')
  if (cleanPhone.length < 8) return { ok: false, position: 0, error: 'Número inválido' }

  const key = `${ip}-${data.contest}`
  if (!ipLog.has(ip)) ipLog.set(ip, new Set())
  const contests = ipLog.get(ip)!
  if (contests.has(data.contest)) return { ok: false, position: 0, error: 'Ya estás inscrito en este sorteo' }
  contests.add(data.contest)

  const listener: Listener = {
    id: `listener_${counter++}`,
    name: data.name.trim().slice(0, 60),
    phone: cleanPhone,
    registeredAt: new Date().toISOString(),
    contest: data.contest,
  }
  registry.push(listener)
  return { ok: true, position: registry.filter(l => l.contest === data.contest).length }
}

export function getAll(): Listener[] { return [...registry] }

export function getByContest(contest: string): Listener[] {
  return registry.filter(l => l.contest === contest)
}

export function getStats() {
  const byContest: Record<string, number> = {}
  for (const l of registry) {
    byContest[l.contest] = (byContest[l.contest] ?? 0) + 1
  }
  return { total: registry.length, byContest }
}
