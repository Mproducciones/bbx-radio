'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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

const DEMO_ARTICLES: Article[] = [
  { _id: 'd1', title: 'Los 10 éxitos más escuchados este mes en la radio',     slug: { current: 'exitos-mes' },      category: 'Música',          excerpt: 'Repasamos los temas que más sonaron en nuestra programación este mes. ¿Está tu favorito?',                                        publishedAt: '2026-05-17T10:00:00Z', image: 'https://picsum.photos/seed/news1/800/400' },
  { _id: 'd2', title: 'Agenda cultural: lo que no te puedes perder este finde', slug: { current: 'agenda-cultural' }, category: 'Entretenimiento', excerpt: 'Conciertos, ferias y actividades familiares para disfrutar en la región durante el fin de semana.',                               publishedAt: '2026-05-16T10:00:00Z', image: 'https://picsum.photos/seed/news2/800/400' },
  { _id: 'd3', title: 'Nuevo programa se suma a la grilla esta temporada',      slug: { current: 'nuevo-programa' },  category: 'Radio',           excerpt: 'Estamos emocionados de presentar un nuevo espacio lleno de música y entretenimiento para toda la familia.',                       publishedAt: '2026-05-14T10:00:00Z', image: 'https://picsum.photos/seed/news3/800/400' },
  { _id: 'd4', title: 'Entrevista exclusiva: el artista habla de su nuevo álbum', slug: { current: 'entrevista' },   category: 'Entrevistas',    excerpt: 'Conversamos con uno de los artistas más destacados sobre su proceso creativo y próximos proyectos.',                              publishedAt: '2026-05-12T10:00:00Z', image: 'https://picsum.photos/seed/news4/800/400' },
]

const DEMO_RELEASES: Release[] = [
  { _id: 'r1', title: 'Ya suena: el nuevo hit del verano', slug: { current: 'hit-verano' }, artist: 'Artista Nacional', album: 'Nuevo Sencillo', publishedAt: '2026-05-15T10:00:00Z', image: 'https://picsum.photos/seed/release1/400/400' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Música':         '#db8918',
  'Entretenimiento': '#40B9BF',
  'Radio':          '#7D59B5',
  'Entrevistas':    '#FF8C42',
  'Lanzamiento':    '#00D9A0',
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) } catch { return '' }
}

const FILTERS = ['Todo', 'Música', 'Radio', 'Entretenimiento', 'Entrevistas', 'Lanzamientos']

export function NoticiasContent({ articles, releases }: { articles: Article[]; releases: Release[] }) {
  const [filter, setFilter] = useState('Todo')
  const displayArticles = articles.length > 0 ? articles : DEMO_ARTICLES
  const displayReleases = articles.length > 0 ? releases : DEMO_RELEASES

  const all = [
    ...displayArticles.map(a => ({ ...a, type: 'article' as const })),
    ...displayReleases.map(r => ({ ...r, type: 'release' as const, category: 'Lanzamientos' })),
  ]

  const filtered = filter === 'Todo' ? all : all.filter(i => i.category === filter)
  const [hero, ...rest] = filtered

  return (
    <div className="flex flex-col gap-5">
      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {FILTERS.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={filter === f
              ? { background: '#db8918', color: '#07070E' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {f}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          {/* Hero article */}
          {hero && (
            <HeroCard item={hero} />
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rest.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <SmallCard item={item} />
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">No hay contenido en esta categoría aún</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function HeroCard({ item }: { item: any }) {
  const color = CATEGORY_COLORS[item.category] ?? '#db8918'
  const href = item.type === 'release' ? (item.externalLink ?? '#') : `/noticias/${item.slug?.current ?? '#'}`

  return (
    <Link href={href} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noopener noreferrer' : undefined}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(15,15,26,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${color}30`,
        }}
      >
        {/* Imagen hero */}
        {(item.image && typeof item.image === 'string') && (
          <div className="relative h-44 w-full overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(7,7,14,0.95) 100%)' }} />
          </div>
        )}
        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color, background: `${color}20`, border: `1px solid ${color}30` }}>
              {item.category}
            </span>
            <span className="text-white/30 text-[10px]">{formatDate(item.publishedAt)}</span>
          </div>
          <h2 className="text-white font-bold text-lg leading-snug mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{item.excerpt}</p>
        </div>
      </motion.div>
    </Link>
  )
}

function SmallCard({ item }: { item: any }) {
  const color = CATEGORY_COLORS[item.category] ?? '#db8918'
  const href = item.type === 'release' ? (item.externalLink ?? '#') : `/noticias/${item.slug?.current ?? '#'}`

  return (
    <Link href={href} target={item.externalLink ? '_blank' : undefined} rel={item.externalLink ? 'noopener noreferrer' : undefined}>
      <motion.div
        whileHover={{ scale: 1.02, borderColor: `${color}50` }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl p-4 h-full transition-all"
        style={{
          background: 'rgba(15,15,26,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{item.category}</span>
          <span className="text-white/25 text-[9px] ml-auto">{formatDate(item.publishedAt)}</span>
        </div>
        <h3 className="text-white text-sm font-semibold leading-snug mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>
      </motion.div>
    </Link>
  )
}
