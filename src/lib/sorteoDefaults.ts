/** Datos de respaldo — pintan el sorteo al instante mientras llega la API. */
export type ActiveContestClient = {
  id: string
  title: string
  prize: string
  description: string | null
  sponsorName: string | null
  deadline: string | null
  imageUrl: string | null
}

export const SORTEO_FALLBACK: ActiveContestClient = {
  id: 'sorteo-bienvenida',
  title: 'Sorteo en vivo',
  prize: 'Premio sorpresa de un patrocinador',
  description: 'Regístrate y el locutor anuncia al ganador en la programación.',
  sponsorName: 'Patrocinador Bienvenida',
  deadline: 'Esta semana',
  imageUrl: null,
}

let cache: ActiveContestClient | null | undefined
let inflight: Promise<ActiveContestClient | null | undefined> | null = null

export function getCachedActiveContest(): ActiveContestClient | null | undefined {
  return cache
}

/** Precarga en Participa — el tab Sorteo abre con datos ya en memoria. `null` = sin concurso; `undefined` = fallo de red. */
export function prefetchActiveContest(): Promise<ActiveContestClient | null | undefined> {
  if (cache !== undefined) return Promise.resolve(cache)
  if (inflight) return inflight

  inflight = fetch('/api/contests/active', { credentials: 'same-origin' })
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      const next = data?.id ? (data as ActiveContestClient) : null
      cache = next
      return next
    })
    .catch(() => undefined)
    .finally(() => {
      inflight = null
    })

  return inflight
}
