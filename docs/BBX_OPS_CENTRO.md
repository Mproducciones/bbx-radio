# Centro de operaciones BBX

## Para ti (super admin)

Entra a **`/bbx-admin`** con `SUPER_ADMIN_USERNAME` / `SUPER_ADMIN_PASSWORD`.

El bloque **Centro de operaciones** muestra todo lo que requiere acción:

| Severidad | Ejemplos |
|-----------|----------|
| Crítico | Radio suspendida, falta `SUPABASE_SERVICE_KEY` |
| Aviso | Gracia de pago, vence en ≤3 días, muchos pedidos de tema sin revisar |
| Info | Vence en 7 días, saludos pendientes |

Botones:

- **Actualizar** — escaneo en vivo
- **Enviar alertas ahora** — push a webhook/SMS
- **Probar notificación** — mensaje de test
- **WhatsApp resumen** — abre chat con listado (siempre disponible)
- **OK** en cada tarjeta — marca como visto (no vuelve a molestar hasta que se resuelva y reaparezca)

## Configurar notificaciones en el teléfono (5 min)

1. Instala la app **ntfy** (Android/iOS).
2. Suscríbete al topic `bbx-ops-TUNOMBRE` (elige uno difícil de adivinar).
3. En Vercel del proyecto:
   ```
   BBX_OPS_WEBHOOK_URL=https://ntfy.sh/bbx-ops-TUNOMBRE
   BBX_OPS_CRON_SECRET=<openssl rand -hex 24>
   BBX_OPS_NOTIFY_PHONE=56922105555
   ```
4. Ejecuta `supabase-bbx-ops.sql` en Supabase.
5. Redeploy.
6. En `/bbx-admin` → **Probar notificación**.

Vercel ejecutará el chequeo cada **6 horas** automáticamente.

## Manual del cron

```bash
curl -H "Authorization: Bearer TU_BB_OPS_CRON_SECRET" \
  "https://TU-DOMINIO.vercel.app/api/cron/ops-check"
```

## SMS

Opcional con Twilio. Solo se envía en alertas **críticas** para no gastar crédito.
