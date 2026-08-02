// The sitewide motion vocabulary — the Scroll Operating System's one
// central configuration (docs/SCROLL_OS.md §6). Every new animated
// surface imports these instead of scattering bespoke easings and
// durations; existing components migrate as they get touched.
export const motionTokens = {
  easeOrganic: [0.22, 1, 0.36, 1] as const,
  easeSoft: [0.33, 1, 0.68, 1] as const,
  easeEditorial: [0.16, 1, 0.3, 1] as const,

  durationInstant: 0.18,
  durationFast: 0.35,
  durationBase: 0.72,
  durationSlow: 1.2,
  durationAtmospheric: 2.4,

  distanceMicro: 4,
  distanceSmall: 12,
  distanceBase: 24,
  distanceLarge: 48,

  blurSmall: 6,
  blurBase: 14,

  parallaxSmall: 0.025,
  parallaxBase: 0.05,

  magneticDistance: 5,
};
