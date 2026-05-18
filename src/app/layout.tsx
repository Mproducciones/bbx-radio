import type { Metadata, Viewport } from 'next'
import { ClientBottomNav } from '@/components/nav/ClientBottomNav'
import { DesktopSidebar } from '@/components/nav/DesktopSidebar'
import { AdminAccessButton } from '@/components/admin/AdminAccessButton'
import { RadioPlayerProvider } from '@/hooks/RadioPlayerContext'
import { WelcomeAnimation } from '@/components/WelcomeAnimation'
import { InstallBanner } from '@/components/pwa/InstallBanner'
import { ThreeFingerGesture } from '@/components/pwa/ThreeFingerGesture'
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
      <head>
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bienvenida 93.3" />
        <link rel="apple-touch-icon" href="/LOGO_BIENVENIDA (1)_PhotoGrid.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/LOGO_BIENVENIDA (1)_PhotoGrid.png" />
        
        {/* Splash Screen for iOS */}
        <link rel="apple-touch-startup-image" href="/splash-screen.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-screen.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-screen.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Service Worker Registration + auto-update */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    // Buscar actualizaciones cada 30 minutos
                    setInterval(function() { reg.update(); }, 30 * 60 * 1000);
                  }).catch(function() {});

                  // Recargar la página cuando el nuevo SW toma control
                  var refreshing = false;
                  navigator.serviceWorker.addEventListener('controllerchange', function() {
                    if (!refreshing) {
                      refreshing = true;
                      window.location.reload();
                    }
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <WelcomeAnimation />
        <RadioPlayerProvider>
          {/* Desktop: 2-column layout. Mobile: single column. */}
          <div className="md:flex md:h-screen md:overflow-hidden">
            <DesktopSidebar />
            <div className="flex-1 md:overflow-y-auto">
              {children}
              {/* Mobile-only bottom spacer so content clears the fixed BottomNav */}
              <div className="md:hidden" style={{ height: 'calc(64px + env(safe-area-inset-bottom, 16px))' }} />
            </div>
          </div>
          <ThreeFingerGesture />
          <ClientBottomNav />
          <InstallBanner />
          <AdminAccessButton />
        </RadioPlayerProvider>
      </body>
    </html>
  )
}