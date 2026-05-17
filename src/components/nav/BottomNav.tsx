/**
 * Barra de navegación inferior
 * 
 * Muestra los tabs principales de la aplicación:
 * - En Vivo: Página principal con reproductor
 * - Noticias: Sección de noticias
 * - Publicidad: Sección para anunciantes
 * 
 * Se oculta en rutas de /studio para no interferir con el panel de administración
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'En Vivo', icon: LiveIcon },
  { href: '/noticias', label: 'Noticias', icon: NewsIcon },
  { href: '/anunciate', label: 'Publicidad', icon: BusinessIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/studio')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden"
      style={{
        background: 'rgba(7, 7, 14, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div className="max-w-md mx-auto flex items-stretch h-16">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors',
                isActive
                  ? 'text-[var(--color-mag-400)]'
                  : 'text-[var(--color-ink-400)] hover:text-[var(--color-ink-200)]'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--color-mag-400)]" />
              )}
              <Icon className="w-5 h-5" />
              <span className={cn('text-[10px] font-medium', isActive ? 'font-semibold' : '')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      <div
        className="bg-transparent"
        style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
      />
    </nav>
  )
}

function LiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a11 11 0 1 0 0 22A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-2.5-5.5L16 12l-6.5-3.5v7z" />
    </svg>
  )
}

function NewsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
    </svg>
  )
}

function BusinessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.47 0 12.36 0c-1.73 0-3.24.87-4.36 2.18L6 5H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.97 4.29C10.58 3.49 11.42 3 12.36 3c1.67 0 3 1.33 3 3 0 .47-.1.92-.26 1.32-.04.1-.12.36-.1.68H9.39c.01-.29-.08-.57-.16-.71C9 6.9 9 6.45 9 6c0-.66.31-1.26.79-1.71C9.87 4.22 9.92 4.25 9.97 4.29zM20 20H4V8h16v12z" />
    </svg>
  )
}
