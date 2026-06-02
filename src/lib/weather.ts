/** Descripción corta + emoji según código WMO de Open-Meteo */
export function weatherFromCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: 'Despejado', emoji: '☀️' }
  if (code <= 3) return { label: 'Parcialmente nublado', emoji: '⛅' }
  if (code <= 48) return { label: 'Niebla', emoji: '🌫️' }
  if (code <= 57) return { label: 'Llovizna', emoji: '🌦️' }
  if (code <= 67) return { label: 'Lluvia', emoji: '🌧️' }
  if (code <= 77) return { label: 'Nieve', emoji: '❄️' }
  if (code <= 82) return { label: 'Chubascos', emoji: '🌧️' }
  if (code <= 86) return { label: 'Nevada', emoji: '❄️' }
  if (code >= 95) return { label: 'Tormenta', emoji: '⛈️' }
  return { label: 'Nublado', emoji: '☁️' }
}

export function locationDisplayLabel(city: string, country: string, label?: string): string {
  if (label?.trim()) return label.trim()
  const cc = country.length === 2 ? country.toUpperCase() : country
  return `${city} · ${cc}`
}

/** Etiqueta corta para barra: comuna/ciudad + código país */
export function locationShortLabel(city: string, country: string, label?: string): string {
  return locationDisplayLabel(city, country, label)
}
