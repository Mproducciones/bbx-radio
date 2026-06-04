'use client'

import { useState, useEffect } from 'react'
import { reportWhatsAppUrl } from '@/lib/reportShare'
import { AdminCard, AdminCardHeader, AdminIcons, AdminSpinner } from './adminUi'

type Report = {
  month: string
  listeners: { avg: number; peak: number; samples: number }
  ads: { impressions: number; clicks: number; ctr: number; byCampaign: { adId: string; adTipo: string; impressions: number; clicks: number; ctr: number }[] }
  engagement: { registrationsTotal: number; songRequests: number; pollsClosed: number }
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export function ReportsPanel() {
  const [month, setMonth] = useState(currentMonth())
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/reports?month=${month}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(setReport)
      .finally(() => setLoading(false))
  }, [month])

  return (
    <AdminCard accent="#00D9A0">
      <AdminCardHeader
        title="Reporte mensual"
        icon={<AdminIcons.chart />}
        action={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="rounded-lg px-2 py-1 text-white text-xs bg-black/30 border border-white/10"
            />
            <a
              href={`/api/admin/reports?month=${month}&format=csv`}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-[#07070E]"
              style={{ background: '#00D9A0' }}
            >
              CSV ↓
            </a>
            {report && (
              <a
                href={reportWhatsAppUrl({
                  month: report.month,
                  listeners: report.listeners,
                  ads: report.ads,
                  engagement: report.engagement,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white"
                style={{ background: '#128C7E' }}
              >
                WA anunciante
              </a>
            )}
          </div>
        }
      />

      {loading ? (
        <AdminSpinner />
      ) : !report ? (
        <p className="py-8 text-center text-[#444468] text-xs">No se pudo cargar el reporte.</p>
      ) : (
        <div className="admin-card-body space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Oyentes prom.', value: report.listeners.avg, accent: '#40B9BF' },
              { label: 'Pico oyentes', value: report.listeners.peak, accent: '#7D59B5' },
              { label: 'Impresiones', value: report.ads.impressions, accent: '#db8918' },
              { label: 'Clics banner', value: report.ads.clicks, accent: '#db8918' },
              { label: 'CTR', value: `${report.ads.ctr}%`, accent: '#00D9A0' },
              { label: 'Registros sorteo', value: report.engagement.registrationsTotal, accent: '#FF006E' },
            ].map(k => (
              <div key={k.label} className="rounded-xl px-3 py-2.5" style={{ background: '#0A0A12', border: '1px solid #1A1A2E' }}>
                <p className="text-[#444468] text-[9px] uppercase tracking-wider">{k.label}</p>
                <p className="text-lg font-bold leading-none mt-1" style={{ color: k.accent }}>{k.value}</p>
              </div>
            ))}
          </div>

          {report.ads.byCampaign.length > 0 && (
            <div>
              <p className="text-[#444468] text-[10px] uppercase tracking-wider mb-2">Por campaña</p>
              <div className="space-y-1.5">
                {report.ads.byCampaign.map(row => (
                  <div key={row.adId} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg" style={{ background: '#0A0A12' }}>
                    <span className="text-white/70 truncate max-w-[45%] font-mono text-[10px]">{row.adId.slice(0, 12)}…</span>
                    <span className="text-[#444468]">{row.adTipo}</span>
                    <span className="text-white/50">{row.impressions} imp · {row.clicks} clk · {row.ctr}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[#333355] text-[9px] text-center">
            Entrega este reporte a anunciantes · {report.engagement.songRequests} pedidos · {report.engagement.pollsClosed} votaciones cerradas
          </p>
        </div>
      )}
    </AdminCard>
  )
}
