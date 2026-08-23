export const BRANDING_TATVA_RELEASE_CONTRACT = {
  experience: "branding-tatva-cinematic-preview",
  canonicalBranch: "homepage-cinematic-recovery",
  permanentReviewAlias:
    "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app/",
  canonicalBacklog: "docs/MASTER_PENDING_WORK.md",
  consultationMinutes: 30,
  publicPhoneE164: "+918447725381",
  requiredRoutes: [
    "/",
    "/services",
    "/insights",
    "/about",
    "/contact",
  ],
} as const;

export type BrandingTatvaReleaseContract =
  typeof BRANDING_TATVA_RELEASE_CONTRACT;
