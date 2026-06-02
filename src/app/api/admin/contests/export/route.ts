import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 })

  const { data } = await supabaseAdmin
    .from('listener_registrations')
    .select('name, phone, registered_at')
    .eq('contest', slug)
    .order('registered_at', { ascending: true })

  const rows = data ?? []
  const header = 'nombre,telefono,fecha\n'
  const csv = header + rows.map(r =>
    `"${String(r.name).replace(/"/g, '""')}","${r.phone}","${r.registered_at}"`,
  ).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${slug}.csv"`,
    },
  })
}
