#!/usr/bin/env node
/**
 * Capturas móvil para revisar layout (como en el celu).
 * npm run agent:screenshot
 * QA_URL=https://bbx-radio-9k9y.vercel.app npm run agent:screenshot
 */

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { loadBrief } from './lib/load-brief.mjs'

const brief = loadBrief()
const baseUrl = (process.env.QA_URL ?? brief.app.site_url).replace(/\/$/, '')
const routes = brief.routes ?? ['/', '/programacion']
const widths = brief.widths ?? [360, 390]

let chromium
try {
  chromium = (await import('playwright')).chromium
} catch {
  console.error('Instala Playwright: pnpm add -D playwright && npx playwright install chromium')
  process.exit(2)
}

const outDir = join(process.cwd(), 'agents/reports/screenshots', new Date().toISOString().slice(0, 10))
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const meta = { at: new Date().toISOString(), baseUrl, shots: [] }

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await page.emulateMedia({ colorScheme: 'dark' })

  for (const route of routes) {
    const url = `${baseUrl}${route === '/' ? '' : route}`
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
    const file = join(outDir, `${slug}-${width}.png`)

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 })
      await page.waitForTimeout(2000)
      const metrics = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      }))
      await page.screenshot({ path: file, fullPage: false })
      meta.shots.push({ route, width, file, ...metrics })
      const tag = metrics.overflow ? '⚠ overflow' : '✓'
      console.log(`${tag} ${file}`)
    } catch (e) {
      console.error(`✗ ${route} ${width}px — ${e.message}`)
      meta.shots.push({ route, width, error: e.message })
    }
  }
  await page.close()
}

await browser.close()

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(meta, null, 2))
console.log(`\n📸 ${meta.shots.length} capturas en:\n   ${outDir}\n`)
console.log('Abre las PNG y compáralas con tu celu, o súbelas al chat de Cursor.\n')
