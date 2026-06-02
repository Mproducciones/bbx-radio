import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface AppMenuScreenProps {
  children: ReactNode
  className?: string
  /** Scroll interno solo si el contenido no cabe (replay, anunciate) */
  scroll?: boolean
}

/** Contenedor móvil: una pantalla = viewport menos bottom nav. Desktop sin cambios. */
export function AppMenuScreen({ children, className, scroll = false }: AppMenuScreenProps) {
  return (
    <main
      className={cn(
        'relative z-[1] mx-auto w-full max-w-md md:max-w-2xl',
        'max-md:h-[var(--app-screen-h)] max-md:flex max-md:flex-col max-md:overflow-hidden',
        'max-md:px-4 max-md:pt-2 max-md:pb-1',
        'md:min-h-screen md:px-4 md:pt-6 md:pb-24',
        className,
      )}
    >
      <div
        className={cn(
          'max-md:flex max-md:flex-1 max-md:flex-col max-md:min-h-0',
          scroll
            ? 'max-md:overflow-y-auto max-md:overscroll-contain max-md:[-webkit-overflow-scrolling:touch]'
            : 'max-md:overflow-hidden',
        )}
      >
        {children}
      </div>
    </main>
  )
}
