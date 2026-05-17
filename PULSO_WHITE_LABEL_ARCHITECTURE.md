# PULSO Platform — Arquitectura White-Label Multi-Radio

## Concepto central

Un solo repositorio. Un solo deployment base.
Cada radio es solo un archivo de configuración.

---

## Estructura de carpetas

```
pulso-platform/
│
├── core/                          # ← NUNCA se toca por cliente
│   ├── components/
│   │   ├── player/
│   │   │   ├── AudioVisualizer.tsx
│   │   │   ├── NowPlayingCard.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   └── VolumeSlider.tsx
│   │   ├── schedule/
│   │   │   ├── ProgramRow.tsx
│   │   │   └── ScheduleGrid.tsx
│   │   ├── request/
│   │   │   ├── SongRequestForm.tsx
│   │   │   └── TopRequests.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Toast.tsx
│   │       └── Skeleton.tsx
│   ├── hooks/
│   │   ├── useAudioStream.ts
│   │   ├── useNowPlaying.ts
│   │   └── useVisualizer.ts
│   └── lib/
│       ├── stream.ts
│       ├── metadata.ts            # Last.fm API
│       └── push.ts                # Firebase FCM
│
├── clients/                       # ← Un archivo por radio
│   ├── radio-fiessta.config.ts
│   ├── radio-bienvenida.config.ts
│   ├── radio-xxx.config.ts
│   └── ...
│
├── app/                           # Next.js App Router
│   └── [clientId]/                # Ruta dinámica por cliente
│       ├── page.tsx
│       ├── programas/page.tsx
│       ├── solicitar/page.tsx
│       └── layout.tsx
│
└── scripts/
    └── new-client.ts              # CLI para generar cliente nuevo
```

---

## El archivo de configuración por cliente

Esto es TODO lo que necesitas cambiar para una radio nueva:

```typescript
// clients/radio-fiessta.config.ts

import type { RadioConfig } from '@/core/types/radio'

const config: RadioConfig = {
  // ── Identidad ──────────────────────────────────
  id:       'radio-fiessta',
  name:     'Radio Fiessta',
  slogan:   'La Radio #1 de O\'Higgins',
  frequency: '90.9 FM',
  city:     'Rancagua',
  region:   'O\'Higgins',
  country:  'Chile',

  // ── Stream ─────────────────────────────────────
  streamUrl: process.env.FIESSTA_STREAM_URL!,
  streamBitrate: 128,

  // ── Colores (override del PULSO DS base) ───────
  theme: {
    primary:   '#FF006E',   // Magenta
    secondary: '#00D4FF',   // Cyan
    tertiary:  '#7B2FFF',   // Púrpura
    accent:    '#FFB300',   // Ámbar
    background:'#07070E',   // Oscuro
  },

  // ── Tipografía (opcional — default: Bebas Neue + Outfit)
  fonts: {
    display: 'Bebas Neue',
    ui:      'Outfit',
  },

  // ── Redes sociales ─────────────────────────────
  social: {
    facebook:  'https://facebook.com/radiofiessta',
    twitter:   'https://twitter.com/fiessta909',
    instagram: 'https://instagram.com/radiofiessta',
    whatsapp:  '+56990776060',
  },

  // ── Contacto ───────────────────────────────────
  contact: {
    phone:   '+56 72 224 6405',
    email:   'contacto@radiofiessta.cl',
    address: 'Millán 857, Rancagua',
  },

  // ── Programas ──────────────────────────────────
  programs: [
    {
      id:       'lado-b',
      name:     'Lado B',
      host:     'DJ Maichro',
      schedule: [{ day: 'daily', start: '03:00', end: '06:00' }],
      color:    '#7B2FFF',
      description: 'La música alternativa de madrugada',
    },
    {
      id:       'clan-marciano',
      name:     'Clan Marciano',
      host:     'Nacho Power',
      schedule: [{ day: 'daily', start: '06:00', end: '09:00' }],
      color:    '#FF006E',
      description: 'El despertar con más energía de Rancagua',
    },
    {
      id:       'sala-emergencia',
      name:     'Sala de Emergencia',
      host:     'Cristóbal Burgos',
      schedule: [{ day: 'daily', start: '09:00', end: '12:00' }],
      color:    '#00D4FF',
    },
    {
      id:       'fiesta-discotheque',
      name:     'Fiesta Discotheque',
      host:     'DJ Dylan',
      schedule: [{ day: 'daily', start: '12:00', end: '16:00' }],
      color:    '#FF8C00',
    },
    {
      id:       'power-fiessta',
      name:     'Power Fiessta',
      host:     'Natalia Romero',
      schedule: [{ day: 'daily', start: '16:00', end: '20:00' }],
      color:    '#FF006E',
    },
    {
      id:       'fiessta-mix',
      name:     'Fiessta Mix',
      host:     'Antonio Millán',
      schedule: [{ day: 'daily', start: '20:00', end: '24:00' }],
      color:    '#00D9A0',
    },
  ],

  // ── PWA ────────────────────────────────────────
  pwa: {
    shortName:       'Fiessta',
    themeColor:      '#FF006E',
    backgroundColor: '#07070E',
    icon192:         '/clients/fiessta/icon-192.png',
    icon512:         '/clients/fiessta/icon-512.png',
  },

  // ── Features habilitadas ────────────────────────
  features: {
    songRequest:     true,
    liveVideo:       true,
    events:          true,
    news:            true,
    advertiserPanel: true,
    pushNotifications: true,
    contests:        false,   // próximamente
  },

  // ── Analytics ──────────────────────────────────
  analytics: {
    gtmId: 'GTM-KB7W6B47',
  },
}

export default config
```

---

## Radio Bienvenida — solo cambias los valores

```typescript
// clients/radio-bienvenida.config.ts

import type { RadioConfig } from '@/core/types/radio'

const config: RadioConfig = {
  id:       'radio-bienvenida',
  name:     'Radio Bienvenida FM',
  slogan:   'Tu radio de siempre',
  frequency: '94.5 FM',          // ← cambias esto
  city:     'Santiago',           // ← y esto
  region:   'Metropolitana',
  country:  'Chile',

  streamUrl: process.env.BIENVENIDA_STREAM_URL!,
  streamBitrate: 128,

  theme: {
    primary:    '#0055A4',   // ← colores propios de Bienvenida
    secondary:  '#E8B400',
    tertiary:   '#003070',
    accent:     '#FF6B35',
    background: '#080810',
  },

  fonts: {
    display: 'Bebas Neue',   // puedes cambiar la fuente display
    ui:      'Outfit',
  },

  social: {
    facebook:  'https://facebook.com/radiobienvenida',
    instagram: 'https://instagram.com/radiobienvenida',
    whatsapp:  '+56912345678',
  },

  contact: {
    phone: '+56 2 2345 6789',
    email: 'contacto@radiobienvenida.cl',
  },

  programs: [
    // ← aquí van los programas de Bienvenida
    {
      id:       'buenos-dias',
      name:     'Buenos Días Bienvenida',
      host:     'María González',
      schedule: [{ day: 'weekday', start: '07:00', end: '10:00' }],
      color:    '#E8B400',
    },
    // ...más programas
  ],

  pwa: {
    shortName:       'Bienvenida',
    themeColor:      '#0055A4',
    backgroundColor: '#080810',
    icon192:         '/clients/bienvenida/icon-192.png',
    icon512:         '/clients/bienvenida/icon-512.png',
  },

  features: {
    songRequest:       true,
    liveVideo:         false,   // esta radio no tiene video
    events:            true,
    news:              true,
    advertiserPanel:   true,
    pushNotifications: true,
    contests:          false,
  },
}

export default config
```

---

## El tipo base (RadioConfig)

```typescript
// core/types/radio.ts

export interface RadioConfig {
  id:        string
  name:      string
  slogan?:   string
  frequency: string
  city:      string
  region:    string
  country:   string

  streamUrl:     string
  streamBitrate: number

  theme: {
    primary:    string
    secondary:  string
    tertiary:   string
    accent:     string
    background: string
  }

  fonts?: {
    display?: string
    ui?:      string
  }

  social: {
    facebook?:  string
    twitter?:   string
    instagram?: string
    whatsapp?:  string
    youtube?:   string
  }

  contact: {
    phone?:   string
    email?:   string
    address?: string
  }

  programs: Program[]

  pwa: {
    shortName:       string
    themeColor:      string
    backgroundColor: string
    icon192:         string
    icon512:         string
  }

  features: {
    songRequest:       boolean
    liveVideo:         boolean
    events:            boolean
    news:              boolean
    advertiserPanel:   boolean
    pushNotifications: boolean
    contests:          boolean
  }

  analytics?: {
    gtmId?: string
  }
}

export interface Program {
  id:          string
  name:        string
  host:        string
  schedule:    ScheduleSlot[]
  color:       string
  description?: string
  coverImage?: string
  podcastFeed?: string
  socialLinks?: Record<string, string>
}

export interface ScheduleSlot {
  day:   'daily' | 'weekday' | 'weekend' | 'monday' | 'tuesday' |
         'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start: string   // "06:00"
  end:   string   // "09:00"
}
```

---

## Script CLI para radio nueva (5 minutos)

```bash
# Correr para agregar una radio nueva al sistema
npx ts-node scripts/new-client.ts

# Te pregunta:
# > Nombre de la radio: Radio Bienvenida FM
# > ID (slug): radio-bienvenida
# > Frecuencia: 94.5 FM
# > Ciudad: Santiago
# > Color primario: #0055A4
# > Stream URL: https://stream.bienvenida.cl/live

# Genera automáticamente:
# ✓ clients/radio-bienvenida.config.ts  (con tus datos)
# ✓ public/clients/radio-bienvenida/    (carpeta de assets)
# ✓ .env.local entry: BIENVENIDA_STREAM_URL=
# ✓ Entrada en el registro de clientes
```

---

## Cómo desplegar cada radio

### Opción A — Un dominio por radio (recomendado)
```
radiofiessta.cl      → PULSO_CLIENT=radio-fiessta
radiobienvenida.cl   → PULSO_CLIENT=radio-bienvenida
```
Cada radio tiene su propio proyecto en Vercel apuntando al mismo repositorio,
con una variable de entorno `PULSO_CLIENT` diferente.

### Opción B — Subdominio
```
fiessta.pulsoradio.cl
bienvenida.pulsoradio.cl
```

### Opción C — Ruta dinámica (desarrollo / demo)
```
localhost:3000/radio-fiessta
localhost:3000/radio-bienvenida
```

---

## Checklist para onboarding de radio nueva

```
□ Llenar clients/[radio-id].config.ts
□ Logo SVG + PNG (192px y 512px) en public/clients/[id]/
□ Agregar STREAM_URL en .env.local y en Vercel
□ Configurar dominio en Vercel
□ Verificar stream funciona (correr: npm run check-stream [id])
□ Revisar colores en modo oscuro (contraste WCAG AA)
□ Probar PWA install prompt en Chrome mobile
□ Activar Firebase FCM para notificaciones push
□ Deploy y smoke test en producción
```

**Tiempo estimado por radio nueva: 2–4 horas**
(La primera vez tomó semanas. Cada cliente siguiente toma horas.)
