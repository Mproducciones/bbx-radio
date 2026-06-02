import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { DEMO_SPONSORS } from '@/lib/demoCampaigns'

export async function GET() {
  try {
    const now = new Date().toISOString()
    const ads = await sanityClient.fetch(
      `*[_type == "publicidad" && activo == true && fechaInicio <= $now && fechaFin >= $now]
        | order(prioridad desc) {
          _id, nombre, cliente, tipo, tagline, imagenUrl, enlace, colorAccent
        }`,
      { now },
    )

    const byClient = new Map<string, {
      id: string
      name: string
      cliente: string
      tagline?: string
      imagenUrl?: string
      enlace?: string
      colorAccent?: string
      tipos: string[]
    }>()

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
          enlace: ad.enlace,
          colorAccent: ad.colorAccent,
          tipos: [ad.tipo],
        })
      }
    }

    const live = [...byClient.values()]
    return NextResponse.json(live.length > 0 ? live : DEMO_SPONSORS)
  } catch {
    return NextResponse.json(DEMO_SPONSORS)
  }
}
