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

const DEMO_ARTICLES: Article[] = [
  {
    _id: 'demo-1',
    title: 'Los 10 éxitos más escuchados este mes en la radio',
    slug: { current: 'exitos-mes' },
    category: 'Música',
    excerpt: 'Repasamos los temas que más sonaron en nuestra programación durante este mes. ¿Está tu favorito?',
    publishedAt: '2026-05-17T10:00:00.000Z',
  },
  {
    _id: 'demo-2',
    title: 'Agenda cultural: lo que no te puedes perder este fin de semana',
    slug: { current: 'agenda-cultural' },
    category: 'Entretenimiento',
    excerpt: 'Conciertos, ferias y actividades familiares para disfrutar en la región.',
    publishedAt: '2026-05-16T10:00:00.000Z',
  },
  {
    _id: 'demo-3',
    title: 'Nuevo programa se suma a nuestra grilla esta temporada',
    slug: { current: 'nuevo-programa' },
    category: 'Radio',
    excerpt: 'Estamos emocionados de presentar un nuevo espacio lleno de música y entretenimiento para toda la familia.',
    publishedAt: '2026-05-14T10:00:00.000Z',
  },
  {
    _id: 'demo-4',
    title: 'Entrevista exclusiva: el artista del momento habla de su nuevo álbum',
    slug: { current: 'entrevista-artista' },
    category: 'Entrevistas',
    excerpt: 'Conversamos con uno de los artistas más destacados del momento sobre su proceso creativo y próximos proyectos.',
    publishedAt: '2026-05-12T10:00:00.000Z',
  },
]

const DEMO_RELEASES: Release[] = [
  {
    _id: 'demo-r1',
    title: 'Ya suena en nuestra radio: el nuevo hit del verano',
    slug: { current: 'hit-verano' },
    artist: 'Artista Nacional',
    album: 'Nuevo Sencillo',
    publishedAt: '2026-05-15T10:00:00.000Z',
  },
]

export function NoticiasContent({ articles, releases }: NoticiasContentProps) {
  const displayArticles = articles.length > 0 ? articles : DEMO_ARTICLES
  const displayReleases = articles.length > 0 ? releases : DEMO_RELEASES

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayArticles.map((article) => (
        <NoticiasCard key={article._id} item={article} type="article" />
      ))}
      {displayReleases.map((release) => (
        <NoticiasCard key={release._id} item={release} type="release" />
      ))}
    </div>
  )
}
