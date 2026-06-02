import { SPONSOR_WA } from '@/lib/sponsorContent'

type ReportSummary = {
  month: string
  listeners: { avg: number; peak: number }
  ads: { impressions: number; clicks: number; ctr: number }
  engagement: { registrationsTotal: number; songRequests: number }
}

export function reportWhatsAppMessage(report: ReportSummary, radioName = 'Radio Bienvenida 93.3 FM') {
  const lines = [
    `Reporte publicidad ${report.month} — ${radioName}`,
    '',
    `Oyentes promedio: ${report.listeners.avg}`,
    `Pico oyentes: ${report.listeners.peak}`,
    `Impresiones banner: ${report.ads.impressions}`,
    `Clics: ${report.ads.clicks}`,
    `CTR: ${report.ads.ctr}%`,
    `Registros sorteos: ${report.engagement.registrationsTotal}`,
    `Pedidos de tema: ${report.engagement.songRequests}`,
    '',
    'Reporte generado desde panel BBX.',
  ]
  return lines.join('\n')
}

export function reportWhatsAppUrl(report: ReportSummary) {
  return `https://wa.me/${SPONSOR_WA}?text=${encodeURIComponent(reportWhatsAppMessage(report))}`
}
