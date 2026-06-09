import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/lib/sanity'

export function isSanityWriteConfigured(): boolean {
  return Boolean(projectId && projectId !== 'your-project-id' && process.env.SANITY_API_TOKEN?.trim())
}

export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_TOKEN?.trim()
  if (!token || !projectId) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}
