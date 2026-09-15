export const GENERATED_SERVICES_MEDIA_REVISION = {
  installed: "2026-08-06",
  desktopLoops: 8,
  mobileLoops: 8,
  stillScenes: 2,
  silent: true,
  posters: true,
  auditHarness: "strict-csp-compatible",
  coreMediaRevision: "clean-procedural-v2",
} as const;

export const GENERATED_SERVICES_MEDIA = {
  hero: {
    desktop: "/videos/generated/bt-services-hero-root-system.mp4",
    mobile: "/videos/generated/bt-services-hero-root-system-mobile.mp4",
    poster: "/images/generated/bt-services-hero-root-system-poster.jpg",
    purpose: "Reveal the interconnected system beneath the visible brand surface.",
  },
  situation: {
    desktop: "/videos/generated/bt-services-situation-paths.mp4",
    mobile: "/videos/generated/bt-services-situation-paths-mobile.mp4",
    poster: "/images/generated/bt-services-situation-paths-poster.jpg",
    purpose: "Express three different starting conditions inside one coherent material world.",
  },
  strategy: {
    desktop: "/videos/generated/bt-services-strategy-topography.mp4",
    mobile: "/videos/generated/bt-services-strategy-topography-mobile.mp4",
    poster: "/images/generated/bt-services-strategy-topography-poster.jpg",
    purpose: "Turn scattered possibilities into one legible strategic route.",
  },
  packages: {
    desktop: "/videos/generated/bt-services-package-current.mp4",
    mobile: "/videos/generated/bt-services-package-current-mobile.mp4",
    poster: "/images/generated/bt-services-package-current-poster.jpg",
    purpose: "Let several legitimate paths settle into one clear scope.",
  },
  authority: {
    desktop: "/videos/generated/bt-services-authority-layers.mp4",
    mobile: "/videos/generated/bt-services-authority-layers-mobile.mp4",
    poster: "/images/generated/bt-services-authority-layers-poster.jpg",
    purpose: "Let a signal travel through five brand layers and widen only after the system is complete.",
  },
  perception: {
    desktop: "/videos/generated/bt-services-perception-ascent.mp4",
    mobile: "/videos/generated/bt-services-perception-ascent-mobile.mp4",
    poster: "/images/generated/bt-services-perception-ascent-poster.jpg",
    purpose: "Make the landscape and its recognisable signal become clearer together.",
  },
  strategyRoom: {
    desktop: "/videos/generated/bt-services-strategy-room.mp4",
    mobile: "/videos/generated/bt-services-strategy-room-mobile.mp4",
    poster: "/images/generated/bt-services-strategy-room-poster.jpg",
    purpose: "Let surface noise settle into one calm, legible reflection before the conversation begins.",
  },
  health: {
    // The crystal water slot open since August, filled on Suman's direct
    // instruction to choose: a single trout gliding over sunlit golden sand,
    // seen whole through glass clear shallows, ripple rings where it broke
    // the surface. The health check's promise as an image — look through the
    // surface and see exactly what lives there. Replaces the near black
    // procedural veins render that sat against the media standard.
    desktop: "/videos/generated/bt-services-healthcheck-clarity.mp4",
    mobile: "/videos/generated/bt-services-healthcheck-clarity-mobile.mp4",
    poster: "/images/generated/bt-services-healthcheck-clarity-poster.jpg",
    purpose: "See through the surface to exactly what lives beneath it.",
  },
} as const;

export const GENERATED_SERVICES_STILLS = {
  stakes: {
    image: "/images/generated/bt-services-stakes-positioning.png",
    purpose: "Separate one recognisable position from an interchangeable category field.",
    motion: "Scroll-linked camera drift with a restrained mineral-light catch.",
  },
  deliverables: {
    image: "/images/generated/bt-services-deliverables-archive.png",
    purpose: "Make the invisible brand-system work feel tangible, ordered, and usable.",
    motion: "Scroll-linked paper-plane drift with a restrained edge-light pass.",
  },
} as const;

export type GeneratedServicesMediaKey = keyof typeof GENERATED_SERVICES_MEDIA;
export type GeneratedServicesStillKey = keyof typeof GENERATED_SERVICES_STILLS;
