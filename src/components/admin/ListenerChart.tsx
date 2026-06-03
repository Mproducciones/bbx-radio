'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AdminCard, AdminSpinner, AdminSegment, AdminCardHeader, AdminIcons } from './adminUi'

interface DataPoint { recorded_at: string; count: number }

function Sparkline({ data, color }: { data: DataPoint[]; color: string }) {
  if (data.length < 2) return (
    <div className="flex items-center justify-center h-full text-white/20 text-xs">
      El gráfico se irá llenando con el tiempo
    </div>
  )

  const W = 320, H = 80
  const counts = data.map(d => d.count)
  const max = Math.max(...counts, 1)
  const min = Math.min(...counts)
  const range = max - min || 1

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d.count - min) / range) * (H * 0.8) - H * 0.1
    return `${x},${y}`
  })

  const path = `M ${pts.join(' L ')}`
  const fill = `M 0,${H} L ${pts.join(' L ')} L ${W},${H} Z`

  const peak = Math.max(...counts)
  const peakIdx = counts.indexOf(peak)
  const peakX = (peakIdx / (data.length - 1)) * W
  const peakY = H - ((peak - min) / range) * (H * 0.8) - H * 0.1

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#grad)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Peak dot */}
        <circle cx={peakX} cy={peakY} r="4" fill={color} />
      </svg>
      {/* Peak label */}
      <div
        className="absolute text-[9px] font-bold pointer-events-none"
        style={{
          color,
          left: `${(peakIdx / (data.length - 1)) * 100}%`,
          top: `${((peakY / H) * 100) - 16}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {peak} máx
      </div>
    </div>
  )
}

function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

export function ListenerChart() {
  const [data, setData]   = useState<DataPoint[]>([])
  const [peak, setPeak]   = useState(0)
  const [range, setRange] = useState<24 | 48>(24)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/listeners/analytics?hours=${range}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setData(d.series ?? [])
        setPeak(d.peak ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [range])

  return (
    <AdminCard accent="#db8918">
      <AdminCardHeader title="Tendencia de oyentes" icon={<AdminIcons.chart />} accent="#db8918" />
      <div className="p-4 pt-3">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="min-w-0">
          {peak > 0 && (
            <p className="text-white/45 text-[10px]">
              Pico de <span className="text-[#db8918] font-bold">{peak}</span> oyentes en las últimas {range}h
            </p>
          )}
        </div>
        <AdminSegment
          accent="#db8918"
          value={range}
          onChange={v => setRange(v as 24 | 48)}
          options={[
            { value: 24, label: '24h' },
            { value: 48, label: '48h' },
          ]}
        />
      </div>

      {loading ? (
        <AdminSpinner />
      ) : (
        <Sparkline data={data} color="#db8918" />
      )}

      {/* Timestamps */}
      {data.length >= 2 && (
        <div className="flex justify-between mt-1">
          <span className="text-white/20 text-[9px]">{formatHour(data[0].recorded_at)}</span>
          <span className="text-white/20 text-[9px]">{formatHour(data[data.length - 1].recorded_at)}</span>
        </div>
      )}
      </div>
    </AdminCard>
  )
}
