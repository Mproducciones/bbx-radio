/**
 * Ejecuta supabase-setup-v3.sql contra Postgres.
 * Uso: DATABASE_URL="postgresql://..." node scripts/run-supabase-v3.mjs
 */
import fs from 'fs'
import path from 'path'
import pg from 'pg'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SQL_PATH = path.join(__dirname, '..', 'supabase-setup-v3.sql')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ethfuejqszfsoukyrebu.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

async function checkTablesViaRest() {
  if (!SERVICE_KEY) return { status: 0, body: 'no key' }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ad_events?select=id&limit=1`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
  return { status: res.status, body: await res.text() }
}

function poolerUrls(ref, password) {
  const regions = ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'sa-east-1']
  const hosts = [
    `db.${ref}.supabase.co:5432`,
    ...regions.map(r => `aws-0-${r}.pooler.supabase.com:6543`),
    ...regions.map(r => `aws-0-${r}.pooler.supabase.com:5432`),
  ]
  const users = [`postgres`, `postgres.${ref}`]
  return hosts.flatMap(host =>
    users.map(user => `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/postgres`),
  )
}

async function runSql(connectionString) {
  const sql = fs.readFileSync(SQL_PATH, 'utf8')
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query(sql)
  await client.end()
}

async function runViaManagement() {
  const token = process.env.SUPABASE_ACCESS_TOKEN
  if (!token || !REF) return false
  const sql = fs.readFileSync(SQL_PATH, 'utf8')
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) throw new Error(`Management API ${res.status}: ${await res.text()}`)
  return true
}

async function main() {
  console.log('Comprobando tablas…')
  const before = await checkTablesViaRest()
  if (before.status === 200) {
    console.log('✓ ad_events ya existe')
    process.exit(0)
  }
  console.log(`ad_events no existe (${before.status})`)

  const dbUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL
  const candidates = dbUrl ? [dbUrl] : SERVICE_KEY ? poolerUrls(REF, SERVICE_KEY) : []

  for (const url of candidates) {
    try {
      await runSql(url)
      const after = await checkTablesViaRest()
      if (after.status === 200) {
        console.log('✓ Migración v3 aplicada')
        process.exit(0)
      }
    } catch {
      /* try next */
    }
  }

  try {
    if (await runViaManagement()) {
      const after = await checkTablesViaRest()
      if (after.status === 200) {
        console.log('✓ Migración v3 vía Management API')
        process.exit(0)
      }
    }
  } catch (e) {
    console.warn(String(e.message ?? e))
  }

  console.error('No pude ejecutar DDL. Falta DATABASE_URL o SUPABASE_ACCESS_TOKEN.')
  console.error('Pega supabase-setup-v3.sql en Supabase → SQL Editor → Run.')
  process.exit(2)
}

main()
