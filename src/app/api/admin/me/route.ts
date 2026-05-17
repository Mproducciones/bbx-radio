import { NextResponse, type NextRequest } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const authorized = await isAdminRequestAuthorized(req)
  return NextResponse.json({ authorized })
}
