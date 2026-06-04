# Configuración de Variables de Entorno

## Variables de Administración (Requerido)

```bash
ADMIN_USERNAME=admin@tudominio.com
ADMIN_PASSWORD=           # Mínimo 12 caracteres — generar con gestor de contraseñas
ADMIN_SESSION_SECRET=     # Mínimo 32 caracteres aleatorios (openssl rand -hex 32)

# Super admin BBX — solo tú; gestiona suscripciones de todas las radios
SUPER_ADMIN_USERNAME=     # Usuario distinto al admin de la radio
SUPER_ADMIN_PASSWORD=     # Mínimo 12 caracteres
```

**IMPORTANTE:** Nunca uses contraseñas de ejemplo en producción. Sin estas variables el panel `/admin` no funciona.

## Rate limiting en producción (Requerido en Vercel)

Los límites por IP usan **Upstash Redis** para funcionar entre instancias serverless:

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx
```

Crear base gratis en [console.upstash.com](https://console.upstash.com) → REST API → copiar URL y token a Vercel.

Sin Upstash, los límites solo aplican por instancia (modo desarrollo local).

## Supabase (Requerido)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...          # service_role — solo servidor, nunca en cliente
```

`SUPABASE_SERVICE_KEY` es **obligatoria** en producción. La app no usa la anon key como fallback en el servidor.

## Push notifications (opcional)

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@tudominio.com
```

## Sanity CMS

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=nmwhp66x
NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_TOKEN=   # opcional, para escritura desde scripts
```

## Radio Streams

```bash
NEXT_PUBLIC_RADIO_STREAM_URL=https://sonicstream-puntual.grupozgh.cl/8180/bienenida
NEXT_PUBLIC_RADIO_VIDEO_STREAM_URL=https://panel.tvstream.cl:1936/8012/8012/playlist.m3u8
```

## Google Tag Manager

```bash
NEXT_PUBLIC_GTM_ID=GTM-M8XHWNF
```

## Acceso al Panel de Administración

1. Configura las variables en `.env.local` (local) y en Vercel (producción).
2. Reinicia el servidor / redeploy.
3. Ve a `/admin` e ingresa credenciales.
4. Sesión admin: **24 horas** (cookie HttpOnly firmada).

## Seguridad implementada

- Cola de canciones (`GET /api/solicitudes`): solo admin autenticado.
- Votación: cookie firmada HttpOnly (no manipulable por header).
- Push: URLs solo internas; suscripciones con rate limit y validación.
- Oyentes en vivo: rate limit + tope de sesiones en memoria.
- Enlaces de anuncios: sanitizados server-side y en UI.
- Login admin: rate limit + contraseña mínima 12 caracteres.

## Suscripción BBX — corte por impago

Cada deploy de radio es un **tenant**. Si no pagan, la app cae a `/suspended`.

### 1. Supabase — ejecutar SQL

Corre `supabase-subscription.sql` en el SQL Editor y crea la fila del tenant:

```sql
INSERT INTO tenant_subscriptions (tenant_id, status, plan, current_period_end, billing_email)
VALUES ('bienvenida-933', 'active', 'pro', now() + interval '30 days', 'admin@radiobienvenida.cl');
```

(`tenant_id` debe coincidir con `TENANT_ID` o `RADIO.id` del deploy.)

### 2. Variables por deploy (Vercel)

```bash
TENANT_ID=bienvenida-933
SUBSCRIPTION_GRACE_DAYS=7          # días de gracia tras vencimiento
# Noticias en la app: false si nadie publica/depura en Studio (recomendado Bienvenida)
NEXT_PUBLIC_ENABLE_NOTICIAS=false
# Emergencia — corta sin Supabase:
# SUBSCRIPTION_STATUS=suspended
```

### Acceso al panel

| Rol | URL | Credenciales |
|-----|-----|--------------|
| **Equipo de la radio** | `/admin` | `ADMIN_USERNAME` + `ADMIN_PASSWORD` |
| **Super admin BBX (tú)** | `/bbx-admin` | `SUPER_ADMIN_USERNAME` + `SUPER_ADMIN_PASSWORD` |

Son **logins separados** en **URLs distintas**. El equipo de la radio no ve suscripciones ni conoce `/bbx-admin`.

### 3. Precios y planes (fuente única)

Ver **`docs/BBX_SUSCRIPCION.md`** y código `src/lib/bbxSubscriptionPlans.ts`.

| Plan | Mensual | Anual (10× mensual) | Setup |
|------|---------|---------------------|-------|
| Esencial | $80.000 | $800.000 | $100.000 |
| Pro | $120.000 | $1.200.000 | $150.000 |
| Premium | $160.000 | $1.600.000 | $200.000 |

Plantillas WhatsApp/email: `src/lib/bbxBillingTemplates.ts` · panel `/bbx-admin`.

### 4. Pago manual (transferencia / efectivo)

**Super admin BBX:** entra a **`/bbx-admin`** → **Pagado mes (+30 d)** o **Pagado año (+365 d)**.

El panel `/admin` de la radio **no incluye** gestión de suscripciones.

### 5. Pago automático con Stripe (opcional)

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...          # precio mensual recurrente
STRIPE_WEBHOOK_SECRET=whsec_...    # webhook → /api/billing/webhook
```

Eventos webhook: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`.

Checkout unificado: `POST /api/billing/checkout` con `{ plan: "pro", cycle: "monthly"|"annual" }`.

### 6. Mercado Pago (listo para conectar — stub en código)

Cuando tengas credenciales de producción:

```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
# MERCADOPAGO_WEBHOOK_SECRET=...   # validación firma (recomendado)
```

Implementar en `src/lib/mercadoPagoBilling.ts` + webhook `POST /api/billing/webhook-mp` (pendiente).

Hasta entonces: botón “Mercado Pago (próximamente)” en `/suspended` y pago manual en `/bbx-admin`.

### Centro de operaciones BBX (alertas al super admin)

**Panel:** `/bbx-admin` → **Centro de operaciones** (arriba de suscripciones).

**SQL:** ejecutar `supabase-bbx-ops.sql` en Supabase.

**Notificaciones automáticas** (elige una o más):

1. **ntfy (recomendado, gratis, llega al celular)**  
   - Instala [ntfy](https://ntfy.sh) en el teléfono y suscríbete a un topic privado, ej. `bbx-ops-tu-nombre`.  
   - En Vercel:
   ```bash
   BBX_OPS_WEBHOOK_URL=https://ntfy.sh/bbx-ops-tu-nombre
   BBX_OPS_NOTIFY_PHONE=56922105555
   BBX_OPS_CRON_SECRET=genera-un-secreto-largo
   ```
   - Cron Vercel cada 6 h (`vercel.json`) llama a `/api/cron/ops-check` con `Authorization: Bearer <secreto>`.

2. **WhatsApp manual** — botón “WhatsApp resumen” en el panel (abre wa.me con todas las alertas).

3. **SMS Twilio (opcional, solo críticos)**  
   ```bash
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_SMS_FROM=+1...
   BBX_OPS_NOTIFY_PHONE=56922105555
   ```

**Qué detecta:** radio suspendida, gracia de pago, vence en 3/7 días, cola de pedidos de tema, variables de entorno faltantes.

**Probar:** en `/bbx-admin` → “Probar notificación” o `GET /api/cron/ops-check` con el Bearer secret.

### Flujo de estados

| Estado | Qué ve el cliente |
|--------|-------------------|
| **active** | App normal |
| **trial** | App normal (días de prueba) |
| **grace** | App + banner “Pago pendiente” |
| **suspended** | Solo `/suspended` + admin + pagar |
