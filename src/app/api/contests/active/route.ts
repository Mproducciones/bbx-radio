import { NextResponse } from 'next/server'
import { getActiveContest } from '@/lib/contestStore'

export async function GET() {
  const contest = await getActiveContest()
  if (!contest) return NextResponse.json(null)
  return NextResponse.json({
    id: contest.slug,
    title: contest.title,
    prize: contest.prize,
    description: contest.description,
    sponsorName: contest.sponsor_name,
    deadline: contest.deadline,
  })
}
