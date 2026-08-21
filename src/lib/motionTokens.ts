// Sitewide motion vocabulary, consolidated from the Branding Tatva Motion Bible.
// Meaning-carrying motion leads; supporting movement settles into a readable state.
export const motionTokens = {
  easeOrganic: [0.2, 0.8, 0.2, 1] as const,
  easeSoft: [0.33, 1, 0.68, 1] as const,
  easeEditorial: [0.16, 1, 0.3, 1] as const,
  easeExit: [0.7, 0, 0.84, 0] as const,

  durationInstant: 0.16,
  durationFast: 0.22,
  durationBase: 0.58,
  durationSlow: 0.9,
  durationAtmospheric: 1.5,
  durationSignature: 1.5,

  staggerText: 0.06,
  scrubCatchUp: 0.55,

  distanceMicro: 4,
  distanceSmall: 12,
  distanceBase: 24,
  distanceLarge: 32,

  scaleIn: 0.985,
  scaleOut: 1.015,
  blurSmall: 4,
  blurBase: 8,

  parallaxSmall: 0.025,
  parallaxBase: 0.05,
  magneticDistance: 5,
  cardLift: 4,

  ambientPlaybackRate: 1.1,
  desktopSceneMinHeight: "100svh",
  pagePinBudget: 2,
} as const;

export const motionPalette = {
  charcoal: "#161719",
  slateMist: "#1A1E22",
  forest: "#151A16",
  stone: "#1B1B19",
  deepWater: "#10151A",
  gold: "#C7A56B",
} as const;
