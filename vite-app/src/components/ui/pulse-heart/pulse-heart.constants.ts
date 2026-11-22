// The 24-colour palette shared with speech-bubble, copied so this folder stays self-contained.
export const PULSE_HEART_COLORS = {
  ink: '#0a0a0c',
  brown: '#8b5e3c',
  red: '#e8483f',
  orange: '#f08a24',
  amber: '#f0b429',
  green: '#3ecf8e',
  turquoise: '#2fbfa0',
  blue: '#3b93f0',
  purple: '#8b5cf6',
  pink: '#e152b0',
  grey: '#a3a3a3',
  cream: '#f1efe9',
  coral: '#f47560',
  rose: '#ec4f7a',
  orchid: '#c25ed8',
  indigo: '#5a5cf0',
  navy: '#27408b',
  cyan: '#1fb5d4',
  lime: '#9ccc3c',
  moss: '#6b8e3a',
  pine: '#2f7d5b',
  plum: '#7c3a73',
  slate: '#5d6b7e',
  sand: '#d6b88a',
} as const

export type PulseHeartColor = keyof typeof PULSE_HEART_COLORS
