# Radio Bienvenida — APK Android (Capacitor)

La carpeta `android/` es la app nativa que instalás en el celular. **No es otra radio**: es un WebView que abre la misma web que Vercel, con icono y permisos de Android.

## Cómo funciona

| Modo | Comando | Qué carga la APK |
|------|---------|------------------|
| **Producción** (recomendado) | `pnpm cap:sync:prod` o `pnpm build:apk` | `https://bbx-radio-9k9y.vercel.app` |
| **Dev en tu red** | `pnpm cap:sync:local` | `http://192.168.x.x:3000` (solo build **debug**) |

Cada vez que publicás en Vercel, la APK instalada **se actualiza sola** al abrirla (no hace falta recompilar por cada cambio de diseño), salvo que cambies permisos nativos o `MainActivity`.

## Generar APK debug (instalar en el celular)

```bash
pnpm build:apk
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Android Studio

```bash
pnpm cap:sync:prod
pnpm cap:open
```

En Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## Versión de la app

Editar en `android/app/build.gradle`:

- `versionCode` — entero (subir en cada subida a Play Store)
- `versionName` — texto visible (ej. `1.1.0`)

## Audio en segundo plano

La APK tiene permisos de `INTERNET`, `WAKE_LOCK` y `FOREGROUND_SERVICE_MEDIA_PLAYBACK`. El reproductor web debe seguir reproduciendo con la pantalla apagada; si se corta, revisar que el stream y Media Session en la web estén activos.

## Build release (Play Store)

Necesitás keystore firmado. En Studio: **Build → Generate Signed Bundle / APK**. O:

```bash
pnpm build:apk -- release
```

(firmar el APK unsigned antes de subir a Play Console).
