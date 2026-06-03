# AGENTS.md — PULSO / Radio Bienvenida

## Cursor Cloud specific instructions

### Stack y gestor de paquetes

- App única **Next.js 16** en la raíz (`pulso-app`). Usar **solo `pnpm`** (`pnpm install --frozen-lockfile`).
- Puerto de desarrollo: **3000** (`pnpm dev` → http://localhost:3000).

### Variables de entorno (obligatorio para build/dev)

No hay `.env.example` en el repo; la referencia es `ENV_SETUP.md`. Crear **`.env.local`** en la raíz (gitignored) antes de `pnpm dev` o `pnpm build`.

Mínimo para que compile y arranque:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (requerida en servidor al usar `supabaseAdmin`; sin clave válida las APIs con persistencia fallan)

Recomendado en Cloud Agent sin acceso a Supabase real:

- `SUBSCRIPTION_STATUS=active` — evita depender de la tabla `tenant_subscriptions` en dev.
- `NEXT_PUBLIC_PLAN=pro`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` (CMS; la UI funciona con fallbacks locales si Sanity no responde).

Sin `.env.local`, `next build` falla al evaluar `src/lib/supabase.ts`.

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

- El CI de GitHub compila con pocas env vars; en local **Supabase público es obligatorio** para el build actual.
- `src/proxy.ts` contiene lógica tipo middleware; no confundir con un `middleware.ts` aparte.
- Hot reload no recarga variables de `.env.local`; reiniciar `pnpm dev` tras cambiar env.
- APK Android (`pnpm build:apk`) requiere Android SDK; no es necesario para desarrollo web.
