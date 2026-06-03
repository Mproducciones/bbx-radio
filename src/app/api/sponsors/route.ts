import { NextResponse } from 'next/server'
import { getSponsors } from '@/lib/sponsorsData'

export async function GET() {
  return NextResponse.json(await getSponsors())
}
