# Seguridad — Pulso / Radio Bienvenida

## Capas implementadas

| Capa | Qué hace |
|------|----------|
| **Proxy** (`src/proxy.ts`) | Rate limit global en POST `/api/*`, corte por suscripción, `/studio` oculto sin sesión admin |
| **Sesión admin** | Cookie `admin_session` firmada HMAC-SHA256, `httpOnly`, `sameSite=strict`, expiración server-side |
| **Login** | Comparación en tiempo constante, mínimo 12 caracteres en contraseñas de env, rate limit por IP |
| **Escrituras públicas** | `guardPublicWrite` (Origin = Host), honeypot, body JSON ≤ 8 KB |
| **Rate limits** | Upstash Redis en producción; fallback en memoria reducido si falta Redis |
| **URLs** | `sanitizeAdLink` / `sanitizePushUrl` bloquean `javascript:`, `data:`, etc. |
| **Push** | Suscripción solo HTTPS; envío solo con sesión admin + límite por usuario |
| **Cron** | Solo `Authorization: Bearer <BBX_OPS_CRON_SECRET>` (no usar `?secret=` en URL) |
| **Headers** | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` en `next.config.ts` |
| **Supabase** | `service_role` solo en servidor; RLS en tablas de oyentes (ver SQL en repo) |

## Auditoría automatizada

```bash
pnpm run security:audit
# o contra otro entorno:
AUDIT_BASE_URL=http://localhost:3000 pnpm run security:audit
```

Simula: acceso admin sin cookie, CSRF con Origin falso, cron sin token, payloads XSS/grandes, honeypot, ráfaga de login, headers de seguridad, webhook Stripe sin firma.

## Checklist Vercel (producción de confianza)

1. **Upstash Redis** — `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (rate limits reales).
2. **Admin** — `ADMIN_SESSION_SECRET` (32+ bytes aleatorios), `ADMIN_USERNAME` / `ADMIN_PASSWORD` (≥12 chars).
3. **Super admin BBX** — `SUPER_ADMIN_USERNAME` / `SUPER_ADMIN_PASSWORD` solo si usas `/bbx`.
4. **Cron** — `BBX_OPS_CRON_SECRET` en Vercel Cron con header Bearer, nunca en query string.
5. **Supabase** — RLS activo; no exponer `SUPABASE_SERVICE_KEY` al cliente.
6. **Stripe** — `STRIPE_WEBHOOK_SECRET` configurado.
7. **VAPID** — claves privadas solo en servidor.

## Dependencias

```bash
pnpm audit
```

Revisar y actualizar paquetes con vulnerabilidades high/critical.

## Qué no cubre la auditoría

- Pentest manual de Sanity Studio.
- Abuso de streaming (CDN externo).
- Fuerza bruta distribuida (mitigado con Upstash + contraseñas fuertes).
- Revisión de políticas RLS en Supabase (ejecutar scripts SQL del repo y validar en dashboard).

## Reportar

Incidentes o hallazgos: contacto del operador de la radio / equipo BBX.
