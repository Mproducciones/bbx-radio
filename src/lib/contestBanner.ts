import { sanityClient, urlFor } from '@/lib/sanity'
import type { Contest } from '@/lib/contestStore'

export async function resolveContestBannerUrl(contest: Contest): Promise<string | null> {
  if (contest.banner_image_url) return contest.banner_image_url
  if (!contest.sponsor_ad_id) return null

  try {
    const ad = await sanityClient.fetch<{ imagenUrl?: string; imagen?: Parameters<typeof urlFor>[0] }>(
      `*[_type == "publicidad" && _id == $id][0]{ imagenUrl, imagen }`,
      { id: contest.sponsor_ad_id },
    )
    if (!ad) return null
    if (ad.imagenUrl) return ad.imagenUrl
    if (ad.imagen) return urlFor(ad.imagen).width(960).quality(85).url()
  } catch {
    /* Sanity opcional en dev */
  }

  return null
}
