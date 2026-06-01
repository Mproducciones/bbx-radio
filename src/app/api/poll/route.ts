import { NextResponse, type NextRequest } from 'next/server'
import { getPoll, vote, setPoll, closePoll, getVote } from '@/lib/pollStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { savePollResult } from '@/lib/analyticsStore'

function getSession(req: NextRequest): string {
  return req.cookies.get('pulso_session')?.value
    ?? req.headers.get('x-session-id')
    ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'anon'
}

export async function GET(req: NextRequest) {
  const poll = getPoll()
  if (!poll) return NextResponse.json(null)
  return NextResponse.json({ ...poll, myVote: getVote(getSession(req)) })
}

export async function POST(req: NextRequest) {
  const session = getSession(req)
  const { optionId } = await req.json().catch(() => ({}))
  if (!optionId) return NextResponse.json({ error: 'optionId required' }, { status: 400 })
  const result = vote(session, optionId)
  return NextResponse.json({ ...result, poll: getPoll() })
}

export async function PUT(req: NextRequest) {
  const ok = await isAdminRequestAuthorized(req)
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)

  if (body?.action === 'close') {
    const current = getPoll()
    if (current && current.totalVotes > 0) {
      // Persistir resultado antes de cerrar
      savePollResult({
        id: current.id,
        question: current.question,
        options: current.options,
        totalVotes: current.totalVotes,
      }).catch(() => {})
    }
    closePoll()
    return NextResponse.json({ ok: true })
  }

  if (!body?.question || !body?.optionA || !body?.optionB) {
    return NextResponse.json({ error: 'question, optionA y optionB requeridos' }, { status: 400 })
  }
  setPoll(body.question, body.optionA, body.optionB)
  return NextResponse.json({ ok: true, poll: getPoll() })
}
