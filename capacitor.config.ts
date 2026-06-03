import type { CapacitorConfig } from '@capacitor/cli'

// Producción APK: CAPACITOR_SERVER_URL=https://bbx-radio-9k9y.vercel.app (o pnpm cap:sync:prod)
// Dev en red local: CAPACITOR_SERVER_URL=http://192.168.1.X:3000 + build debug de Android
const PROD_APP_URL = 'https://bbx-radio-9k9y.vercel.app'
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ??
  (process.env.CAPACITOR_APK_PROD === '1' ? PROD_APP_URL : undefined)

const config: CapacitorConfig = {
  appId: 'cl.radiobienvenida.app',
  appName: 'Radio Bienvenida 93.3 FM',
  webDir: 'out',

  server: serverUrl
    ? {
        url: serverUrl,
        // Permitir HTTP solo en dev (en prod siempre HTTPS)
        cleartext: serverUrl.startsWith('http://'),
      }
    : undefined,

  android: {
    buildOptions: {
      releaseType: 'APK',
    },
    // Color de la barra de estado
    backgroundColor: '#07070E',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#07070E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
}

export default config
