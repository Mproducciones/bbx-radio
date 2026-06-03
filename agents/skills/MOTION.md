# Skill — Motion & animación (PULSO / BBX)

## Cuándo usar qué

| Herramienta | Usar para |
|-------------|-----------|
| **Framer Motion** | UI interactiva, tabs, sheets, `AnimatePresence`, layoutId, whileTap |
| **Anime.js v4** | Landing BBX, stagger scroll, números/stats, entradas en viewport |
| **CSS** (`globals.css`) | shimmer, gradient-shift, glow pulse, aurora desktop |

## Imports

```ts
import { fadeUp, springSnappy, staggerDelay } from '@/lib/motion/framer'
import { animateOnView, animateStagger, animeStatPop } from '@/lib/motion/anime'
import { Stagger, StaggerItem, MotionSection } from '@/components/motion/Stagger'
import { ShimmerButton, BorderBeam } from '@/components/ui/effects'
```

## Reglas

1. **Móvil ≤767px**: sin `scale()` grande en fondos; sin `position:fixed` decorativo.
2. **Reduced motion**: respetar `prefers-reduced-motion` (fade only).
3. **Performance**: preferir `transform`/`opacity`; lazy `import('animejs')`.
4. **Overflow**: animaciones no deben aumentar `scrollWidth`.

## Patrones

### Framer — fila de lista
```tsx
<motion.article
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={staggerDelay(index, 0.04)}
/>
```

### Anime — card al scroll
```tsx
const ref = useAnimeInView(animeRevealUp, index)
return <div ref={ref} className="opacity-0">...</div>
```

### BBX CTA
Usar `ShimmerButton` o clase `btn-shimmer` + `glow-amber-pulse`.
