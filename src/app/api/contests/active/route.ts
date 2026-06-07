import { NextResponse } from 'next/server'
import { getActiveContest } from '@/lib/contestStore'
import { resolveContestBannerUrl } from '@/lib/contestBanner'

export const revalidate = 60

export async function GET() {
  const contest = await getActiveContest()
  if (!contest) {
    return NextResponse.json(null, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    })
  }

  const imageUrl =
    contest.banner_image_url ?? (contest.sponsor_ad_id ? await resolveContestBannerUrl(contest) : null)

  return NextResponse.json(
    {
      id: contest.slug,
      title: contest.title,
      prize: contest.prize,
      description: contest.description,
      sponsorName: contest.sponsor_name,
      deadline: contest.deadline,
      imageUrl,
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    },
  )
}
