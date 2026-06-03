#!/usr/bin/env node
/**
 * Orquestador fase 1: brief → tarea para Cursor/Claude → QA
 * npm run agent:run -- --goal "Descripción del objetivo"
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'
import { loadBrief } from './lib/load-brief.mjs'

const ROOT = process.cwd()
const args = process.argv.slice(2)
let goal = 'Mejorar calidad móvil y UX sin regresiones'
let briefPath

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--goal' && args[i + 1]) goal = args[++i]
  else if (args[i] === '--brief' && args[i + 1]) briefPath = args[++i]
}

const brief = loadBrief(briefPath)
const rulesPath = join(ROOT, 'agents/RULES.md')
const rules = existsSync(rulesPath) ? readFileSync(rulesPath, 'utf8') : ''

const task = `# Tarea actual — ${brief.app.name}

**Generado:** ${new Date().toISOString()}  
**Plan:** ${brief.app.plan}  
**URL QA:** ${brief.app.site_url}

## Objetivo (esta sesión)
${goal}

## Goals del brief
${brief.goals.map(g => `- ${g}`).join('\n') || '- (sin goals en brief)'}

## Restricciones obligatorias
${brief.constraints.map(c => `- ${c}`).join('\n') || '- Ver agents/RULES.md'}

## Gates de calidad
${brief.quality_gates.map(g => `- ${g}`).join('\n')}

Comandos tras implementar:
\`\`\`bash
npm run agent:qa
npm run agent:qa:visual   # con dev server o QA_URL a Vercel
\`\`\`

## Rutas a probar (360 / 390 / 430 px)
${brief.routes.map(r => `- ${r}`).join('\n')}

## Reglas inmutables (resumen)
${rules.split('\n').slice(0, 25).join('\n')}

---

## Prompt para Cursor Agent (pegar)

Implementa el objetivo de esta sesión en pulso-app.
Lee agents/RULES.md. No toques bottom nav sin OK del usuario.
Al terminar ejecuta \`npm run agent:qa\` y resume en español.

**Objetivo:** ${goal}

---

## Prompt para Claude Pro (pegar)

Actúas como lead producto/diseño para ${brief.app.name} (PWA Next.js).
Marca: primary ${brief.brand.primary}, tono ${brief.brand.tone}.

**Objetivo:** ${goal}

Entrega: diagnóstico, una solución, archivos a tocar, checklist PASS/FAIL móvil.
No escribas código; Cursor implementa.
`

const outDir = join(ROOT, 'agents/out')
mkdirSync(outDir, { recursive: true })
const taskFile = join(outDir, 'CURRENT-TASK.md')
writeFileSync(taskFile, task, 'utf8')

console.log('📋 Motor BBX — fase 1\n')
console.log(`   Brief: ${brief.path}`)
console.log(`   Tarea: ${taskFile}\n`)
console.log('   Siguiente paso:')
console.log('   1. Abre CURRENT-TASK.md en Cursor (Agent) o Claude')
console.log('   2. Implementa / planifica')
console.log('   3. npm run agent:qa\n')

console.log('▶ Ejecutando agent:qa (validate + build)...\n')
const qa = spawnSync('node', ['scripts/agent-qa.mjs'], { cwd: ROOT, stdio: 'inherit', shell: true })

if (qa.status !== 0) {
  console.error('\n⚠ QA falló antes de tu sesión — arregla o continúa con el objetivo encima.\n')
  process.exit(qa.status ?? 1)
}
console.log('\n✅ Base QA OK — listo para trabajar con Cursor/Claude Pro\n')
