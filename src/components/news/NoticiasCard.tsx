import { urlFor } from '@/lib/sanity'

interface NoticiasCardProps {
  item: any
  type: 'article' | 'release'
}

export function NoticiasCard({ item, type }: NoticiasCardProps) {
  const imageUrl = item.image ? urlFor(item.image).url() : null
  const link = item.externalLink || (item.slug ? `/noticias/${item.slug.current}` : '#')

  return (
    <a
      href={link}
      className="block bg-[var(--color-ink-800)] rounded-xl overflow-hidden border border-[var(--color-ink-700)] hover:border-[var(--color-mag-400)] transition-colors"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <span className="text-[var(--color-mag-400)] text-xs font-medium">
          {type === 'article' ? item.category : 'Lanzamiento'}
        </span>
        <h3 className="text-white font-semibold text-sm mt-1 line-clamp-2">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-[var(--color-ink-400)] text-xs mt-2 line-clamp-2">
            {item.excerpt}
          </p>
        )}
        {type === 'release' && item.artist && (
          <p className="text-[var(--color-ink-400)] text-xs mt-1">
            {item.artist}
          </p>
        )}
      </div>
    </a>
  )
}
