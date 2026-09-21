import { jsonNoStore } from "@/lib/api-protection";
import { getContactReadiness } from "@/lib/contact-readiness";
import { BRANDING_TATVA_RELEASE_CONTRACT } from "@/lib/releaseContract";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return jsonNoStore({
    ...BRANDING_TATVA_RELEASE_CONTRACT,
    runtime: {
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      deploymentUrl: process.env.VERCEL_URL ?? null,
    },
    contact: getContactReadiness(),
    generatedAt: new Date().toISOString(),
  });
}
