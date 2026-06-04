#!/usr/bin/env node
/**
 * Capturas móvil (iPhone) + métricas de layout para QA responsive.
 * npm run agent:screenshot
 * QA_URL=https://bbx-radio-9k9y.vercel.app npm run agent:screenshot
 */

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { loadBrief } from './lib/load-brief.mjs'

const brief = loadBrief()
const baseUrl = (process.env.QA_URL ?? brief.app.site_url).replace(/\/$/, '')
const routes = process.env.QA_ROUTES?.split(',').map(r => r.trim()).filter(Boolean)
  ?? [...(brief.routes ?? ['/', '/programacion', '/participa']), '/bbx', '/anunciate']

const DEVICE_PRESETS = [
  { id: 'iphone-se', device: 'iPhone SE' },
  { id: 'iphone-14', device: 'iPhone 14' },
  { id: 'iphone-14-pro-max', device: 'iPhone 14 Pro Max' },
]

let chromium
let devices
try {
  const pw = await import('playwright')
  chromium = pw.chromium
  devices = pw.devices
} catch {
  console.error('Instala Playwright: pnpm add -D playwright && npx playwright install chromium')
  process.exit(2)
}

const outDir = join(process.cwd(), 'agents/reports/screenshots', new Date().toISOString().slice(0, 10))
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const meta = { at: new Date().toISOString(), baseUrl, shots: [] }

async function collectLayout(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('.app-mobile-shell')
    const inset = document.querySelector('.app-mobile-inset')
    const shellRect = shell?.getBoundingClientRect()
    const insetRect = inset?.getBoundingClientRect()
    const cs = inset ? getComputedStyle(inset) : null
    return {
      innerWidth: window.innerWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 8,
      shellLeft: shellRect ? Math.round(shellRect.left) : null,
      insetLeft: insetRect ? Math.round(insetRect.left) : null,
      insetWidth: insetRect ? Math.round(insetRect.width) : null,
      padTop: cs?.paddingTop ?? null,
      padLeft: cs?.paddingLeft ?? null,
      padRight: cs?.paddingRight ?? null,
    }
  })
}

for (const preset of DEVICE_PRESETS) {
  const device = devices[preset.device]
  if (!device) {
    console.warn(`⚠ Dispositivo no encontrado: ${preset.device}`)
    continue
  }

  const context = await browser.newContext({ ...device, colorScheme: 'dark' })
  const page = await context.newPage()

  for (const route of routes) {
    const url = `${baseUrl}${route === '/' ? '' : route}`
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
    const file = join(outDir, `${slug}-${preset.id}.png`)

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
      await page.waitForTimeout(2800)
      const layout = await collectLayout(page)
      await page.screenshot({ path: file, fullPage: false })
      meta.shots.push({ route, preset: preset.id, file, ...layout })
      const tag = layout.overflow ? '⚠ overflow' : '✓'
      const asym =
        layout.shellLeft != null && layout.shellLeft > 2 ? ` shellL=${layout.shellLeft}` : ''
      console.log(`${tag} ${preset.id} ${route} insetL=${layout.insetLeft} padL=${layout.padLeft}${asym}`)
      console.log(`    → ${file}`)
    } catch (e) {
      console.error(`✗ ${preset.id} ${route} — ${e.message}`)
      meta.shots.push({ route, preset: preset.id, error: e.message })
    }
  }

  await context.close()
}

await browser.close()

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(meta, null, 2))
console.log(`\n📸 ${meta.shots.length} capturas en:\n   ${outDir}\n`)
