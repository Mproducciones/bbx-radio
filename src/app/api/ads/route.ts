import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

const ALLOWED_TIPOS = ['banner_superior', 'banner_intermedio', 'banner_inferior']

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo')

    if (!tipo || !ALLOWED_TIPOS.includes(tipo)) {
      return NextResponse.json({ error: 'Invalid tipo parameter' }, { status: 400 })
    }

    const ads = await sanityClient.fetch(
      `*[_type == "publicidad" && activo == true && tipo == $tipo] | order(prioridad desc) {
        _id, nombre, tipo, imagen, imagenUrl, enlace, activo, prioridad
      }`,
      { tipo }
    )

    return NextResponse.json(ads)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}
