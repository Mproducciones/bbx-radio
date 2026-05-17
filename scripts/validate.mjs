#!/usr/bin/env node
/**
 * validate.mjs — BBX pre-publish checker
 * Corre antes de cada git push para detectar errores antes de publicar.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const ROOT = process.cwd()
const errors = []
const warnings = []

function ok(msg)   { console.log(`  ✓ ${msg}`) }
function fail(msg) { console.error(`  ✗ ${msg}`); errors.push(msg) }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings.push(msg) }

// ── 1. manifest.json ──────────────────────────────────────────
console.log('\n[1/4] manifest.json')
const manifestPath = join(ROOT, 'public/manifest.json')

if (!existsSync(manifestPath)) {
  fail('public/manifest.json no existe')
} else {
  let manifest
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch (e) {
    fail(`manifest.json JSON inválido → ${e.message}`)
  }

  if (manifest) {
    // Campos obligatorios
    for (const field of ['name', 'short_name', 'start_url', 'display', 'icons']) {
      if (!manifest[field]) fail(`manifest.json: falta campo "${field}"`)
      else ok(`campo "${field}" presente`)
    }

    // Verificar íconos PWA mínimos
    if (Array.isArray(manifest.icons)) {
      const sizes = manifest.icons.map(i => i.sizes)
      if (!sizes.includes('192x192')) fail('manifest.json: falta ícono 192x192 (requerido por Android)')
      else ok('ícono 192x192 declarado')
      if (!sizes.includes('512x512')) fail('manifest.json: falta ícono 512x512 (requerido para installable)')
      else ok('ícono 512x512 declarado')

      // Verificar que los archivos de ícono existen físicamente
      for (const icon of manifest.icons) {
        const src = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src
        const filePath = join(ROOT, 'public', src)
        if (!existsSync(filePath)) fail(`ícono declarado pero archivo no existe → ${icon.src}`)
        else ok(`archivo existe → ${icon.src}`)
      }

      // Verificar purpose maskable
      const hasMaskable = manifest.icons.some(i => i.purpose?.includes('maskable'))
      if (!hasMaskable) warn('ningún ícono tiene purpose "maskable" (recomendado para Android)')
      else ok('ícono maskable presente')
    }

    // display debe ser standalone o fullscreen
    if (!['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
      fail(`manifest.json: display "${manifest.display}" no es válido para PWA installable`)
    } else {
      ok(`display "${manifest.display}" válido`)
    }
  }
}

// ── 2. Service Worker ─────────────────────────────────────────
console.log('\n[2/4] Service Worker')
const swPath = join(ROOT, 'public/sw.js')

if (!existsSync(swPath)) {
  fail('public/sw.js no existe')
} else {
  const sw = readFileSync(swPath, 'utf8')
  if (!sw.includes('skipWaiting'))  warn('sw.js: no llama a skipWaiting() — actualizaciones pueden demorar')
  else ok('skipWaiting() presente')
  if (!sw.includes('clients.claim')) warn('sw.js: no llama a clients.claim() — clientes viejos sin actualizar')
  else ok('clients.claim() presente')
  ok('sw.js existe')
}

// ── 3. Archivos críticos ──────────────────────────────────────
console.log('\n[3/4] Archivos críticos')
const criticalFiles = [
  'src/lib/radioConfig.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
]

for (const file of criticalFiles) {
  if (!existsSync(join(ROOT, file))) fail(`falta archivo crítico → ${file}`)
  else ok(file)
}

// ── 4. TypeScript ─────────────────────────────────────────────
console.log('\n[4/4] TypeScript')
try {
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' })
  ok('sin errores de TypeScript')
} catch (e) {
  const output = e.stdout?.toString() || e.stderr?.toString() || ''
  fail(`errores de TypeScript:\n${output.slice(0, 800)}`)
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
