import Image from 'next/image'

interface Lanzamiento {
  _id: string
  title: string
  artist: string
  releaseType: string
  genre?: string
  releaseDate: string
  description?: string
  cover?: { asset?: { url?: string } }
  spotifyUrl?: string
  youtubeUrl?: string
  appleMusicUrl?: string
}

const DEMO: Lanzamiento[] = [
  {
    _id: 'demo-1',
    title: 'Nuevo Hit del Verano',
    artist: 'Artista Local',
    releaseType: 'Single',
    genre: 'Pop',
    releaseDate: new Date().toISOString().split('T')[0],
    description: 'El nuevo single que está sonando en toda la región.',
  },
  {
    _id: 'demo-2',
    title: 'Mi Ciudad',
    artist: 'Banda Regional',
    releaseType: 'EP',
    genre: 'Rock',
    releaseDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
  },
]

const TYPE_COLORS: Record<string, string> = {
  Single: '#db8918',
  EP: '#7D59B5',
  Álbum: '#40B9BF',
  Colaboración: '#E1306C',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function LanzamientosContent({ items }: { items: Lanzamiento[] }) {
  const data = items.length > 0 ? items : DEMO

  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => {
        const coverUrl = item.cover?.asset?.url
        const color = TYPE_COLORS[item.releaseType] || '#db8918'

        return (
          <div
            key={item._id}
            className="bg-[#0F0F1A] border border-[#1A1A2E] rounded-2xl overflow-hidden flex gap-4 p-4 items-start"
          >
            {/* Cover */}
            <div
              className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: color + '20', border: `1px solid ${color}40` }}
            >
              {coverUrl ? (
                <Image src={coverUrl} alt={item.title} width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-7 h-7" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: color + '20', color }}
                >
                  {item.releaseType}
                </span>
                {item.genre && (
                  <span className="text-[10px] text-[#666690]">{item.genre}</span>
                )}
              </div>
              <p className="text-white font-bold text-sm leading-tight truncate">{item.title}</p>
              <p className="text-[#8888AA] text-xs mt-0.5">{item.artist}</p>
              {item.releaseDate && (
                <p className="text-[#444468] text-[10px] mt-1">{formatDate(item.releaseDate)}</p>
              )}
              {item.description && (
                <p className="text-[#CCCCDD] text-xs mt-2 leading-relaxed line-clamp-2">{item.description}</p>
              )}

              {/* Links */}
              {(item.spotifyUrl || item.youtubeUrl || item.appleMusicUrl) && (
                <div className="flex gap-2 mt-3">
                  {item.spotifyUrl && (
                    <a
                      href={item.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: '#1DB95420', color: '#1DB954', border: '1px solid #1DB95440' }}
                    >
                      Spotify
                    </a>
                  )}
                  {item.youtubeUrl && (
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: '#FF000020', color: '#FF0000', border: '1px solid #FF000040' }}
                    >
                      YouTube
                    </a>
                  )}
                  {item.appleMusicUrl && (
                    <a
                      href={item.appleMusicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: '#FC3C4420', color: '#FC3C44', border: '1px solid #FC3C4440' }}
                    >
                      Apple Music
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
