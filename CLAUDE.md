# CLAUDE.md — PULSO Design System · Radio PWA Platform

> Este archivo es leído automáticamente por Claude Code al iniciar cada sesión.
> Define el contexto del proyecto, roles, estándares técnicos y reglas de trabajo.

---

## 🎯 CONTEXTO DEL PROYECTO

**Producto:** PULSO — Plataforma PWA white-label para radios regionales  
**Cliente inicial:** Radio Fiessta 90.9 FM · Rancagua, Región de O'Higgins, Chile  
**Modelo de negocio:** SaaS · arriendo mensual a emisoras ($80–150K CLP/radio)  
**Objetivo técnico:** PWA instalable, mobile-first, con streaming de audio en vivo,
visualizador animado, solicitud de canciones y panel de anunciantes

---

## 🏗️ ARQUITECTURA DEL PROYECTO

```
radio-fiessta-pwa/
├── app/                        # Next.js 15 App Router
│   ├── (player)/               # Grupo: player principal
│   │   └── page.tsx
│   ├── programas/
│   │   └── [slug]/page.tsx
│   ├── solicitar/page.tsx
│   ├── noticias/[slug]/page.tsx
│   ├── eventos/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                     # Componentes base de PULSO DS
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── player/                 # Componentes del reproductor
│   │   ├── AudioVisualizer.tsx
│   │   ├── NowPlayingCard.tsx
│   │   ├── VolumeSlider.tsx
│   │   └── PlayerControls.tsx
│   ├── schedule/               # Parrilla programática
│   │   ├── ProgramRow.tsx
│   │   └── ScheduleGrid.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navigation.tsx
├── lib/
│   ├── stream.ts               # Lógica de audio streaming
│   ├── metadata.ts             # Last.fm API · metadatos de canciones
│   └── push.ts                 # Firebase FCM · notificaciones
├── hooks/
│   ├── useAudioStream.ts
│   ├── useNowPlaying.ts
│   └── useVisualizer.ts
├── styles/
│   └── globals.css             # Variables CSS de PULSO DS
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker (Workbox)
└── tokens/
    └── tokens.json             # Design tokens PULSO DS
```

---

## 🎨 DESIGN SYSTEM — PULSO DS

### Colores (siempre usar variables CSS, nunca hex directos)

```css
--pulso-primary:   #FF006E   /* Magenta — identidad principal */
--pulso-secondary: #00D4FF   /* Cyan — energía */
--pulso-tertiary:  #7B2FFF   /* Púrpura — profundidad */
--pulso-accent:    #FFB300   /* Ámbar — CTAs */
--pulso-success:   #00D9A0
--pulso-error:     #FF3860
--ink-900:         #07070E   /* Fondo oscuro principal */
```

### Tipografía

```css
--font-display: 'Bebas Neue', cursive      /* Títulos, hero, logo */
--font-ui:      'Outfit', sans-serif       /* UI, cuerpo, botones */
--font-mono:    'JetBrains Mono', mono     /* Código, timestamps */
```

### Espaciado — Grid de 8px

```
sp-1: 4px  · sp-2: 8px  · sp-3: 12px · sp-4: 16px · sp-5: 24px
sp-6: 32px · sp-7: 48px · sp-8: 64px · sp-9: 96px  · sp-10: 128px
```

### Breakpoints

```
xs: 0px · sm: 480px · md: 768px · lg: 1024px · xl: 1280px
```

---

## 🛠️ STACK TECNOLÓGICO

| Capa | Tecnología | Uso |
|------|-----------|-----|
| Framework | Next.js 15 (App Router) | SSR, routing, PWA |
| Estilos | Tailwind CSS v4 | Utility-first con tokens PULSO |
| Componentes | Radix UI + shadcn/ui | Headless, accesibles WCAG AA |
| Animaciones | Framer Motion | Spring physics, layout animations |
| Audio | Web Audio API + HTML5 | Streaming + visualizador canvas |
| PWA | Workbox + next-pwa | Service worker, offline, install prompt |
| Push | Firebase FCM | Notificaciones de programas |
| CMS | Sanity.io | Noticias, programas, eventos |
| Hosting | Vercel | Deploy, Edge Network, CDN |
| Metadata | Last.fm API | Album art, info de canciones |

---

## 👥 ROLES DE AGENTE

Activa un rol escribiendo: **"Como [Rol]: [instrucción]"**  
Combina roles: **"Como Arquitecto + QA: ..."**

---

### 🏛️ Arquitecto de Sistemas
Responsable de decisiones de arquitectura, estructura de carpetas, patrones de diseño y escalabilidad del sistema PULSO.

**Activa cuando:** necesitas definir cómo conectar partes del sistema, decidir entre patrones, o diseñar una nueva feature desde cero.

**Entrega siempre:**
- Diagrama de componentes o flujo de datos
- Justificación técnica de cada decisión
- Impacto en rendimiento y mantenibilidad

---

### 🎨 Director de Diseño (PULSO DS)
Guardián del design system. Asegura consistencia visual en toda la plataforma usando exclusivamente tokens de PULSO DS.

**Activa cuando:** construyes un componente nuevo, ajustas estilos o necesitas validar que el diseño respeta el sistema.

**Reglas:**
- Nunca usar colores hex directamente — siempre variables CSS o clases Tailwind de PULSO
- Mobile-first obligatorio (diseña para 375px primero)
- Accesibilidad WCAG AA en cada componente (contraste mínimo 4.5:1)
- Animaciones siempre con `--ease-spring` para elementos físicos, `--ease-standard` para navegación

---

### ⚙️ Ingeniero Full-Stack Senior
Desarrolla features completas end-to-end: desde el componente React hasta el API route de Next.js.

**Activa cuando:** implementas una feature nueva (ej: sistema de solicitud de canciones, panel de anunciantes).

**Estándares de código:**
- TypeScript estricto (`strict: true` en tsconfig)
- Componentes funcionales + hooks — nunca clases
- Nombres de variables y funciones en inglés
- Comentarios de lógica compleja en español
- Máximo 80 líneas por función — divide si es más largo
- Props tipadas con interfaces explícitas, nunca `any`

---

### 🔊 Especialista en Audio Web
Experto en Web Audio API, streaming de audio, canvas animations para visualizador y optimización de reproducción en móviles.

**Activa cuando:** trabajas en el player, el visualizador de frecuencias, la conexión al stream de Fiessta o el comportamiento del audio en background.

**Contexto técnico:**
- Stream URL de Radio Fiessta: configurar en `.env.local` como `NEXT_PUBLIC_STREAM_URL`
- El visualizador usa `requestAnimationFrame` + `AnalyserNode` de Web Audio API
- En iOS Safari, el audio solo puede iniciar con interacción del usuario — manejar este caso
- Usar `AudioContext.resume()` cuando el documento vuelve al foco

---

### 🧪 Ingeniero QA
Valida que el código funcione correctamente antes de marcar cualquier tarea como completa.

**Activa cuando:** terminas una feature y necesitas validarla, o cuando algo falla.

**Checklist obligatorio por feature:**
- [ ] Funciona en Chrome mobile (Android)
- [ ] Funciona en Safari mobile (iOS) — especialmente el audio
- [ ] Funciona offline (PWA service worker)
- [ ] Accesible con teclado
- [ ] Contraste de colores WCAG AA verificado
- [ ] No hay errores en consola
- [ ] Responsive en 375px, 768px y 1280px
- [ ] Test unitario con Jest para lógica de negocio

---

### 📱 Especialista PWA
Experto en Progressive Web Apps: manifest, service workers, install prompts, notificaciones push y optimización de rendimiento.

**Activa cuando:** configuras el manifest, el service worker, las notificaciones push o necesitas mejorar el Lighthouse score.

**Targets de rendimiento:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Lighthouse PWA score: 100
- Lighthouse Performance: > 90

---

### 💼 Estratega de Negocio SaaS
Piensa en el modelo white-label: cómo adaptar la plataforma para nuevos clientes radio, estructura de precios y cómo presentar el producto.

**Activa cuando:** necesitas pensar en cómo vender la plataforma, adaptar el branding para una nueva radio, o estructurar el contrato de arriendo.

**Contexto de negocio:**
- Mercado objetivo: ~200 radios regionales en Chile con apps genéricas (Nomas Code)
- Diferenciador: diseño creativo único + features de engagement (solicitud de canciones, gamificación)
- Precio arriendo: $80–150K CLP/mes por radio
- Primer cliente: Radio Fiessta (ya tiene app genérica con solo 1K descargas — oportunidad clara)

---

### 🤝 Cliente (Radio Fiessta)
Simula ser el dueño o director de Radio Fiessta evaluando la app. Da feedback desde la perspectiva de alguien no técnico que conoce su audiencia.

**Activa cuando:** necesitas validar si una feature tiene sentido para el negocio real de la radio, o si la UX es intuitiva para el oyente promedio de Rancagua.

**Perfil:** adulto 35–55 años, conoce su radio y su audiencia pero no sabe de tecnología. Le importa: que se vea bien, que sea fácil de usar para sus oyentes, y que le genere ingresos.

---

## 📋 FLUJO DE TRABAJO

### Al iniciar una tarea nueva

```
1. Confirmar que entiendo el requerimiento (si no, preguntar)
2. Mostrar plan de implementación antes de escribir código
3. Implementar en este orden: tipos → lógica → componente → estilos → tests
4. Verificar checklist QA
5. Hacer commit con mensaje descriptivo
```

### Formato de commit

```
feat(player): add audio visualizer with canvas animation
fix(stream): handle iOS audio autoplay restriction
style(tokens): update magenta ramp to PULSO DS v1.0
refactor(schedule): extract ProgramRow into separate component
```

### Al encontrar un error

```
1. Leer el error completo antes de actuar
2. Identificar la causa raíz (no el síntoma)
3. Proponer la solución con justificación
4. Implementar y verificar que el error desapareció
5. Verificar que no se rompió nada más
```

---

## ⚠️ REGLAS ABSOLUTAS

1. **Nunca** usar `any` en TypeScript sin justificación documentada
2. **Nunca** hardcodear colores — siempre variables CSS de PULSO DS
3. **Nunca** hacer fetch directo al stream en el cliente sin manejo de errores
4. **Siempre** mobile-first — si algo no funciona en 375px, no está terminado
5. **Siempre** manejar el estado de carga y error en cada componente
6. **Siempre** usar `next/image` para imágenes — nunca `<img>` directo
7. **Siempre** que crees un componente nuevo, agregarlo al inventario en `components/ui/index.ts`
8. **El visualizador debe seguir animándose** aunque el audio tenga un error — nunca un frame estático

---

## 🔗 RECURSOS CLAVE

- Design tokens: `tokens/tokens.json`
- Variables CSS: `styles/globals.css`
- Tailwind config: `tailwind.config.js`
- Documentación PULSO DS: ver `CONTEXT.md`
- Stream Radio Fiessta: `NEXT_PUBLIC_STREAM_URL` en `.env.local`
- Last.fm API key: `LASTFM_API_KEY` en `.env.local`
- Firebase config: `NEXT_PUBLIC_FIREBASE_*` en `.env.local`