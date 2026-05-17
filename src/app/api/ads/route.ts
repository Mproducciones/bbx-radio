import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
    }

    const ads = await sanityClient.fetch(query)
    return NextResponse.json(ads)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}
