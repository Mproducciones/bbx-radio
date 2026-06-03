#!/usr/bin/env node
/**
 * validate.mjs — BBX pre-publish checker
 * Corre antes de cada git push para detectar errores antes de publicar.
 * También se ejecuta en GitHub Actions CI en cada push a main.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { execSync } from 'child_process'

const ROOT = process.cwd()
const errors = []
const warnings = []

function ok(msg)   { console.log(`  ✓ ${msg}`) }
function fail(msg) { console.error(`  ✗ ${msg}`); errors.push(msg) }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings.push(msg) }

// ── 1. manifest.json ──────────────────────────────────────────
console.log('\n[1/7] manifest.json')
const manifestPath = join(ROOT, 'public/manifest.json')

if (!existsSync(manifestPath)) {
  fail('public/manifest.json no existe')
} else {
  let manifest
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) }
  catch (e) { fail(`manifest.json JSON inválido → ${e.message}`) }

  if (manifest) {
    for (const field of ['name', 'short_name', 'start_url', 'display', 'icons']) {
      if (!manifest[field]) fail(`manifest.json: falta campo "${field}"`)
      else ok(`campo "${field}" presente`)
    }

    if (Array.isArray(manifest.icons)) {
      const sizes = manifest.icons.map(i => i.sizes)
      if (!sizes.includes('192x192')) fail('manifest.json: falta ícono 192x192 (requerido por Android)')
      else ok('ícono 192x192 declarado')
      if (!sizes.includes('512x512')) fail('manifest.json: falta ícono 512x512 (requerido para installable)')
      else ok('ícono 512x512 declarado')

      for (const icon of manifest.icons) {
        const src = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src
        if (!existsSync(join(ROOT, 'public', src))) fail(`ícono declarado pero archivo no existe → ${icon.src}`)
        else ok(`archivo existe → ${icon.src}`)
      }

      const hasMaskable = manifest.icons.some(i => i.purpose?.includes('maskable'))
      if (!hasMaskable) warn('ningún ícono tiene purpose "maskable" (recomendado para Android)')
      else ok('ícono maskable presente')
    }

    if (!['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
      fail(`manifest.json: display "${manifest.display}" no válido`)
    } else ok(`display "${manifest.display}" válido`)
  }
}

// ── 2. Service Worker ─────────────────────────────────────────
console.log('\n[2/7] Service Worker')
const swPath = join(ROOT, 'public/sw.js')

if (!existsSync(swPath)) {
  fail('public/sw.js no existe')
} else {
  const sw = readFileSync(swPath, 'utf8')
  if (!sw.includes('skipWaiting'))   warn('sw.js: no llama a skipWaiting()')
  else ok('skipWaiting() presente')
  if (!sw.includes('clients.claim')) warn('sw.js: no llama a clients.claim()')
  else ok('clients.claim() presente')
  ok('sw.js existe')
}

// ── 3. Archivos críticos ──────────────────────────────────────
console.log('\n[3/7] Archivos críticos')
const criticalFiles = [
  'src/lib/radioConfig.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/hooks/RadioPlayerContext.tsx',
]

for (const file of criticalFiles) {
  if (!existsSync(join(ROOT, file))) fail(`falta archivo crítico → ${file}`)
  else ok(file)
}

// ── 4. TypeScript ─────────────────────────────────────────────
console.log('\n[4/7] TypeScript')
try {
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' })
  ok('sin errores de TypeScript')
} catch (e) {
  const out = e.stdout?.toString() || e.stderr?.toString() || ''
  fail(`errores de TypeScript:\n${out.slice(0, 800)}`)
}

// ── 5. Código fuente — patrones problemáticos ─────────────────
console.log('\n[5/7] Calidad de código')

function walkSrc(dir, exts = ['.ts', '.tsx']) {
  const results = []
  if (!existsSync(dir)) return results
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) results.push(...walkSrc(full, exts))
    else if (exts.includes(extname(name))) results.push(full)
  }
  return results
}

const srcFiles = walkSrc(join(ROOT, 'src'))
let consoleCount = 0
let anyCount = 0
let hardcodedSecrets = 0

for (const file of srcFiles) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '')
  const content = readFileSync(file, 'utf8')
  const lines = content.split('\n')

  lines.forEach((line, i) => {
    // console.log en código de producción (excluir admin y scripts)
    if (
      line.includes('console.log(') &&
      !rel.includes('admin') &&
      !rel.includes('scripts') &&
      !line.trim().startsWith('//')
    ) {
      consoleCount++
      if (consoleCount <= 3) warn(`console.log en producción → ${rel}:${i + 1}`)
    }

    // `any` explícito sin justificación
    if (/:\s*any\b/.test(line) && !line.includes('//') && !line.includes('eslint-disable')) {
      anyCount++
    }

    // Posibles secretos hardcodeados (patrones básicos)
    if (
      /(?:password|secret|apikey|api_key)\s*=\s*['"][^'"]{6,}/i.test(line) &&
      !line.includes('process.env') &&
      !line.includes('//') &&
      !rel.includes('.env')
    ) {
      hardcodedSecrets++
      warn(`posible secreto hardcodeado → ${rel}:${i + 1}`)
    }
  })
}

if (consoleCount === 0) ok('sin console.log en código de producción')
else if (consoleCount > 3) warn(`${consoleCount} console.log en producción (solo mostramos los primeros 3)`)

if (anyCount === 0) ok('sin tipos `any` explícitos')
else warn(`${anyCount} uso(s) de tipo \`any\` — revisar si son necesarios`)

if (hardcodedSecrets === 0) ok('sin secretos hardcodeados detectados')

// ── 6. Android APK (Capacitor) ────────────────────────────────
console.log('\n[6/7] Android APK')
const mainActivity = join(ROOT, 'android/app/src/main/java/cl/radiobienvenida/app/MainActivity.java')
const androidManifest = join(ROOT, 'android/app/src/main/AndroidManifest.xml')

if (!existsSync(mainActivity)) {
  warn('android/ no encontrado — omitiendo chequeo APK')
} else {
  ok('MainActivity.java presente')
  const ma = readFileSync(mainActivity, 'utf8')
  if (ma.includes('setMediaPlaybackRequiresUserGesture(false)')) {
    ok('WebView: reproducción sin gesto extra (radio)')
  } else {
    warn('MainActivity: falta setMediaPlaybackRequiresUserGesture(false) para autoplay')
  }

  if (existsSync(androidManifest)) {
    const am = readFileSync(androidManifest, 'utf8')
    for (const perm of ['INTERNET', 'FOREGROUND_SERVICE_MEDIA_PLAYBACK', 'POST_NOTIFICATIONS']) {
      if (am.includes(perm)) ok(`permiso ${perm}`)
      else warn(`AndroidManifest: falta ${perm}`)
    }
  }
}

// ── 7. Variables de entorno requeridas ────────────────────────
console.log('\n[7/7] Entorno')
const envLocal = join(ROOT, '.env.local')
const envExample = join(ROOT, '.env.example')

if (!existsSync(envLocal) && !existsSync(envExample)) {
  warn('no hay .env.local ni .env.example — documenta las variables requeridas')
} else {
  ok('.env.local o .env.example presente')
}

const requiredEnv = ['NEXT_PUBLIC_PLAN']
for (const key of requiredEnv) {
  if (!process.env[key]) warn(`variable de entorno recomendada no definida → ${key}`)
  else ok(`${key} definida`)
}

// ── Resultado ─────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50))

if (warnings.length) {
  console.warn(`\n⚠  ${warnings.length} advertencia(s):`)
  warnings.forEach(w => console.warn(`   • ${w}`))
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} error(es) — corrige antes de publicar:\n`)
  errors.forEach(e => console.error(`   • ${e}`))
  process.exit(1)
} else {
  console.log(`\n✅ Todo OK — listo para publicar\n`)
  process.exit(0)
}
