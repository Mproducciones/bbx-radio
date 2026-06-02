import type { Metadata, Viewport } from 'next'
import { ClientBottomNav } from '@/components/nav/ClientBottomNav'
import { DesktopSidebar } from '@/components/nav/DesktopSidebar'
import { AdminAccessButton } from '@/components/admin/AdminAccessButton'
import { RadioPlayerProvider } from '@/hooks/RadioPlayerContext'
import { WelcomeAnimation } from '@/components/WelcomeAnimation'
import { InstallBanner } from '@/components/pwa/InstallBanner'
import { MiniPlayer } from '@/components/player/MiniPlayer'
import { SwipeLayout } from '@/components/layout/SwipeLayout'
import { PremiumAdBanner } from '@/components/ads/PremiumAdBanner'
import { AtmosphereWrapper } from '@/components/layout/AtmosphereWrapper'
import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { ThreeFingerGesture } from '@/components/pwa/ThreeFingerGesture'
import { PushPermission } from '@/components/pwa/PushPermission'
import { NoiseOverlay } from '@/components/pwa/NoiseOverlay'
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister'
import './globals.css'

export const metadata: Metadata = {
  title: 'Radio Bienvenida 93.3 FM',
  description: 'Escucha Radio Bienvenida 93.3 FM en vivo desde Rancagua. Tu radio favorita.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bienvenida 93.3',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Bienvenida 93.3',
    'application-name': 'Bienvenida 93.3',
    'msapplication-TileColor': '#db8918',
    'msapplication-config': '/browserconfig.xml',
  },
  openGraph: {
    type: 'website',
    siteName: 'Radio Bienvenida 93.3 FM',
    title: 'Radio Bienvenida 93.3 FM — Rancagua',
    description: 'Escúchanos en vivo. Tu radio en Rancagua.',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Radio Bienvenida 93.3 FM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radio Bienvenida 93.3 FM',
    description: 'Escúchanos en vivo. Tu radio en Rancagua.',
    images: ['/icons/icon-512.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#07070E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <WelcomeAnimation />
        <RadioPlayerProvider>
          <AuroraBackground />
          <AtmosphereWrapper />
          {/* Desktop: 2-column layout. Mobile: single column. */}
          <div className="md:flex md:h-screen md:overflow-hidden">
            <DesktopSidebar />
            <div className="flex-1 md:overflow-y-auto max-md:h-[var(--app-screen-h)]">
              <SwipeLayout>
                {children}
              </SwipeLayout>
            </div>
          </div>
          <ThreeFingerGesture />
          <PushPermission />
          <NoiseOverlay />
          <PremiumAdBanner />
          <ClientBottomNav />
          <InstallBanner />
          <AdminAccessButton />
        </RadioPlayerProvider>
      </body>
    </html>
  )
}