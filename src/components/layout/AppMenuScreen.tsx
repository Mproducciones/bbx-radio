import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface AppMenuScreenProps {
  children: ReactNode
  className?: string
  /** false = pantalla fija; true = scroll libre; 'snap' = scroll con secciones a pantalla completa */
  scroll?: boolean | 'snap'
}

/** Contenedor móvil: scroll libre o una pantalla fija según `scroll`. */
export function AppMenuScreen({ children, className, scroll = false }: AppMenuScreenProps) {
  const isScroll = scroll === true || scroll === 'snap'
  const isSnap = scroll === 'snap'

  if (isScroll) {
    return (
      <main
        className={cn(
          'relative z-[1] mx-auto w-full min-w-0 max-w-full md:max-w-2xl',
          'max-md:flex-1 max-md:min-h-0 max-md:overflow-visible',
          'max-md:px-4 max-md:pt-2 max-md:pb-2',
          'max-md:[scroll-padding-bottom:calc(var(--app-nav-total)+5.5rem)]',
          'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
          isSnap && 'app-scroll-snap',
          className,
        )}
      >
        {children}
      </main>
    )
  }

  return (
    <main
      className={cn(
        'relative z-[1] mx-auto w-full max-w-md md:max-w-2xl',
        'app-mobile-page max-md:overflow-hidden',
        'max-md:px-4 max-md:pt-1 max-md:pb-0',
        'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
        className,
      )}
    >
      <div className="max-md:flex max-md:flex-1 max-md:flex-col max-md:min-h-0 max-md:h-full max-md:overflow-hidden">
        {children}
      </div>
    </main>
  )
}
