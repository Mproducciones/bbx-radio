import fs from 'node:fs'

const file = process.argv[2] ?? '.env.vercel.check'
const text = fs.readFileSync(file, 'utf8')
for (const line of text.split(/\r?\n/)) {
  if (!/^(ADMIN_|SUPER_ADMIN_)/.test(line)) continue
  const i = line.indexOf('=')
  const k = line.slice(0, i)
  let v = line.slice(i + 1)
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
  console.log(`${k}: len=${v.length}${v.length === 0 ? ' EMPTY' : ''}`)
}
