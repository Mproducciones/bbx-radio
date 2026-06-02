import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { getAdTotals } from '@/lib/adEventsStore'
import { buildMonthlyReport, reportToCsv } from '@/lib/reportsStore'

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const month = req.nextUrl.searchParams.get('month') ?? new Date().toISOString().slice(0, 7)
  const format = req.nextUrl.searchParams.get('format')

  if (format === 'csv') {
    const report = await buildMonthlyReport(month)
    return new NextResponse(reportToCsv(report), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reporte-${month}.csv"`,
      },
    })
  }

  if (req.nextUrl.searchParams.get('scope') === 'ads') {
    const ads = await getAdTotals(month)
    return NextResponse.json(ads)
  }

  const report = await buildMonthlyReport(month)
  return NextResponse.json(report)
}
