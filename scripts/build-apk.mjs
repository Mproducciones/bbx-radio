#!/usr/bin/env node
/**
 * Genera APK debug de Radio Bienvenida.
 * La app carga la web desde Vercel (mismas APIs que el navegador).
 *
 * Uso: pnpm build:apk
 * Salida: android/app/build/outputs/apk/debug/app-debug.apk
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const isWin = process.platform === 'win32'
const gradlew = join(ROOT, 'android', isWin ? 'gradlew.bat' : 'gradlew')
const prodUrl = process.env.CAPACITOR_SERVER_URL || 'https://bbx-radio-9k9y.vercel.app'
const task = process.argv.includes('release') ? 'assembleRelease' : 'assembleDebug'
const apkSub = task === 'assembleRelease' ? 'release' : 'debug'
const apkName = task === 'assembleRelease' ? 'app-release-unsigned.apk' : 'app-debug.apk'

if (!existsSync(gradlew)) {
  console.error('✗ No existe android/gradlew — ejecuta primero: pnpm cap:sync:prod')
  process.exit(1)
}

console.log(`→ Capacitor sync (${prodUrl})…`)
execSync(`pnpm exec cap sync android`, {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, CAPACITOR_SERVER_URL: prodUrl },
})

console.log(`→ Gradle ${task}…`)
execSync(`"${gradlew}" ${task}`, {
  cwd: join(ROOT, 'android'),
  stdio: 'inherit',
})

const apkPath = join(ROOT, 'android', 'app', 'build', 'outputs', 'apk', apkSub, apkName)
console.log(`\n✓ APK listo: ${apkPath}\n`)
