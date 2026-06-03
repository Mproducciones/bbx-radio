# Aprovechar Cursor Pro + Claude Pro (flujo diario)

Objetivo: **máximo resultado** con brief claro, roles separados y QA automático.

## División de trabajo (estrujar ambas suscripciones)

| Herramienta | Mejor para | No usar para |
|-------------|------------|--------------|
| **Claude Pro** (claude.ai o API) | Arquitectura, brief, comparar 3 variantes UI, copy, checklist de aceptación, revisar diffs largos | Editar 20 archivos en el repo |
| **Cursor Pro** (Agent) | Implementar en código, build, fix iterativo, commit cuando el usuario pida | Rediseñar menú sin reglas |

## Rutina en 30–45 min (una mejora concreta)

### 1. Brief (5 min) — tú o Claude
```bash
cp agents/brief.example.yaml agents/brief.yaml
# Editar goals + constraints
```

### 2. Generar tarea para el agente (1 min)
```bash
npm run agent:run -- --goal "Mini player no tapa grilla en 350px"
```
Abre `agents/out/CURRENT-TASK.md` — es el prompt listo para Cursor.

### 3. Claude Pro — plan (10 min)
Pega en Claude:
- `agents/out/CURRENT-TASK.md`
- `agents/RULES.md`
- Captura de pantalla del bug

Pide: **un solo enfoque**, lista de archivos a tocar, riesgos, criterios PASS.

### 4. Cursor Pro — Agent (15 min)
- Modo **Agent**
- @ mencionar archivos que Claude listó
- Pegar el plan de Claude + `CURRENT-TASK.md`
- Regla: *"Ejecuta npm run agent:qa al terminar"*

### 5. QA automático (5 min)
```bash
npm run agent:qa          # build + validate
npm run agent:qa:visual   # overflow 360 en rutas clave (requiere playwright)
```

### 6. Deploy (solo si tú lo pides)
Push → Vercel. Recargar PWA (SW bump si tocó `public/sw.js`).

## Prompt maestro (copiar en Cursor Agent)

```
Contexto: pulso-app / Radio Bienvenida PWA.
Lee agents/RULES.md y agents/out/CURRENT-TASK.md.

Objetivo: [PEGAR GOAL]
Restricciones: no tocar bottom nav sin OK; español; cambios mínimos.

Al terminar:
1. npm run agent:qa
2. Resumen en español: qué cambió, por qué, cómo probar en móvil 360px.
3. No hagas commit salvo que yo lo pida.
```

## Prompt maestro (copiar en Claude Pro)

```
Eres lead de producto + diseño para una PWA de radio (Next.js 16, Tailwind 4).
Brief y reglas adjuntos.

Entrega:
1. Diagnóstico en 3 líneas (término técnico + causa probable)
2. Una solución recomendada (no tres paralelas salvo que pida variantes)
3. Lista exacta de archivos a modificar
4. Checklist PASS/FAIL para QA móvil
5. Qué NO hacer (menú, overflow, player)

No escribas código completo; eso lo hace Cursor Agent en el repo.
```

## Variantes A/B/C (cuando quieras “la mejor idea”)

1. Claude: genera **3 propuestas** (solo descripción + pros/contras).
2. Tú eliges una (o pides votación rápida).
3. Cursor: implementa **solo la ganadora**.
4. `npm run agent:qa:visual` en preview Vercel.
5. Si FAIL → Cursor itera con el log JSON en `agents/reports/`.

## Instalación única (QA visual)

```bash
pnpm add -D playwright
npx playwright install chromium
```

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run agent:run` | Genera CURRENT-TASK.md + corre QA |
| `npm run agent:qa` | validate + build |
| `npm run agent:qa:visual` | overflow en /, /programacion, etc. |
| `npm run validate` | checker BBX pre-push |
