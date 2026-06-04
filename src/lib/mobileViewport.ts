/**
 * Referencia de viewports iOS (CSS px) para QA y diseño móvil.
 * @see https://developer.apple.com/design/human-interface-guidelines/layout
 */
export const MOBILE_VIEWPORTS = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667 },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844 },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', width: 393, height: 852 },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 393, height: 852 },
] as const

/** Altura mínima recomendada para controles táctiles (Apple HIG ~44pt). */
export const TOUCH_TARGET_MIN_PX = 44

export const APP_GUTTER_MIN_PX = 16
