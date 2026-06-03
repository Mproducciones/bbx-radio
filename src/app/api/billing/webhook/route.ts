import { NextResponse, type NextRequest } from 'next/server'
import { handleStripeWebhook } from '@/lib/stripeBilling'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const payload = await req.text()
  const result = await handleStripeWebhook(payload, signature)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ received: true })
}
