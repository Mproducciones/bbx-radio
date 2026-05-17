/**
 * Genera iconos PWA sin dependencias externas — solo Node.js built-ins.
 * ESLint no permite require() (no-require-imports), así que usamos ESM.
 */
import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname no existe en ESM: lo derivamos desde import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1
    }
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0)
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crcBuf])
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function createPNG(size, bgHex, fgHex) {
  const [br, bg, bb] = hexToRgb(bgHex)
  const [fr, fg, fb] = hexToRgb(fgHex)

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // RGB color type

  // Build pixel rows — círculo de color primario sobre fondo oscuro
  const rows = []
  const cx = size / 2, cy = size / 2
  const outerR = size * 0.42
  const innerR = size * 0.22
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0 // filter none
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      let r, g, b
      if (dist <= innerR) {
        // Centro blanco
        r = 255; g = 255; b = 255
      } else if (dist <= outerR) {
        // Anillo de color primario
        r = fr; g = fg; b = fb
      } else {
        // Fondo
        r = br; g = bg; b = bb
      }
      row[1 + x * 3] = r
      row[2 + x * 3] = g
      row[3 + x * 3] = b
    }
    rows.push(row)
  }

  const raw = Buffer.concat(rows)
  const compressed = zlib.deflateSync(raw, { level: 9 })

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const out = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(out, { recursive: true })

for (const size of [192, 512]) {
  const buf = createPNG(size, '#07070E', '#FF006E')
  const file = path.join(out, `icon-${size}.png`)
  fs.writeFileSync(file, buf)
  console.log(`✓ ${file} (${buf.length} bytes)`)
}
