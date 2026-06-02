import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import pg from 'pg'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    return NextResponse.json({
      error: 'DATABASE_URL no configurada en Vercel',
      hint: 'Supabase → Settings → Database → Connection string (URI). Agregar como DATABASE_URL en Vercel.',
    }, { status: 503 })
  }

  const sqlPath = path.join(process.cwd(), 'supabase-setup-v3.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()
    await client.query(sql)
    await client.end()
    return NextResponse.json({ ok: true, message: 'Tablas ad_events y contests creadas' })
  } catch (e) {
    await client.end().catch(() => {})
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 })
  }
}
