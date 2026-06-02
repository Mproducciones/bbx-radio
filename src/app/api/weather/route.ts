import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 900

interface GeoResult {
  latitude: number
  longitude: number
  name: string
}

async function geocode(city: string, country: string): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    name: city,
    count: '1',
    language: 'es',
    format: 'json',
  })
  if (country.length <= 3) params.set('country', country.toUpperCase())

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) return null
  const data = await res.json()
  const hit = data?.results?.[0]
  if (!hit?.latitude || !hit?.longitude) return null
  return { latitude: hit.latitude, longitude: hit.longitude, name: hit.name }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  let lat = searchParams.get('lat')
  let lon = searchParams.get('lon')
  const city = searchParams.get('city')
  const country = searchParams.get('country') ?? 'CL'
  const timezone = searchParams.get('tz') ?? 'America/Santiago'

  if (!lat || !lon) {
    if (!city) {
      return NextResponse.json({ error: 'Faltan coordenadas o ciudad' }, { status: 400 })
    }
    const geo = await geocode(city, country)
    if (!geo) {
      return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 })
    }
    lat = String(geo.latitude)
    lon = String(geo.longitude)
  }

  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast')
  forecastUrl.searchParams.set('latitude', lat)
  forecastUrl.searchParams.set('longitude', lon)
  forecastUrl.searchParams.set('current', 'temperature_2m,weather_code')
  forecastUrl.searchParams.set('timezone', timezone)

  const res = await fetch(forecastUrl.toString(), { next: { revalidate: 900 } })
  if (!res.ok) {
    return NextResponse.json({ error: 'Clima no disponible' }, { status: 502 })
  }

  const data = await res.json()
  const current = data?.current
  if (!current) {
    return NextResponse.json({ error: 'Sin datos de clima' }, { status: 502 })
  }

  return NextResponse.json({
    temp: Math.round(current.temperature_2m),
    code: current.weather_code as number,
    updatedAt: current.time as string,
  })
}
