'use client'

import { useEffect, useMemo, useState } from 'react'
import type { RadioConfig } from '@/types/radio'
import { locationDisplayLabel, weatherFromCode } from '@/lib/weather'

interface WeatherPayload {
  temp: number
  code: number
}

interface RadioLocaleBarProps {
  radio: RadioConfig
  accent?: string
  className?: string
  /** Versión compacta para móvil bajo el header del home */
  compact?: boolean
}

function formatChileTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())
  } catch {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
}

async function fetchWeatherDirect(
  lat: number,
  lon: number,
  timezone: string,
): Promise<WeatherPayload | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('timezone', timezone)

  const res = await fetch(url.toString())
  if (!res.ok) return null
  const data = await res.json()
  const current = data?.current
  if (!current) return null
  return {
    temp: Math.round(current.temperature_2m),
    code: current.weather_code as number,
  }
}

export function RadioLocaleBar({
  radio,
  accent = 'var(--color-mag-400)',
  className = '',
  compact = false,
}: RadioLocaleBarProps) {
  const timezone = radio.location?.timezone ?? 'America/Santiago'
  const lat = radio.location?.lat ?? -34.1708
  const lon = radio.location?.lon ?? -70.7444

  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('--:--')
  const [weather, setWeather] = useState<WeatherPayload | null>(null)
  const [weatherError, setWeatherError] = useState(false)

  const placeLabel = useMemo(
    () => locationDisplayLabel(radio.city, radio.country, radio.location?.label),
    [radio.city, radio.country, radio.location?.label],
  )

  useEffect(() => {
    setMounted(true)
    const tick = () => setTime(formatChileTime(timezone))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [timezone])

  useEffect(() => {
    if (!mounted) return

    let cancelled = false

    async function load() {
      const params = new URLSearchParams({ tz: timezone, lat: String(lat), lon: String(lon) })

      try {
        const res = await fetch(`/api/weather?${params}`)
        if (res.ok) {
          const data = (await res.json()) as WeatherPayload
          if (!cancelled) {
            setWeather(data)
            setWeatherError(false)
            return
          }
        }
      } catch {
        /* fallback abajo */
      }

      try {
        const data = await fetchWeatherDirect(lat, lon, timezone)
        if (!cancelled) {
          if (data) {
            setWeather(data)
            setWeatherError(false)
          } else {
            setWeather(null)
            setWeatherError(true)
          }
        }
      } catch {
        if (!cancelled) {
          setWeather(null)
          setWeatherError(true)
        }
      }
    }

    load()
    const id = window.setInterval(load, 15 * 60_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [mounted, lat, lon, timezone])

  const wx = weather ? weatherFromCode(weather.code) : null

  return (
    <div
      className={`flex items-center justify-between gap-2 w-full min-w-0 rounded-xl relative z-[3] ${
        compact ? 'py-2 px-3 text-xs' : 'py-2.5 px-3.5 text-sm'
      } ${className}`}
      style={{
        background: 'rgba(7,7,14,0.88)',
        border: '1px solid rgba(219,137,24,0.22)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      }}
      aria-label={`Ubicación ${placeLabel}, hora y clima`}
    >
      <span
        className={`font-bold truncate min-w-0 ${compact ? 'text-xs' : 'text-sm'}`}
        style={{ color: 'rgba(255,255,255,0.75)' }}
        title={placeLabel}
      >
        {placeLabel}
      </span>

      <div
        className={`flex items-center gap-2 flex-shrink-0 font-bold tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}
      >
        <time dateTime={time} style={{ color: accent }} title="Hora Chile">
          {mounted ? time : '--:--'}
        </time>
        <span className="w-px h-4 bg-white/15" aria-hidden />
        {wx && weather ? (
          <span
            className="flex items-center gap-1"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            title={wx.label}
          >
            <span className="text-base leading-none" aria-hidden>{wx.emoji}</span>
            <span>{weather.temp}°</span>
          </span>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.35)' }} title={weatherError ? 'Clima no disponible' : 'Cargando'}>
            {weatherError ? '—' : '…'}
          </span>
        )}
      </div>
    </div>
  )
}
