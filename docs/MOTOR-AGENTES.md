# Motor de agentes — BBX / apps vendibles

Objetivo: dado un **brief** (cliente, sector, plan, restricciones), ejecutar un ciclo **generar → probar → elegir → implementar → validar** sin dejar errores visuales persistentes (overflow, responsive, PWA).

## Nombre del problema que ya vimos

| Síntoma | Término técnico | Cómo detectarlo |
|--------|-----------------|-----------------|
| Cortado por la derecha, sin margen | `overflow-x` / horizontal overflow | `scrollWidth > innerWidth` en consola |
| Esquinas “infinitas” | Clipping + `border-radius` fuera del viewport | DevTools → overflow |
| Player gigante en listas | UX density / chrome innecesario | Captura 360px + Lighthouse mobile |

## Arquitectura propuesta (4 capas)

```
Brief (JSON/YAML)
    ↓
[1] Orquestador     — cola de tareas, presupuesto, criterios de éxito
[2] Agentes rol     — diseño, frontend, QA visual, seguridad, deploy
[3] Sandbox         — worktree / preview Vercel por variante
[4] Juez + memoria  — puntúa variantes, guarda ganador, itera hasta PASS
```

### Agentes (roles mínimos)

1. **Producto** — convierte brief en user stories y checklist de aceptación.
2. **Diseño** — tokens (PULSO DS), layout mobile-first, sin `100vw` en capas animadas.
3. **Implementación** — Next.js, cambios acotados, convenciones del repo.
4. **QA visual** — Playwright 360/390/430px, screenshot diff, consola sin errores críticos.
5. **QA técnico** — `npm run build`, ESLint, validador BBX pre-push.
6. **Deploy** — Vercel preview; solo promover si QA = PASS.

### Bucle automático (pseudo)

```
variants = diseño.generar(3..5 propuestas UI)
for v in variants:
  rama = git.worktree(v)
  implementar(rama, v)
  score[v] = qa.visual(rama) + qa.build(rama) + qa.overflow(rama)
winner = max(score)
merge(winner) → main → deploy prod
while not qa.prod_pass:
  fix(agente_implementación, logs_qa)
```

### Criterios de “mejor idea” (ejemplo ponderado)

| Criterio | Peso |
|----------|------|
| Sin overflow horizontal (360px) | 25% |
| Build + TypeScript OK | 20% |
| Lighthouse performance móvil > 80 | 15% |
| Claridad visual / jerarquía | 20% |
| Menú y rutas coherentes | 10% |
| Cero regresiones en player/radio | 10% |

### Parámetros principales del brief (entrada)

```yaml
app:
  name: Radio Bienvenida
  plan: pro          # basico | pro | premium
  primary_color: "#db8918"
  stream_url: "..."
goals:
  - pwa_vercel
  - sin_overflow_movil
  - mini_player_compacto_en_listas
constraints:
  - no_mover_bottom_nav_sin_confirmacion
  - espanol
quality_gates:
  - build
  - overflow_360
  - manifest_icons
```

## Implementación por fases (realista)

| Fase | Entregable | Herramientas |
|------|------------|--------------|
| **0** (hoy) | Checklist manual + script overflow | `scripts/audit-overflow.mjs`, DevTools |
| **1** | CLI `pnpm agent:run --brief brief.yaml` | Node, git worktree, Cursor Agent / API |
| **2** | QA visual automático | Playwright + reglas de screenshot |
| **3** | Variantes en paralelo | Vercel previews + scoring JSON |
| **4** | Memoria por cliente | Supabase / repo `agents/memory/` |

## Qué NO promete el motor (honestidad)

- No sustituye criterio humano en **marca** y **copy** fino.
- No garantiza “cero bugs” sin gates; garantiza **reintentos hasta PASS** si defines gates claros.
- APIs (Claude, etc.) tienen costo y límites — el orquestador debe llevar **presupuesto máximo por run**.

## Próximo paso concreto en este repo

1. Completar gates en CI: build + script overflow 360px en URL preview.
2. Añadir `agents/brief.example.yaml` y script orquestador mínimo (fase 1).
3. Documentar reglas inmutables (menú, nav) en `agents/RULES.md` para que los agentes no las rompan.

## Referencias útiles

- Depuración responsive: [OneNine — debug responsive design](https://onenine.com/es/how-to-debug-responsive-design-issues/)
- Overflow: buscar `horizontal overflow`, `overflow-x hidden`, `min-w-0` en flex
