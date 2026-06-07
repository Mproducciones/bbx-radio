# Órdenes — Radio Bienvenida / pulso-app

**Director:** tú · **Ejecutor:** EL MONSTRUO (Cursor global + reglas BBX locales)

Repo: https://github.com/Mproducciones/bbx-radio  
Producción: https://bbx-radio-9k9y.vercel.app/

---

## Orden activa (P1)

```text
ORDEN: Rediseñar rutas scroll móvil — layout unificado, full width, sin huecos; misma calidad visual que En Vivo
PROYECTO: pulso-app
ENTREGABLE: código + deploy (cuando el Director lo pida)
PRIORIDAD: P1
RESTRICCIONES:
  - No tocar bottom nav sin OK explícito
  - Español Chile; copy honesto (sin cifras inventadas)
  - Cero overflow horizontal 360/390/430 px
  - Publicidad en slots de altura fija (no empujar layout)
RUTAS:
  - /programacion
  - /participa
  - /saludos
  - /anunciate
  - /patrocinadores
FASES:
  1. ScrollScreenLayout compartido
  2. Programación + Participa + Saludos
  3. Anunciate + Patrocinadores
VERIFICACIÓN:
  - npm run agent:qa
  - Probar Android + iPhone
```

**Estado:** Fase 1 implementada — layout unificado, TabContextBar, crossfade tabs, copy v1. Pendiente: `npm run agent:qa`, prueba móvil, deploy si el Director lo pide.

Ver detalle: [`docs/EXPERIENCIA-PULSO.md`](docs/EXPERIENCIA-PULSO.md)

---

## Plantilla (copiar en chat)

```text
monstruo:

ORDEN: [qué quieres en una frase]
PROYECTO: pulso-app
ENTREGABLE: plan | código | review | deploy
PRIORIDAD: P0 | P1 | P2
RESTRICCIONES: [opcional]
```

## Atajos

| Frase | Efecto |
|-------|--------|
| `monstruo: ...` | Activa protocolo EL MONSTRUO |
| `modo empresa` | dev-company-os completo |
| `modo colectivo` | 3 voces (decisiones grandes) |
| `solo plan` | Sin tocar archivos |
| `adelante` | Ejecutar plan aprobado |

## Historial

| Fecha | Orden | Estado |
|-------|-------|--------|
| 2026-06-02 | Rediseño rutas scroll | Pendiente |
