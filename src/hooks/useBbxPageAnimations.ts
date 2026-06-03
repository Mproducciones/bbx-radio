'use client'

import { usePageAnimations } from '@/hooks/usePageAnimations'
import type { RefObject } from 'react'

/** BBX landing — atributos data-bbx-animate mapeados a data-animate. */
export function useBbxPageAnimations(rootRef: RefObject<HTMLElement | null>, enabled = true) {
  usePageAnimations(rootRef, enabled)
}
