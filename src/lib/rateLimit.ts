import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'

export type RateLimitPreset =
  | 'adminLogin'
  | 'saludos'
  | 'songRequest'
  | 'registro'
  | 'listenerJoin'
  | 'listenerJoinGlobal'
  | 'listenerCount'
  | 'pushSubscribe'
  | 'pushSend'
  | 'pollVote'
  | 'adEvents'
  | 'apiGlobal'

const PRESETS: Record<RateLimitPreset, { max: number; window: `${number} ${'s' | 'm' | 'h' | 'd'}` }> = {
  adminLogin:          { max: 10,   window: '15 m' },
  saludos:             { max: 5,    window: '10 m' },
  songRequest:         { max: 3,    window: '10 m' },
  registro:            { max: 5,    window: '10 m' },
  listenerJoin:        { max: 60,   window: '1 m' },
  listenerJoinGlobal:  { max: 800,  window: '1 m' },
  listenerCount:       { max: 60,   window: '1 m' },
  pushSubscribe:       { max: 5,    window: '1 h' },
  pushSend:            { max: 10,   window: '1 h' },
  pollVote:            { max: 10,   window: '10 m' },
  adEvents:            { max: 120,  window: '1 m' },
  apiGlobal:           { max: 200,  window: '1 m' },
}

const memoryHits = new Map<string, number[]>()
let warnedNoRedis = false

let redis: Redis | null = null
const limiters = new Map<RateLimitPreset, Ratelimit>()

function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  redis = new Redis({ url, token })
  return redis
}

function getLimiter(preset: RateLimitPreset): Ratelimit | null {
  const r = getRedis()
  if (!r) return null
  let limiter = limiters.get(preset)
  if (!limiter) {
    const { max, window } = PRESETS[preset]
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `pulso:${preset}`,
      analytics: false,
    })
    limiters.set(preset, limiter)
  }
  return limiter
}

function parseWindowMs(window: string): number {
  const [n, unit] = window.split(' ')
  const v = Number(n)
  if (unit === 's') return v * 1000
  if (unit === 'm') return v * 60_000
  if (unit === 'h') return v * 3_600_000
  if (unit === 'd') return v * 86_400_000
  return 60_000
}

function effectiveMax(preset: RateLimitPreset): number {
  const { max } = PRESETS[preset]
  if (process.env.NODE_ENV === 'production' && !getRedis()) {
    if (!warnedNoRedis) {
      warnedNoRedis = true
      console.warn('[rateLimit] UPSTASH_REDIS no configurado — límites en memoria reducidos. Configura Upstash en producción.')
    }
    return Math.max(1, Math.floor(max * 0.2))
  }
  return max
}

async function memoryRateLimit(key: string, preset: RateLimitPreset): Promise<boolean> {
  const { window } = PRESETS[preset]
  const max = effectiveMax(preset)
  const windowMs = parseWindowMs(window)
  const now = Date.now()
  const hits = (memoryHits.get(key) ?? []).filter(t => now - t < windowMs)
  if (hits.length >= max) return false
  hits.push(now)
  memoryHits.set(key, hits)
  return true
}

export function getClientIp(req: NextRequest | Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Returns true if the request is allowed. */
export async function checkRateLimit(
  preset: RateLimitPreset,
  identifier: string,
): Promise<boolean> {
  const key = identifier.slice(0, 128)
  const limiter = getLimiter(preset)
  if (limiter) {
    const { success } = await limiter.limit(key)
    return success
  }
  return memoryRateLimit(key, preset)
}

export async function rateLimitByIp(
  req: NextRequest | Request,
  preset: RateLimitPreset,
): Promise<boolean> {
  return checkRateLimit(preset, getClientIp(req))
}

export function isProductionRateLimitConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
