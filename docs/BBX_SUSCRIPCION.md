# BBX — Plan de suscripción y facturación

Documento comercial + operativo. Precios canónicos en código: `src/lib/bbxSubscriptionPlans.ts`.

## ¿Los precios están altos o bajos?

**Veredicto: bien calibrados para radios regionales en Chile (2025–2026).**

| Plan | Mensual | Setup | Anual (10× mensual) |
|------|---------|-------|---------------------|
| Esencial | $80.000 | $100.000 | $800.000 |
| Pro (recomendado) | $120.000 | $150.000 | $1.200.000 |
| Premium | $160.000 | $200.000 | $1.600.000 |

### Por qué no están “muy bajos”

- Incluyen soporte, hosting, actualizaciones y panel — no es solo “una web”.
- El setup filtra curiosos y paga la puesta en marcha (48 h + capacitación).
- Pro a $120k se paga solo con **1–2 banners** en Capa 2 ($30–50k/slot).

### Por qué no están “muy altos”

- Un desarrollo a medida parte en millones CLP y no trae monetización lista.
- Competencia informal (solo Facebook/IG) no reemplaza app + métricas + sorteos.
- Premium solo se vende cuando ya hay Pro — no asusta en la primera venta.

### Ajustes futuros (si hace falta)

- Subir **solo Premium** +$20k si el trabajo Play Store se complica.
- No bajar Pro sin límite: es el plan que financia el producto.
- Pilotos: trial 14 días (ya en panel) o 1er mes -15% **solo por campaña**, no en lista pública.

---

## Dos capas (no mezclar en la conversación)

1. **Capa 1 — Radio paga a BBX** (este documento).
2. **Capa 2 — Comercio paga a la radio** (Anunciate: Básico $80k, Premium $150k, Empresarial $250k referencia).

---

## Ciclo de vida automático

| Estado | Oyente | Radio (admin) |
|--------|--------|----------------|
| `active` | App normal | Panel normal |
| `trial` | App normal | Días de prueba |
| `grace` | App + banner “Pago pendiente” | Aviso + pagar |
| `suspended` | Solo `/suspended` | Admin + pagar |

- Gracia por defecto: **7 días** (`SUBSCRIPTION_GRACE_DAYS`).
- Tras gracia: corte público (middleware → `/suspended`).
- Datos y Studio **no se borran**.

---

## Modalidades de pago

### Mensual

- Cuota cada 30 días desde último pago confirmado.
- Sin permanencia en contrato; en la práctica se renueva mes a mes.

### Anual

- Se cobra **10 meses** del precio mensual → **12 meses** de servicio.
- Ahorro explícito: **2 meses gratis** (~17%).
- Un webhook / confirmación MP extiende **365 días**.

### Setup (único)

- No va en el link recurrente MP.
- Se cobra aparte (transferencia o factura) al onboarding.

---

## Plantillas comerciales

Código: `src/lib/bbxBillingTemplates.ts`  
Panel: `/bbx-admin` → sección **Plantillas WhatsApp / email**.

IDs disponibles:

- `onboarding_welcome`
- `payment_reminder_3d`
- `grace_warning`
- `suspended_notice`
- `payment_confirmed`
- `annual_offer`
- `transfer_instructions`
- `contract_summary`

Variables: `{{radioName}}`, `{{planName}}`, `{{amountDue}}`, `{{periodEnd}}`, etc.

---

## Mercado Pago — cuándo conectar la API

**Listo para conectar cuando tengas:**

1. Cuenta MP producción + `MERCADOPAGO_ACCESS_TOKEN`.
2. `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (Checkout).
3. Webhook público → `POST /api/billing/webhook-mp` (por implementar).
4. Precios validados en este doc (no cambiar sin actualizar `bbxSubscriptionPlans.ts`).

Stub actual: `src/lib/mercadoPagoBilling.ts`  
Checkout unificado: `POST /api/billing/checkout` con `{ plan, cycle, provider: "mercadopago" }`.

---

## Checklist venta Pro (mensual)

1. Demo 24 h con su logo.
2. Contrato resumen (`contract_summary`).
3. Cobro setup + primer mes (o anual).
4. Alta en `tenant_subscriptions` (automático vía webhook o manual BBX).
5. Capacitación ventas: Capa 2 (banners).

---

## Referencia técnica

- Estados: `src/lib/subscription.ts`
- Planes públicos: `GET /api/billing/plans`
- Pago: `POST /api/billing/checkout`
- Super admin: `/bbx-admin` → Suscripciones + Plantillas
