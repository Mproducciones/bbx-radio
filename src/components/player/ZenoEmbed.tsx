'use client'

interface ZenoEmbedProps {
  slug: string
  className?: string
}

export function ZenoEmbed({ slug, className }: ZenoEmbedProps) {
  return (
    <iframe
      title="Radio Player"
      src={`https://player.zeno.fm/${slug}/`}
      width="100%"
      height="180"
      frameBorder="0"
      scrolling="no"
      allow="autoplay"
      className={className}
      style={{ borderRadius: '12px', border: 'none' }}
    />
  )
}
