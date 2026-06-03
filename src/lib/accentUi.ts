/** Estilos compartidos para tarjetas y botones con acento (profundidad sin paneles gigantes). */

export function accentTileStyle(accent: string, active = false) {
  return {
    background: `linear-gradient(165deg, ${accent}24 0%, #11111a 48%, #0a0a10 100%)`,
    border: `1px solid ${active ? `${accent}70` : `${accent}38`}`,
    boxShadow: `0 10px 28px -10px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.09)`,
  } as const
}

export function accentPrimaryButtonStyle(accent: string, highlight?: string) {
  const hi = highlight ?? accent
  return {
    background: `linear-gradient(135deg, ${accent} 0%, ${hi} 100%)`,
    color: '#07070e',
    boxShadow: `0 6px 22px -4px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.28)`,
  } as const
}

export function accentSecondaryButtonStyle(accent: string) {
  return {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)',
    border: `1px solid ${accent}40`,
    color: 'rgba(255,255,255,0.88)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)',
  } as const
}
