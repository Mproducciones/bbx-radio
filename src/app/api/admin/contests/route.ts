import { NextResponse, type NextRequest } from 'next/server'
import { createContest, listContests, setContestActive } from '@/lib/contestStore'
import { isAdminRequestAuthorized } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const contests = await listContests()
  return NextResponse.json({ contests })
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.slug || !body?.title || !body?.prize) {
    return NextResponse.json({ error: 'slug, title y prize requeridos' }, { status: 400 })
  }

  const contest = await createContest({
    slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    title: body.title,
    prize: body.prize,
    description: body.description,
    sponsor_name: body.sponsor_name,
    sponsor_ad_id: body.sponsor_ad_id,
    banner_image_url: body.banner_image_url,
    deadline: body.deadline,
    active: Boolean(body.active),
  })

  return NextResponse.json({ contest }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequestAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.id || typeof body.active !== 'boolean') {
    return NextResponse.json({ error: 'id y active requeridos' }, { status: 400 })
  }

  const ok = await setContestActive(body.id, body.active)
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
