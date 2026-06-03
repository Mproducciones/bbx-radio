import { sanityClient } from '@/lib/sanity'
import { DEMO_SPONSORS } from '@/lib/demoCampaigns'
import { sanitizeAdLink } from '@/lib/safeUrl'

export type Sponsor = {
  id: string
  name: string
  cliente: string
  tagline?: string
  imagenUrl?: string
  enlace?: string
  colorAccent?: string
  tipos: string[]
}

export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const now = new Date().toISOString()
    const ads = await sanityClient.fetch(
      `*[_type == "publicidad" && activo == true && fechaInicio <= $now && fechaFin >= $now]
        | order(prioridad desc) {
          _id, nombre, cliente, tipo, tagline, imagenUrl, enlace, colorAccent
        }`,
      { now },
    )

    const byClient = new Map<string, Sponsor>()

    for (const ad of ads ?? []) {
      const key = ad.cliente || ad.nombre
      const existing = byClient.get(key)
      if (existing) {
        existing.tipos.push(ad.tipo)
      } else {
        byClient.set(key, {
          id: ad._id,
          name: ad.nombre,
          cliente: key,
          tagline: ad.tagline,
          imagenUrl: ad.imagenUrl,
          enlace: sanitizeAdLink(ad.enlace),
          colorAccent: ad.colorAccent,
          tipos: [ad.tipo],
        })
      }
    }

    const live = [...byClient.values()]
    return live.length > 0 ? live : DEMO_SPONSORS
  } catch {
    return DEMO_SPONSORS
  }
}
