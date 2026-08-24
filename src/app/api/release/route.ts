import { NextResponse } from "next/server";
import { BRANDING_TATVA_RELEASE_CONTRACT } from "@/lib/releaseContract";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return NextResponse.json(
    {
      ...BRANDING_TATVA_RELEASE_CONTRACT,
      releaseTrack: "august-8-isolated",
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      deploymentUrl: process.env.VERCEL_URL ?? null,
      integratedMilestones: {
        homepageV4: true,
        servicesJourney: true,
        workInteractionRepairs: true,
        contactDirectCallWhatsApp: true,
        consultationMinutes: 30,
      },
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    },
  );
}
