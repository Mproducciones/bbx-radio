# Reglas inmutables — agentes BBX

Estas reglas tienen prioridad sobre sugerencias creativas del modelo.

## Producto
1. PWA en Vercel es la prioridad; APK solo si el brief lo pide.
2. Planes: `basico` | `pro` | `premium` vía `NEXT_PUBLIC_PLAN` y `src/lib/plan.ts`.

## UI / UX
3. **Bottom nav**: no cambiar layout (centrado `max-w-md`) sin OK del cliente.
4. **Overflow móvil**: PASS obligatorio en 360px, 390px, 393px y 430px en rutas: `/`, `/programacion`, `/participa`, `/saludos`, `/bbx`, `/anunciate`.
5. **Reproductor**: solo pantalla completa en `/`; sin mini player global en otras rutas.
6. Español en copy visible al usuario.

## Código
7. `'use client'` en componentes con hooks, framer-motion o browser APIs.
8. Reutilizar tokens PULSO en `globals.css` (`--color-mag-400`, etc.).
9. Sin `console.log` en producción; sin secretos en repo.

## Git / deploy
10. No commit ni push automáticos.
11. Tras cambios pedidos por el usuario: `npm run agent:qa` antes de sugerir deploy.

## Memoria de errores ya pagados (no repetir)
- Swipe con rutas distintas al bottom nav → desincronización.
- `fe211c3`: cambió menú sin pedir → revertido.
- Aurora/atmosphere `fixed` + `scale` → scroll horizontal y recorte derecho.
- Player enorme en grilla → mini player slim + sin banner premium en listas.
