#!/usr/bin/env node
/**
 * security-audit.mjs — Pruebas de superficie de ataque (sin credenciales).
 * Uso: node scripts/security-audit.mjs
 *      AUDIT_BASE_URL=https://tu-app.vercel.app node scripts/security-audit.mjs
 */

const BASE = (process.env.AUDIT_BASE_URL || 'https://bbx-radio-9k9y.vercel.app').replace(/\/$/, '')
const errors = []
const warnings = []
const passed = []

function ok(msg) { passed.push(msg); console.log(`  ✓ ${msg}`) }
function fail(msg) { errors.push(msg); console.error(`  ✗ ${msg}`) }
function warn(msg) { warnings.push(msg); console.warn(`  ⚠ ${msg}`) }

async function fetchJson(path, init = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  let body = null
  const text = await res.text()
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  return { res, body, url }
}

async function expectStatus(path, init, expected, label) {
  const { res } = await fetchJson(path, init)
  if (res.status === expected) ok(`${label} → ${expected}`)
  else fail(`${label} → esperado ${expected}, recibido ${res.status}`)
  return res
}

async function expectStatuses(path, init, allowed, label) {
  const { res } = await fetchJson(path, init)
  if (allowed.includes(res.status)) ok(`${label} → ${res.status}`)
  else fail(`${label} → esperado uno de [${allowed.join(',')}], recibido ${res.status}`)
}

// ── 1. Endpoints admin sin sesión ─────────────────────────────
console.log('\n[1] Acceso admin sin autenticación')
const adminGets = [
  ['/api/saludos', 'GET saludos'],
  ['/api/registro', 'GET registro'],
  ['/api/solicitudes', 'GET solicitudes'],
  ['/api/admin/reports', 'GET reports'],
  ['/api/listeners/analytics', 'GET analytics'],
]
for (const [path, label] of adminGets) {
  await expectStatus(path, { method: 'GET' }, 401, label)
}

const { res: meRes, body: meBody } = await fetchJson('/api/admin/me', { method: 'GET' })
if (meRes.status === 200 && meBody?.authorized === false) ok('GET admin/me sin cookie → authorized:false')
else fail(`GET admin/me → esperado 200 authorized:false, recibido ${meRes.status} ${JSON.stringify(meBody)}`)

await expectStatus('/api/push/send', {
  method: 'POST',
  body: JSON.stringify({ title: 'x', body: 'y' }),
}, 401, 'POST push/send')

await expectStatus('/api/poll', { method: 'PUT', body: JSON.stringify({ question: 'q', optionA: 'a', optionB: 'b' }) }, 401, 'PUT poll (crear)')

await expectStatus('/api/admin/setup-v3', { method: 'POST', body: '{}' }, 401, 'POST setup-v3')

// ── 2. CSRF / origen cruzado ──────────────────────────────────
console.log('\n[2] Mutaciones con Origin falso')
const csrfBody = JSON.stringify({ para: 'a', de: 'b', motivo: 'cumpleanos' })
const { res: csrfRes } = await fetchJson('/api/saludos', {
  method: 'POST',
  body: csrfBody,
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://evil.example',
    Host: new URL(BASE).host,
  },
})
if (csrfRes.status === 403) ok('POST saludos con Origin malicioso → 403')
else fail(`POST saludos CSRF → esperado 403, recibido ${csrfRes.status}`)

// ── 3. Cron sin secreto ───────────────────────────────────────
console.log('\n[3] Cron y rutas sensibles')
await expectStatus('/api/cron/ops-check', { method: 'GET' }, 401, 'GET cron sin Bearer')
try {
  const cronQuery = await fetch(`${BASE}/api/cron/ops-check?secret=test`, { method: 'GET' })
  if (cronQuery.status === 401) ok('GET cron con ?secret= rechazado (solo Bearer)')
  else fail(`GET cron ?secret= → esperado 401, recibido ${cronQuery.status}`)
} catch (e) {
  fail(`GET cron ?secret= → error de red: ${e instanceof Error ? e.message : e}`)
}

// ── 4. Inyección / payloads maliciosos ────────────────────────
console.log('\n[4] Payloads maliciosos en formularios públicos')
const xssName = '<script>alert(1)</script>'
const { res: regRes, body: regBody } = await fetchJson('/api/registro', {
  method: 'POST',
  body: JSON.stringify({ name: xssName, phone: '912345678', _hp: '' }),
  headers: { Origin: BASE },
})
if ([201, 400, 429].includes(regRes.status)) ok(`POST registro XSS name → ${regRes.status} (sin 500)`)
else fail(`POST registro XSS → ${regRes.status}`)

const bigBody = JSON.stringify({ name: 'x', phone: '912345678', junk: 'A'.repeat(20_000) })
const { res: bigRes } = await fetchJson('/api/registro', {
  method: 'POST',
  body: bigBody,
  headers: { Origin: BASE },
})
if ([400, 429].includes(bigRes.status)) ok(`POST registro body grande → ${bigRes.status}`)
else if (bigRes.status === 201) warn('POST registro aceptó body >8KB — revisar readJsonBody')
else ok(`POST registro body grande → ${bigRes.status}`)

const { res: hpRes, body: hpBody } = await fetchJson('/api/saludos', {
  method: 'POST',
  body: JSON.stringify({ para: 'a', de: 'b', motivo: 'cumpleanos', _hp: 'bot-filled' }),
  headers: { Origin: BASE },
})
if (hpRes.status === 200 && hpBody?.ok === true) ok('Honeypot: respuesta silenciosa ok:true')
else fail(`Honeypot saludos → esperado 200 ok:true, recibido ${hpRes.status}`)

// ── 5. Rate limit (muestra) ───────────────────────────────────
console.log('\n[5] Rate limiting (muestra rápida)')
let rateHit = false
for (let i = 0; i < 25; i++) {
  const { res } = await fetchJson('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'probe', password: 'wrong-password-12' }),
    headers: { Origin: BASE },
  })
  if (res.status === 429) { rateHit = true; break }
}
if (rateHit) ok('admin/login devuelve 429 tras ráfaga')
else warn('admin/login: no se alcanzó 429 en 25 intentos (Upstash puede estar off en preview)')

// ── 6. Headers de seguridad ───────────────────────────────────
console.log('\n[6] Headers HTTP en página principal')
const home = await fetch(`${BASE}/`, { method: 'GET', redirect: 'follow' })
const requiredHeaders = [
  ['x-frame-options', 'DENY'],
  ['x-content-type-options', 'nosniff'],
  ['strict-transport-security', null],
  ['content-security-policy', null],
]
for (const [key, expected] of requiredHeaders) {
  const val = home.headers.get(key)
  if (!val) fail(`Falta header ${key}`)
  else if (expected && val.toLowerCase() !== expected.toLowerCase()) fail(`${key}: esperado ${expected}, tiene ${val}`)
  else ok(`Header ${key} presente`)
}

// ── 7. APIs públicas no filtran PII ───────────────────────────
console.log('\n[7] APIs públicas')
const { res: notifRes, body: notifBody } = await fetchJson('/api/notifications')
if (notifRes.status === 200) {
  if (notifBody && notifBody.dbError === undefined) ok('GET notifications sin dbError en prod')
  else if (notifBody?.dbError) warn('GET notifications expone dbError (¿NODE_ENV≠production en Vercel?)')
  else ok('GET notifications OK')
} else fail(`GET notifications → ${notifRes.status}`)

// ── 8. Stripe webhook sin firma ───────────────────────────────
console.log('\n[8] Webhook Stripe')
await expectStatus('/api/billing/webhook', { method: 'POST', body: '{}' }, 400, 'POST webhook sin firma')

// ── Resultado ─────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50))
console.log(`Base: ${BASE}`)
console.log(`Pasaron: ${passed.length}`)
if (warnings.length) {
  console.warn(`\n⚠  ${warnings.length} advertencia(s):`)
  warnings.forEach(w => console.warn(`   • ${w}`))
}
if (errors.length) {
  console.error(`\n❌ ${errors.length} fallo(s) de seguridad:\n`)
  errors.forEach(e => console.error(`   • ${e}`))
  process.exit(1)
}
console.log('\n✅ Auditoría de superficie completada sin fallos críticos\n')
