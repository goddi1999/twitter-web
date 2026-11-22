export const GATEWAY_VIEWBOX = { width: 264, height: 120 } as const

/** Theme tokens so the illustration follows light and dark mode. */
export const GATEWAY_DEFAULT_COLORS = {
  background: 'transparent',
  circleStroke: 'var(--border)',
  centerCircleStroke: 'var(--muted-foreground)',
  logo: 'var(--foreground)',
  icon: 'var(--foreground)',
  inputLine: 'var(--muted-foreground)',
  iconBoxFill: 'var(--card)',
  iconBoxStroke: 'var(--border)',
} as const

/** Decorative provider-line colours, kept literal from the original. */
export const GATEWAY_LINE_COLORS = {
  topLeft: '#0067D6',
  bottomLeft: '#067A6F',
  topRight: '#CA2A30',
  bottomRight: '#FFB224',
} as const
