import { NextResponse } from 'next/server'

const STREAM_URL = 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida'
const META_INT   = 16000
const FALLBACK   = { title: 'En Vivo', artist: 'Radio Bienvenida 93.3 FM', raw: '' }

// Cache 20 segundos — no golpear el stream en cada request
let _cache: { data: NowPlayingMeta; ts: number } | null = null

export interface NowPlayingMeta {
  title:  string
  artist: string
  raw:    string
}

export async function GET() {
  if (_cache && Date.now() - _cache.ts < 20_000) {
    return NextResponse.json(_cache.data)
  }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 9_000)

    const res = await fetch(STREAM_URL, {
      headers: { 'Icy-MetaData': '1', 'User-Agent': 'PulsoRadio/1.0' },
      signal: ctrl.signal,
    })

    clearTimeout(timer)
    if (!res.ok || !res.body) throw new Error('bad response')

    // Necesitamos leer META_INT + 1 (byte de longitud) + hasta 255*16 (metadata)
    const NEED = META_INT + 1 + 255 * 16
    const reader = res.body.getReader()
    const chunks: Uint8Array[] = []
    let total = 0

    while (total < NEED) {
      const { done, value } = await reader.read()
      if (done || !value) break
      chunks.push(value)
      total += value.length
    }

    reader.cancel().catch(() => {})

    // Fusionar chunks en un único buffer
    const buf = new Uint8Array(total)
    let offset = 0
    for (const c of chunks) { buf.set(c, offset); offset += c.length }

    if (buf.length < META_INT + 1) throw new Error('not enough data')

    const metaLen = buf[META_INT] * 16
    if (metaLen === 0) {
      _cache = { data: FALLBACK, ts: Date.now() }
      return NextResponse.json(FALLBACK)
    }

    const metaStr = new TextDecoder('utf-8').decode(
      buf.slice(META_INT + 1, META_INT + 1 + metaLen)
    )

    // Formato habitual: StreamTitle='Artista - Título';
    const match = metaStr.match(/StreamTitle='([^']*)'/i)
    const raw   = match?.[1]?.trim() ?? ''

    if (!raw) {
      _cache = { data: FALLBACK, ts: Date.now() }
      return NextResponse.json(FALLBACK)
    }

    // Separar "Artista - Título" o dejar todo como título
    const sep = raw.indexOf(' - ')
    const artist = sep > 0 ? raw.slice(0, sep).trim() : 'Radio Bienvenida'
    const title  = sep > 0 ? raw.slice(sep + 3).trim() : raw

    const data: NowPlayingMeta = {
      title:  title  || 'En Vivo',
      artist: artist || 'Radio Bienvenida',
      raw,
    }

    _cache = { data, ts: Date.now() }
    return NextResponse.json(data)

  } catch {
    return NextResponse.json(FALLBACK)
  }
}
