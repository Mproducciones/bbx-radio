# TODO - PULSO (Radio Bienvenida) / Fase 1

- [ ] Analizar requisitos
- [x] Ejecutar `pnpm lint` y capturar errores reales
- [ ] Corregir errores ESLint:
  - [x] Convertir `scripts/generate-icons.js` de `require()` a ESM (sin cambiar salida)
  - [ ] Corregir `src/components/player/AudioVisualizer.tsx` (mover/reestructurar `draw` para eliminar “Cannot access variable before it is declared” sin alterar lógica de visualización)
  - [ ] Corregir `src/components/studio/AdminInstallPrompt.tsx` (evitar `setState` directo dentro de `useEffect` sin alterar comportamiento)
- [ ] Limpiar warnings seguros (solo después de que queden 0 errores):
  - [ ] `src/hooks/useRadioPlayer.ts` (evitar ternario como statement)
  - [ ] `prefer-const` en `PremiumLogo.tsx` y `WelcomeAnimation.tsx`
  - [ ] `no-unused-vars` en componentes con imports/vars no usados
- [ ] Verificar resultados:
  - [ ] Ejecutar `pnpm lint` y asegurar que no haya errores
