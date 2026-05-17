import type { CapacitorConfig } from '@capacitor/cli'

// Para desarrollo local: CAPACITOR_SERVER_URL=http://192.168.1.X:3000 (IP de tu PC en la red)
// Para producción:       CAPACITOR_SERVER_URL=https://tu-app.vercel.app
const serverUrl = process.env.CAPACITOR_SERVER_URL

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
