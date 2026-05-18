import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "paquetesPublicitarios"][0] {
        titulo, subtitulo, paqueteBasico, paquetePremium, paqueteEmpresarial, whatsapp
      }`
    )
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}
