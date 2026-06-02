import { getAdTotals } from './adEventsStore'
import { getListenerPeak, getListenerTimeSeries } from './analyticsStore'
import { getStats as getRegistryStats } from './registryStore'
import { supabaseAdmin } from './supabase'

const RADIO_ID = process.env.NEXT_PUBLIC_RADIO_ID ?? 'bienvenida-933'

function monthRange(month: string) {
  const [y, m] = month.split('-').map(Number)
  return {
    start: new Date(Date.UTC(y, m - 1, 1)).toISOString(),
    end: new Date(Date.UTC(y, m, 1)).toISOString(),
    label: `${y}-${String(m).padStart(2, '0')}`,
  }
}

export async function buildMonthlyReport(month: string) {
  const { start, end, label } = monthRange(month)
  const hoursInMonth = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 3_600_000)

  const [ads, registry, songCount, pollCount] = await Promise.all([
    getAdTotals(month),
    getRegistryStats(),
    supabaseAdmin
      .from('song_requests')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', start)
      .lt('submitted_at', end),
    supabaseAdmin
      .from('poll_results')
      .select('*', { count: 'exact', head: true })
      .eq('radio_id', RADIO_ID)
      .gte('closed_at', start)
      .lt('closed_at', end),
  ])

  const series = await getListenerTimeSeries(Math.min(hoursInMonth, 720))
  const monthSeries = series.filter(p => p.recorded_at >= start && p.recorded_at < end)
  const avgListeners = monthSeries.length
    ? Math.round(monthSeries.reduce((s, p) => s + p.count, 0) / monthSeries.length)
    : 0
  const peakListeners = monthSeries.length
    ? Math.max(...monthSeries.map(p => p.count))
    : await getListenerPeak(720)

  return {
    month: label,
    generatedAt: new Date().toISOString(),
    radioId: RADIO_ID,
    listeners: { avg: avgListeners, peak: peakListeners, samples: monthSeries.length },
    ads: {
      impressions: ads.impressions,
      clicks: ads.clicks,
      ctr: ads.impressions > 0 ? Math.round((ads.clicks / ads.impressions) * 1000) / 10 : 0,
      byCampaign: ads.byAd,
    },
    engagement: {
      registrationsTotal: registry.total,
      registrationsByContest: registry.byContest,
      songRequests: songCount.count ?? 0,
      pollsClosed: pollCount.count ?? 0,
    },
  }
}

export function reportToCsv(report: Awaited<ReturnType<typeof buildMonthlyReport>>): string {
  const lines = [
    `Reporte mensual,${report.month}`,
    `Generado,${report.generatedAt}`,
    '',
    'Métrica,Valor',
    `Oyentes promedio,${report.listeners.avg}`,
    `Pico oyentes,${report.listeners.peak}`,
    `Impresiones banner,${report.ads.impressions}`,
    `Clics banner,${report.ads.clicks}`,
    `CTR %,${report.ads.ctr}`,
    `Registros sorteos,${report.engagement.registrationsTotal}`,
    `Pedidos de tema,${report.engagement.songRequests}`,
    '',
    'Campaña,Tipo,Impresiones,Clics,CTR%',
  ]
  for (const row of report.ads.byCampaign) {
    lines.push(`${row.adId},${row.adTipo},${row.impressions},${row.clicks},${row.ctr}`)
  }
  return lines.join('\n')
}
