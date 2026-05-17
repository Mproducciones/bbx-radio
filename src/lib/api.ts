import { sanityClient } from './sanity'

export async function fetchNoticias() {
  const query = `*[_type == "noticia"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    publishedAt,
    image,
    externalLink
  }[0...10]`
  
  return sanityClient.fetch(query)
}

export async function fetchLanzamientos() {
  const query = `*[_type == "lanzamiento"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    artist,
    album,
    publishedAt,
    image,
    externalLink
  }[0...10]`
  
  return sanityClient.fetch(query)
}

export async function fetchEventos() {
  const query = `*[_type == "evento"] | order(publishedAt desc) {
    _id,
    title,
    date,
    description
  }[0...10]`
  
  return sanityClient.fetch(query)
}

export async function fetchReplay() {
  const query = `*[_type == "replay"] | order(publishedAt desc) {
    _id,
    title,
    date,
    duration,
    description
  }[0...10]`
  
  return sanityClient.fetch(query)
}
