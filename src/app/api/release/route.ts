import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PERMANENT_REVIEW_ALIAS =
  "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app/";
const BACKLOG_PATH = "docs/MASTER_PENDING_WORK.md";

export function GET() {
  return NextResponse.json(
    {
      experience: "branding-tatva-homepage-v4",
      releaseTrack: "cinematic-recovery",
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      deploymentUrl: process.env.VERCEL_URL ?? null,
      permanentReviewAlias: PERMANENT_REVIEW_ALIAS,
      canonicalBacklog: BACKLOG_PATH,
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
