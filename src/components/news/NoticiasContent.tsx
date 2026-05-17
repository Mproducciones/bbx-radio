import { NoticiasCard } from './NoticiasCard'

interface Article {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt: string
  publishedAt: string
  image?: any
  externalLink?: string
}

interface Release {
  _id: string
  title: string
  slug: { current: string }
  artist?: string
  album?: string
  publishedAt: string
  image?: any
  externalLink?: string
}

interface NoticiasContentProps {
  articles: Article[]
  releases: Release[]
}

export function NoticiasContent({ articles, releases }: NoticiasContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <NoticiasCard key={article._id} item={article} type="article" />
      ))}
      {releases.map((release) => (
        <NoticiasCard key={release._id} item={release} type="release" />
      ))}
    </div>
  )
}
