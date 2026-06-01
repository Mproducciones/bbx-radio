# BBX Radio System — Manual Interno

> Documento privado BBX · No compartir con clientes

---

## Propuesta de valor en 30 segundos

> "¿Tu radio tiene app? Con BBX tu estación tiene una app profesional instalable en cualquier celular, con reproductor en vivo, programación, noticias y más — sin pagar desarrollo. Pago mensual, sin contrato anual, con soporte incluido."

---

## Proceso de venta

| Paso | Acción |
|------|--------|
| 1. Prospección | Busca radios FM locales en Google Maps. Filtra las que no tienen app o tienen un sitio web desactualizado. |
| 2. Primer contacto | Llama o escribe al WhatsApp de la radio. Preséntate como BBX y ofrece una demo gratis de 15 minutos. |
| 3. Demo en vivo | Muéstrales la app funcionando con su radio como ejemplo real. Deja que la instalen en su celular. |
| 4. Propuesta | Envía el PDF con los planes y precios. Recomienda el plan Pro para radios activas. |
| 5. Cierre | Cobra el setup y el primer mes. Configura la app en 48–72 horas. |
| 6. Onboarding | Capacita al operador con el manual. Queda disponible por WhatsApp para dudas. |

---

## Objeciones frecuentes

**"Ya tenemos página web"**
→ Una web no se instala en el celular ni funciona sin internet. Una app PWA sí. ¿Cuándo actualizaron el sitio por última vez?

**"Es muy caro"**
→ Una app nativa en App Store cuesta $5–15 millones de desarrollo, más $1.000 USD/año en Apple. Acá pagas $80.000/mes y ya está lista.

**"No sabemos manejarlo"**
→ El panel es igual de simple que Facebook. Te capacito y quedo disponible por WhatsApp para cualquier duda.

**"Necesito consultarlo"**
→ Sin problema, te envío la propuesta escrita. ¿A qué correo te la mando? *(siempre cierra con una acción)*

---

## Planes y precios

| Plan | Mensual | Setup | Incluye |
|------|---------|-------|---------|
| Básico | $60.000 | $80.000 | Reproductor + programación. Sin panel de contenido. |
| Pro | $80.000 | $100.000 | Todo: noticias, eventos, replay, publicidad, panel admin. |
| Premium | $120.000 | $150.000 | Pro + lanzamientos musicales + APK Android + dominio propio. |

> El setup se cobra una sola vez al contratar. El primer mes se paga junto con el setup.
> Cancelación con 30 días de aviso, sin multa.

---

## Proyección de ingresos

| Radios | Plan | Ingresos | Gastos aprox. | Neto/mes |
|--------|------|----------|---------------|----------|
| 3 | Pro | $240.000 | ~$30.000 | **~$210.000** |
| 5 | Pro | $400.000 | ~$35.000 | **~$365.000** |
| 8 | Pro | $640.000 | ~$50.000 | **~$590.000** |
| 10 | Mix | $860.000 | ~$60.000 | **~$800.000** |

> + Ingresos de setup: $100.000 por cada radio nueva (se cobra una sola vez al contratar)

---

## Requerimientos al cliente para configurar su app

> Esto es lo que debes pedirle a la radio antes de empezar.
> Sin estos datos no puedes configurar la app.

### 1. Logo de la radio
- Formato PNG con fondo transparente
- Mínimo 512×512 px (cuadrado)
- Si tienen versión horizontal también, pedirla
- Aparece en la pantalla de inicio, al instalar la app y en la barra de navegación

### 2. Color principal
- Código hexadecimal exacto (#RRGGBB) — pídelo al diseñador
- Si no lo saben, decir "el mismo color de nuestra web" y extraerlo tú
- Se aplica en botones, íconos activos y acentos de toda la app

### 3. URL del stream de audio
- Puede ser HLS (.m3u8) o URL directa (Icecast, SHOUTcast, etc.)
- Lo entrega el proveedor de streaming: Sonic Panel, Centova, Zeno FM, etc.
- **Verificar que el stream esté activo ANTES de entregar la app**
- Si no tienen streaming contratado, orientarlos — Sonic Panel desde ~$5 USD/mes

### 4. Redes sociales
- Link completo de Facebook (ej: facebook.com/RadioBienvenida)
- Link completo de Instagram
- Link de Twitter/X
- Número de WhatsApp con código de país (+56XXXXXXXXX)
- El WhatsApp también se usa como botón de contacto en publicidad

### 5. Programación semanal
Para cada programa necesitas:
- Nombre del programa
- Nombre del conductor
- Días que se emite (lunes a domingo)
- Horario de inicio y término

> La app marca automáticamente qué programa está "EN VIVO" según el horario.
> Si no tienen programación fija, pueden dejarlo genérico ("Transmisión en vivo").

### 6. Contenido inicial (opcional pero recomendado)
- 2 o 3 noticias para mostrar la sección funcionando
- 1 o 2 eventos próximos
- Logo de al menos 1 anunciante para el banner de publicidad

---

## Checklist antes de entregar la app

- [ ] Logo cargado correctamente en la app
- [ ] Color de marca aplicado en toda la UI
- [ ] Stream de audio reproduce sin cortes
- [ ] Programación cargada y el "en vivo" funciona por horario
- [ ] Noticias y eventos publicados en Sanity
- [ ] Redes sociales vinculadas correctamente
- [ ] App instalable en Android (botón "Instalar")
- [ ] App instalable en iOS (Compartir → Agregar a inicio)
- [ ] Se entrega usuario y contraseña del panel /admin al cliente
- [ ] Se capacita brevemente al operador sobre el Studio

> Tiempo estimado de configuración: **48 a 72 horas** desde que se reciben todos los materiales.

---

## Cotización de desarrollo adicional

| Servicio | Precio |
|----------|--------|
| Replay automático con YouTube | $800.000 – $1.200.000 (una vez) + VPS ~$14.000/mes |
| Integración noticias desde web del cliente | $300.000 – $500.000 |
| Subdominio propio (ej: app.turadiofm.cl) | Incluido en Premium |
| Configuración DNS (subdominio) | Sin costo adicional |

---

*BBX Radio System · Manual interno · Mayo 2026 · Confidencial*
