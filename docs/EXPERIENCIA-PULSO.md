# Experiencia PULSO — Radio Bienvenida

Documento maestro de UX, copy y motion. **Colores corporativos fijos:** `#db8918` (ámbar), `#40B9BF` (cyan), `#7D59B5` (violeta), `#00D9A0` (mint).

---

## Visión

Una app de radio que se siente **viva**: misma barra de contexto en todas las tabs oyente, transiciones suaves, copy chileno y honesto, publicidad en slots fijos.

---

## Fase 1 — Entregada (base unificada)

| Área | Cambio |
|------|--------|
| **Layout** | `AppMenuScreen` con `contextBar` + `app-gutter-x` en Programación, Participa, Saludos |
| **Header** | `TabContextBar` compartida (nombre, slogan, dot live, TV, notifs, chip FM) |
| **Motion** | Crossfade entre tabs (`SwipeLayout` + `tabCrossfade`) |
| **Copy** | Slogan FM, hooks Saludos rotativos, taglines motivos, hint play, CTA Anunciate |
| **CSS** | Safe-top duplicado eliminado; estilos live dot y scroll-tab-shell |
| **Patrocinadores** | Hero card alineado con tono Anunciate |

### Archivos clave

- `src/components/layout/TabContextBar.tsx`
- `src/components/layout/AppMenuScreen.tsx`
- `src/components/layout/SwipeLayout.tsx`
- `src/lib/saludosCopy.ts`
- `src/lib/motion/framer.ts` → `tabCrossfade`

---

## Fase 2 — Propuesta (próxima)

1. **Atmosphere ligero** en tabs scroll (gradiente sutil, no solo En Vivo).
2. **Empty states** con voz radio: cola Saludos vacía, sin programación hoy.
3. **Haptics** al cambiar tab (Capacitor / Vibration API donde aplique).
4. **Nav metadata** centralizada en `appNavRoutes.ts` (título + accent por tab).
5. **Programación**: snap scroll opcional en bloques horarios.
6. **Participa**: micro-animaciones al enviar solicitud (confetti sutil ámbar/cyan).

---

## Fase 3 — Propuesta (premium)

1. **Transición En Vivo ↔ scroll** con continuidad del player (sin parpadeo de estado).
2. **Copy dinámico** según hora (mañana / tarde / noche) en hints y banners.
3. **Patrocinadores**: logos con hover glow por color de marca (dentro de paleta).
4. **Anunciate**: un solo H1 (eliminar duplicado hero vs landing).
5. **PWA install** prompt con copy regional (“Instala la 93.3 en tu pantalla”).

---

## Voz de marca

| Contexto | Tono |
|----------|------|
| Oyente | Cercano, FM en vivo, O'Higgins |
| Anunciante | Datos verificables, sin hype inventado |
| Saludos / Participa | Emoción + claridad (“al aire en segundos”) |

**No usar:** cifras de rating por emisora no verificadas, “+15K oyentes” inventados.

---

## Verificación

```bash
npm run agent:qa
```

Probar en 360px (Android) y 390px (iPhone): sin overflow horizontal, gutter igual en todas las tabs, crossfade al navegar, publicidad no empuja layout.

---

## Restricciones de producto

- No modificar **BottomNav** (6 tabs) sin OK explícito del Director.
- No **mini reproductor** global flotante.
- WhatsApp anunciantes: **56950291592**.
- TV activa → pausa radio; al cerrar TV → resume solo si estaba sonando.
