// Media contract: continuous live-action masters only—never ping-pong, boomerang, or still-derived loops.
export const GENERATED_SERVICES_MEDIA_REVISION = {
  installed: "2026-08-18",
  desktopLoops: 8,
  mobileLoops: 8,
  stillScenes: 2,
  silent: true,
  posters: true,
  auditHarness: "strict-csp-compatible",
  coreMediaRevision: "continuous-live-action-v2",
} as const;

export const GENERATED_SERVICES_MEDIA = {
  hero: {
    desktop: "/videos/higgsfield-forest-light.mp4",
    mobile: "/videos/higgsfield-forest-light.mp4",
    poster: "/images/higgsfield-forest-light-poster.jpg",
    purpose: "Move continuously from a closed forest into an open valley as recognition becomes legible.",
  },
  situation: {
    desktop: "/videos/pexels-valley-first-light.mp4",
    mobile: "/videos/pexels-valley-first-light.mp4",
    poster: "/images/pexels-valley-first-light-poster.jpg",
    purpose: "Express three different starting conditions inside one coherent material world.",
  },
  strategy: {
    desktop: "/videos/pexels-fog-sunrise.mp4",
    mobile: "/videos/pexels-fog-sunrise.mp4",
    poster: "/images/pexels-fog-sunrise-poster.jpg",
    purpose: "Turn scattered possibilities into one legible strategic route.",
  },
  packages: {
    desktop: "/videos/pexels-golden-fog-sea.mp4",
    mobile: "/videos/pexels-golden-fog-sea.mp4",
    poster: "/images/pexels-golden-fog-sea-poster.jpg",
    purpose: "Let several legitimate paths settle into one clear scope.",
  },
  authority: {
    desktop: "/videos/hero-forest-sanctuary.mp4",
    mobile: "/videos/hero-forest-sanctuary.mp4",
    poster: "/images/hero-forest-sanctuary-poster.jpg",
    purpose: "Let a signal travel through five brand layers and widen only after the system is complete.",
  },
  perception: {
    desktop: "/videos/pexels-summit-inversion.mp4",
    mobile: "/videos/pexels-summit-inversion.mp4",
    poster: "/images/pexels-summit-inversion-poster.jpg",
    purpose: "Make the landscape and its recognisable signal become clearer together.",
  },
  strategyRoom: {
    desktop: "/videos/pexels-studio-morning-light.mp4",
    mobile: "/videos/pexels-studio-morning-light.mp4",
    poster: "/images/pexels-studio-morning-light-poster.jpg",
    purpose: "Let surface noise settle into one calm, legible reflection before the conversation begins.",
  },
  health: {
    desktop: "/videos/pexels-river-dawn.mp4",
    mobile: "/videos/pexels-river-dawn.mp4",
    poster: "/images/pexels-river-dawn-poster.jpg",
    purpose: "Reveal hidden misalignment beneath an apparently coherent surface.",
  },
} as const;

export const GENERATED_SERVICES_STILLS = {
  stakes: {
    image: "/images/pixabay-golden-forest-glow-poster.jpg",
    purpose: "Separate one recognisable position from an interchangeable category field.",
    motion: "Continuous live-action wind with a photographic reduced-motion fallback.",
  },
  deliverables: {
    image: "/images/pexels-studio-morning-light-poster.jpg",
    purpose: "Make the invisible brand-system work feel tangible, ordered, and usable.",
    motion: "Continuous live-action daylight with a photographic reduced-motion fallback.",
  },
} as const;

export type GeneratedServicesMediaKey = keyof typeof GENERATED_SERVICES_MEDIA;
export type GeneratedServicesStillKey = keyof typeof GENERATED_SERVICES_STILLS;
