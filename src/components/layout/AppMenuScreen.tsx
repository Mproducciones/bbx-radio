import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface AppMenuScreenProps {
  children: ReactNode
  className?: string
  /** false = una pantalla fija; true = scroll libre; 'snap' = scroll con secciones a pantalla completa */
  scroll?: boolean | 'snap'
}

/** Contenedor móvil: una pantalla = viewport menos bottom nav. Desktop sin cambios. */
export function AppMenuScreen({ children, className, scroll = false }: AppMenuScreenProps) {
  const isScroll = scroll === true || scroll === 'snap'
  const isSnap = scroll === 'snap'

  return (
    <main
      className={cn(
        'relative z-[1] mx-auto w-full max-w-md md:max-w-2xl',
        'max-md:h-[var(--app-screen-h)] max-md:flex max-md:flex-col max-md:overflow-hidden',
        'max-md:px-4 max-md:pt-1 max-md:pb-0',
        'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
        className,
      )}
    >
      <div
        className={cn(
          'max-md:flex max-md:flex-1 max-md:flex-col max-md:min-h-0 max-md:h-full',
          isScroll
            ? cn(
                'max-md:overflow-y-auto max-md:overscroll-contain',
                isSnap && 'app-scroll-snap',
              )
            : 'max-md:overflow-hidden',
        )}
      >
        {children}
      </div>
    </main>
  )
}
