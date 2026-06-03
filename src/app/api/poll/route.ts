import { NextResponse, type NextRequest } from 'next/server'
import { getPoll, vote, setPoll, closePoll, getVote } from '@/lib/pollStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'
import { savePollResult } from '@/lib/analyticsStore'
import {
  ensureAudienceSession,
  attachAudienceSessionCookie,
  getAudienceSessionFromRequest,
} from '@/lib/audienceSession'
import { checkRateLimit, rateLimitByIp } from '@/lib/rateLimit'
import { guardPublicWrite } from '@/lib/requestGuard'

export async function GET(req: NextRequest) {
  const { sessionId, setCookie } = await ensureAudienceSession(req)
  const poll = getPoll()

  const body = poll
    ? { ...poll, myVote: getVote(sessionId) }
    : null

  const res = NextResponse.json(body)
  if (setCookie) await attachAudienceSessionCookie(res, sessionId)
  return res
}

export async function POST(req: NextRequest) {
  const blocked = guardPublicWrite(req)
  if (blocked) return blocked

  if (!(await rateLimitByIp(req, 'pollVote'))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const session = await getAudienceSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Session required' }, { status: 403 })
  }

  if (!(await checkRateLimit('pollVote', session))) {
    return NextResponse.json({ error: 'Too many votes' }, { status: 429 })
  }

  const { optionId } = await req.json().catch(() => ({}))
  if (!optionId || typeof optionId !== 'string') {
    return NextResponse.json({ error: 'optionId required' }, { status: 400 })
  }

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
