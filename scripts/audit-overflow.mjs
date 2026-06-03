import { chromium } from 'playwright'

const url = process.argv[2] ?? 'https://bbx-radio-9k9y.vercel.app'
const w = Number(process.argv[3] ?? 360)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: w, height: 869 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 })
await page.waitForTimeout(2500)

const r = await page.evaluate(() => {
  const offenders = []
  for (const el of document.querySelectorAll('*')) {
    const rect = el.getBoundingClientRect()
    if (rect.right > window.innerWidth + 0.5 || rect.left < -0.5) {
      if (rect.width < 1 || rect.height < 1) continue
      const cs = getComputedStyle(el)
      let sel = el.tagName.toLowerCase()
      if (el.id) sel += `#${el.id}`
      if (typeof el.className === 'string' && el.className) {
        sel += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      }
      offenders.push({
        sel,
        right: +rect.right.toFixed(1),
        left: +rect.left.toFixed(1),
        w: +rect.width.toFixed(1),
        pos: cs.position,
      })
    }
  }
  offenders.sort((a, b) => b.right - a.right)
  return {
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: offenders.slice(0, 30),
  }
})

console.log(JSON.stringify(r, null, 2))
await browser.close()
