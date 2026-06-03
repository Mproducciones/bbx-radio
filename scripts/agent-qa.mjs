#!/usr/bin/env node
/**
 * Gates de calidad BBX — alineado al brief.
 * npm run agent:qa
 * npm run agent:qa:visual  → añade overflow Playwright
 */

import { spawnSync } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { loadBrief } from './lib/load-brief.mjs'

const ROOT = process.cwd()
const visual = process.argv.includes('--visual')
const url = process.env.QA_URL ?? process.argv.find((a, i) => process.argv[i - 1] === '--url') ?? loadBrief().app.site_url

const report = {
  at: new Date().toISOString(),
  url,
  gates: {},
  pass: true,
}

function run(cmd, args, label) {
  console.log(`\n▶ ${label}`)
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: true })
  const ok = r.status === 0
  report.gates[label] = ok ? 'PASS' : 'FAIL'
  if (!ok) report.pass = false
  return ok
}

console.log('🔍 BBX Agent QA\n')

run('node', ['scripts/validate.mjs'], 'validate')
run('npm', ['run', 'build'], 'build')

if (visual) {
  const r = spawnSync('node', ['scripts/qa-overflow.mjs', url], { cwd: ROOT, stdio: 'inherit', shell: true })
  report.gates['overflow_visual'] = r.status === 0 ? 'PASS' : r.status === 2 ? 'SKIP' : 'FAIL'
  if (r.status !== 0 && r.status !== 2) report.pass = false
} else {
  report.gates['overflow_visual'] = 'SKIPPED (usa agent:qa:visual)'
}

const dir = join(ROOT, 'agents/reports')
mkdirSync(dir, { recursive: true })
const file = join(dir, `qa-${Date.now()}.json`)
writeFileSync(file, JSON.stringify(report, null, 2))
console.log(`\n📄 Reporte: ${file}`)

if (report.pass) {
  console.log('\n✅ agent:qa PASS\n')
  process.exit(0)
}
console.error('\n❌ agent:qa FAIL — revisar gates arriba\n')
process.exit(1)
