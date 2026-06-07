import { NextResponse } from 'next/server'
import { getActiveContest } from '@/lib/contestStore'
import { resolveContestBannerUrl } from '@/lib/contestBanner'

export async function GET() {
  const contest = await getActiveContest()
  if (!contest) return NextResponse.json(null)

  const imageUrl = await resolveContestBannerUrl(contest)

  return NextResponse.json({
    id: contest.slug,
    title: contest.title,
    prize: contest.prize,
    description: contest.description,
    sponsorName: contest.sponsor_name,
    deadline: contest.deadline,
    imageUrl,
  })
}
