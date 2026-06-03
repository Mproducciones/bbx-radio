'use client'

import { useState, useEffect } from 'react'
import { AdminCard, AdminKpi, AdminKpiGrid, AdminIcons } from './adminUi'

interface Stats {
  listeners: number
  registrations: number
  requests: number
}

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats>({ listeners: 0, registrations: 0, requests: 0 })

  useEffect(() => {
    async function load() {
      const [lRes, rRes, sRes] = await Promise.allSettled([
        fetch('/api/listeners/count'),
        fetch('/api/registro', { credentials: 'include' }),
        fetch('/api/solicitudes', { credentials: 'include' }),
      ])
      const listeners = lRes.status === 'fulfilled' ? (await lRes.value.json()).count : 0
      const regData = rRes.status === 'fulfilled' ? await rRes.value.json() : null
      const requests = sRes.status === 'fulfilled'
        ? (await sRes.value.json()).filter((r: { status: string }) => r.status === 'pending').length
        : 0
      setStats({ listeners, registrations: regData?.stats?.total ?? 0, requests })
    }
    load()
    const t = setInterval(load, 10_000)
    return () => clearInterval(t)
  }, [])

  return (
    <AdminCard accent="#40B9BF" className="h-full">
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <p className="text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">Métricas en tiempo real</p>
        <AdminKpiGrid>
          <AdminKpi value={stats.listeners} sub="oyentes activos" color="#db8918" icon={<AdminIcons.radio />} />
          <AdminKpi value={stats.registrations} sub="leads capturados" color="#40B9BF" icon={<AdminIcons.users />} />
          <AdminKpi value={stats.requests} sub="pendientes hoy" color="#7D59B5" icon={<AdminIcons.music />} />
        </AdminKpiGrid>
      </div>
    </AdminCard>
  )
}
