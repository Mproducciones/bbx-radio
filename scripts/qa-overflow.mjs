#!/usr/bin/env node
/**
 * QA visual: overflow horizontal en rutas y anchos dados.
 * Exit 0 = PASS, 1 = FAIL
 *
 * Uso: node scripts/qa-overflow.mjs [baseUrl] [--routes /,/programacion]
 */

import { loadBrief } from './lib/load-brief.mjs'

const args = process.argv.slice(2)
let baseUrl = process.env.QA_URL ?? 'http://localhost:3000'
const routes = []
const widths = []

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--routes' && args[i + 1]) {
    routes.push(...args[++i].split(',').map(r => r.trim()).filter(Boolean))
  } else if (args[i] === '--widths' && args[i + 1]) {
    widths.push(...args[++i].split(',').map(n => Number(n.trim())).filter(n => n > 0))
  } else if (!args[i].startsWith('--')) {
    baseUrl = args[i].replace(/\/$/, '')
  }
}

const brief = loadBrief()
const testRoutes = routes.length ? routes : brief.routes
const testWidths = widths.length ? widths : brief.widths

let chromium
try {
  const pw = await import('playwright')
  chromium = pw.chromium
} catch {
  console.error('\n✗ Playwright no instalado.')
  console.error('  pnpm add -D playwright && npx playwright install chromium\n')
  process.exit(2)
}

const fails = []
const browser = await chromium.launch({ headless: true })

for (const width of testWidths) {
  const page = await browser.newPage({ viewport: { width, height: 869 } })
  for (const route of testRoutes) {
    const url = `${baseUrl}${route === '/' ? '' : route}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
      await page.waitForTimeout(1500)
      const m = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        offenders: (() => {
          const list = []
          for (const el of document.querySelectorAll('*')) {
            const rect = el.getBoundingClientRect()
            if (rect.right > window.innerWidth + 1 && rect.width > 0) {
              list.push({
                sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
                  ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                  : ''),
                right: Math.round(rect.right),
                vw: window.innerWidth,
              })
            }
          }
          return list.sort((a, b) => b.right - a.right).slice(0, 5)
        })(),
      }))
      const pass = m.scrollWidth <= m.innerWidth + 1
      const softPass = m.scrollWidth <= m.innerWidth + 8 && m.innerWidth === m.clientWidth
      const ok = pass || softPass
      const tag = ok ? '✓' : '✗'
      console.log(`${tag} ${width}px ${route} — scroll ${m.scrollWidth} / viewport ${m.innerWidth}`)
      if (!ok) {
        fails.push({ width, route, url, ...m })
        for (const o of m.offenders) console.log(`    → ${o.sel} right=${o.right}`)
      }
    } catch (e) {
      console.error(`✗ ${width}px ${route} — ${e.message}`)
      fails.push({ width, route, error: e.message })
    }
  }
  await page.close()
}

await browser.close()

if (fails.length) {
  console.error(`\n✗ OVERFLOW FAIL (${fails.length} casos)\n`)
  process.exit(1)
}
console.log('\n✓ Overflow QA PASS en todas las rutas/anchos\n')
process.exit(0)
