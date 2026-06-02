# Configuración de Variables de Entorno

## Variables de Administración (Requerido para acceder al panel)

```bash
# Admin Authentication
ADMIN_USERNAME=admin@demo.com
ADMIN_PASSWORD=123456
ADMIN_SESSION_SECRET=mi-secreto-seguro-para-sesiones
```

**IMPORTANTE:** Estas variables son obligatorias para acceder al panel de administración en `/admin`. Sin ellas, el login no funcionará.

## Variables de Sanity CMS

Para que el panel de administración funcione completamente, necesitas configurar las siguientes variables en tu archivo `.env.local`:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=nmwhp66x
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity API Token (opcional, para escritura)
# SANITY_API_TOKEN=tu-api-token-aqui
```

**NOTA:** Ya tienes configurado el Project ID (nmwhp66x) en tu `.env.local`. Solo necesitas crear un API Token si quieres poder escribir/editar contenido desde el panel de Sanity.

## Cómo obtener el API Token de Sanity (opcional)

1. Ve a [sanity.io/manage](https://sanity.io/manage)
2. Selecciona tu proyecto "Radio Bienvenida"
3. En Settings > API > Tokens, crea un token con permisos de escritura
4. Agrega el token a tu archivo `.env.local` como `SANITY_API_TOKEN=tu-token-aqui`

## Programación (Sanity Studio)

1. Entra a `/studio` → **Programa**
2. Crea cada bloque con nombre, conductor, `HH:MM` inicio/fin y días de emisión
3. La home usa Sanity si hay al menos un programa; si no, usa `PROGRAMS` en `src/lib/radioConfig.ts`
4. Se revalida cada 5 minutos (`revalidate = 300`)

## Clima en el reproductor (opcional)

El widget de ciudad / hora / clima usa [Open-Meteo](https://open-meteo.com) (gratis, sin API key).
Configura coordenadas en `src/lib/radioConfig.ts` → `location: { label, lat, lon, timezone }`.
Si no hay `location`, se geocodifica `city` + `country`.

## Variables de Radio Bienvenida

```bash
# Radio Streams
NEXT_PUBLIC_RADIO_STREAM_URL=https://sonicstream-puntual.grupozgh.cl/8180/bienenida
NEXT_PUBLIC_RADIO_VIDEO_STREAM_URL=https://panel.tvstream.cl:1936/8012/8012/playlist.m3u8
```

## Google Tag Manager

```bash
NEXT_PUBLIC_GTM_ID=GTM-M8XHWNF
```

## Acceso al Panel de Administración

1. Configura las variables de administración en `.env.local`
2. Reinicia el servidor de desarrollo
3. Ve a `http://localhost:3000/admin`
4. Ingresa el usuario y contraseña configurados
5. Serás redirigido al panel de Sanity en `/studio`
