export const layoutTokens = {
  bannerDividerClearance: 'clamp(8rem,10vw,11.5rem)',
  demoContentMaxWidth: '64rem',
  demoNarrowContentMaxWidth: '48rem',
  feedCarouselItemWidth: 'clamp(16.5rem, 19vw, 23rem)',
  trailerContentMaxWidth: '1440px',
  trailerMediaWidthLarge: '58.333%',
  trailerMediaMaxWidth: '840px',
} as const

export const motionTokens = {
  fast: 'calc(var(--duration-factor, 1) * 0.2s)',
  standard: 'calc(var(--duration-factor, 1) * 0.4s)',
  slow: 'calc(var(--duration-factor, 1) * 0.6s)',
  dialogCloseDelayMs: 1200,
  dialogDurationInMs: 700,
} as const
