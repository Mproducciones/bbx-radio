import { Montserrat } from 'next/font/google'

/** Tipografía oficial radiobienvenida.cl — Montserrat (Regular–ExtraBold). */
export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

/** Variable + clase aplicada en `<html>` para toda la app. */
export const radioFontClassName = `${montserrat.variable} ${montserrat.className}`

/** Stack para canvas / contextos sin CSS (boot, visualizadores). */
export const RADIO_FONT_STACK = 'Montserrat, sans-serif'
