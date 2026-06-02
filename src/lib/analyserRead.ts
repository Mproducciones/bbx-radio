/**
 * Lectura del analizador con fallback rítmico para iOS/Safari cuando
 * getByteFrequencyData devuelve ceros (CORS o Web Audio sin señal).
 */

export function hasAnalyserSignal(data: Uint8Array): boolean {
  let peak = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i] > peak) peak = data[i]
  }
  return peak > 8
}

/** Espectro sintético al ritmo (~120 BPM) cuando el stream no alimenta el analyser */
export function fillSyntheticFrequency(buf: Uint8Array, timeSec: number) {
  const len = buf.length
  const beat = timeSec * 2.1
  const kick = Math.max(0, Math.sin(beat * Math.PI * 2)) ** 6
  const snare = Math.max(0, Math.sin((beat - 0.5) * Math.PI * 2)) ** 10
  const hat = 0.25 + 0.25 * Math.sin(beat * Math.PI * 8)

  for (let i = 0; i < len; i++) {
    const bin = i / len
    let v = hat * 25
    if (bin < 0.08) v += kick * 220 + snare * 80
    else if (bin < 0.35) v += kick * 60 + snare * 140 + hat * 50
    else if (bin < 0.65) v += snare * 40 + hat * 35
    else v += hat * 20
    buf[i] = Math.min(255, Math.floor(v))
  }
}

export function fillSyntheticTimeDomain(buf: Uint8Array, timeSec: number) {
  const len = buf.length
  const beat = timeSec * 2.1
  const wobble = Math.sin(beat * Math.PI * 2) * 0.35 + Math.sin(beat * Math.PI * 4) * 0.12

  for (let i = 0; i < len; i++) {
    const phase = (i / len) * Math.PI * 4 + timeSec * 3
    const wave = Math.sin(phase) * (0.25 + wobble)
    buf[i] = Math.floor(128 + wave * 90)
  }
}

export type FrequencyReadResult = {
  data: Uint8Array
  fromStream: boolean
}

export function readFrequencyData(
  analyser: AnalyserNode | null,
  isPlaying: boolean,
  buf: Uint8Array,
): FrequencyReadResult {
  if (analyser && isPlaying) {
    analyser.getByteFrequencyData(buf as Uint8Array<ArrayBuffer>)
    if (hasAnalyserSignal(buf)) {
      return { data: buf, fromStream: true }
    }
  }

  if (isPlaying) {
    fillSyntheticFrequency(buf, performance.now() / 1000)
    return { data: buf, fromStream: false }
  }

  buf.fill(0)
  return { data: buf, fromStream: false }
}

export function readTimeDomainData(
  analyser: AnalyserNode | null,
  isPlaying: boolean,
  buf: Uint8Array,
): boolean {
  if (analyser && isPlaying) {
    analyser.getByteTimeDomainData(buf as Uint8Array<ArrayBuffer>)
    let dev = 0
    for (let i = 0; i < buf.length; i++) {
      dev += Math.abs(buf[i] - 128)
    }
    if (dev > buf.length * 2) return true
  }

  if (isPlaying) {
    fillSyntheticTimeDomain(buf, performance.now() / 1000)
  } else {
    buf.fill(128)
  }
  return false
}

/** Bajos / medios normalizados 0–1 */
export function spectrumEnergy(data: Uint8Array) {
  const total = data.length || 1
  let bass = 0
  let mid = 0
  const bassEnd = Math.floor(total * 0.08)
  const midEnd = Math.floor(total * 0.35)
  for (let i = 0; i < bassEnd; i++) bass += data[i]
  for (let i = bassEnd; i < midEnd; i++) mid += data[i]
  bass /= bassEnd * 255 || 1
  mid /= (midEnd - bassEnd) * 255 || 1
  return { bass, mid }
}
