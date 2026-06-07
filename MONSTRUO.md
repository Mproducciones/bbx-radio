# EL MONSTRUO en este proyecto

Guía rápida para **Radio Bienvenida / pulso-app**. El cerebro vive en tu Cursor global; este archivo lo enlaza al repo.

## Cómo hablarle (sin nombrar skills)

```text
monstruo: [objetivo en una frase]
```

O formato formal → ver **`ORDEN.md`**.

## Motor global (tu PC)

| Pieza | Ruta |
|-------|------|
| Regla maestra | `C:\Users\nuevo\.cursor\rules\monstruo.mdc` |
| Auto-router | `C:\Users\nuevo\.cursor\rules\auto-recursos-global.mdc` |
| Fábrica IA | `C:\Users\nuevo\.cursor\ai-factory\` |
| Skills | `C:\Users\nuevo\.cursor\skills\` |
| Acceso rápido | Escritorio → **Fabrica IA** / **Iniciar-Fabrica-IA.bat** |

## Motor local (este repo)

| Pieza | Ruta |
|-------|------|
| Contexto Cloud Agent | `AGENTS.md` |
| Orden activa | `ORDEN.md` |
| Reglas BBX | `.cursor/rules/bbx-pulso.mdc` |
| Brief + QA | `agents/` → `npm run agent:run -- --goal "..."` |

## Skills globales (órganos del Monstruo)

| Skill | Para qué |
|-------|----------|
| **dev-company-os** | Protocolo empresa — siempre |
| **auto-router** | Detecta qué activar sin que lo nombres |
| **bootstrap-automation** | Instala graphify, uv, etc. si faltan |
| **cursor-collective** | Decisiones grandes (3 voces) |
| **graphify** | Mapa del codebase |
| **fabrica-ia** | Proyectos nuevos desde plantillas |
| **sitio-negocio-local** | Landings PyME |
| **deployment-expert** | Vercel / deploy (también subagente Cursor) |
| **revolutia-boveda** | Índice de herramientas Revolutia → skill local |
| **g0dm0d3** | Multi-modelo fuera de Cursor |
| **free-claude-code** | Claude gratis en VS Code |
| **mirofish** | Simulación / opinión pública (proyecto aparte) |

## Repos Git referenciados por skills (externos)

No están clonados dentro de pulso-app; el Monstruo los usa **bajo demanda**:

| Repo | Skill |
|------|--------|
| https://github.com/safishamsi/graphify | graphify |
| https://github.com/elder-plinius/G0DM0D3 | g0dm0d3 |
| https://github.com/666ghj/MiroFish | mirofish |
| https://github.com/Alishahryar1/free-claude-code | free-claude-code |

## Repo de este producto

| | |
|--|--|
| GitHub | https://github.com/Mproducciones/bbx-radio |
| Deploy | Vercel (push a `main`) |

## Subagentes Cursor (Task)

El Monstruo puede lanzarlos solo: `explore`, `generalPurpose`, `deployment-expert`, `ci-investigator`, etc.

## Reload

Tras cambiar reglas/skills globales: **Cursor → Reload Window** (una vez).
