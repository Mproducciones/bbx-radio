# AGENTS.md — PULSO / Radio Bienvenida

## Cursor Cloud specific instructions

### Stack y gestor de paquetes

- App única **Next.js 16** en la raíz (`pulso-app`). Usar **solo `pnpm`** (`pnpm install --frozen-lockfile`).
- Puerto de desarrollo: **3000** (`pnpm dev` → http://localhost:3000).

### Variables de entorno (obligatorio para build/dev)

Plantilla: **`.env.example`** → copiar a **`.env.local`** (gitignored). Detalle en **`ENV_SETUP.md`**.

Mínimo para que compile y arranque:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (requerida al importar `supabaseAdmin` en rutas API)

**Cloud Agent sin secretos del usuario:** con placeholders en `.env.local` + `SUBSCRIPTION_STATUS=active` + Sanity (`nmwhp66x` / `production`) basta para **UI, player, build y `agent:qa`**. La persistencia real (solicitudes, saludos, admin con DB) necesita claves Supabase válidas en Vercel o en secrets locales.

Sin `.env.local`, `next build` falla al evaluar `src/lib/supabase.ts`.

### Producción

- App: https://bbx-radio-9k9y.vercel.app/
- Deploy: integración GitHub → Vercel en push a `main` (mismas env vars que en el dashboard del proyecto).

### Servicios

| Servicio | Cómo |
|----------|------|
| **Next.js dev** | Proceso local: `pnpm dev` (incluye `/studio` embebido) |
| **Supabase, Sanity, streams, Upstash, Stripe** | SaaS remoto; no hay Docker local |

Para sesiones largas (dev server, pruebas), usar **tmux** (p. ej. sesión `pulso-dev`).

### Lint, tests y QA

Ver `package.json` y `.github/workflows/ci.yml`:

```bash
npx tsc --noEmit
pnpm exec eslint src --max-warnings 50
node scripts/validate.mjs
pnpm build
pnpm agent:qa
```

QA visual (overflow 360px): servidor en `:3000` + `QA_URL=http://localhost:3000 pnpm agent:qa:visual` (requiere Chromium: `npx playwright install chromium`).

Reglas de producto y overflow móvil: `.cursor/rules/bbx-pulso.mdc` (`npm run agent:qa` / `agent:qa:visual`).

### Gotchas

- El CI en `.github/workflows/ci.yml` usa Node 22, pnpm 10 y `pnpm run agent:qa` (validate + build) con env de placeholder alineadas a `.env.example`.
- `src/proxy.ts` contiene lógica tipo middleware; no confundir con un `middleware.ts` aparte.
- Hot reload no recarga variables de `.env.local`; reiniciar `pnpm dev` tras cambiar env.
- APK Android (`pnpm build:apk`) requiere Android SDK; no es necesario para desarrollo web.
