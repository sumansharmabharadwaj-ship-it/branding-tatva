export const BRANDING_TATVA_RELEASE_CONTRACT = {
  experience: "branding-tatva-cinematic-preview",
  canonicalBranch: "august-8-isolated",
  permanentReviewAlias:
    "https://branding-tatva-git-august-8-isolated-suman22.vercel.app/",
  canonicalBacklog: "docs/AUGUST_8_EXECUTION_BOARD.md",
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
