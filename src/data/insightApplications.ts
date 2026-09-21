export type InsightApplication = {
  projectSlug: string;
  proofFrame: string;
  packageSlug: string;
  serviceFrame: string;
};

// Every connection below is grounded in the published project record and an
// existing service package. The framing describes the decision demonstrated
// by the work; it never turns a project into evidence for a result it did not
// measure.
export const insightApplications: Record<string, InsightApplication> = {
  positioning: {
    projectSlug: "myshopineurope",
    proofFrame:
      "Category, audience, and a craft and origin position shaped for a new marketplace connecting India with Europe.",
    packageSlug: "brand-beginning",
    serviceFrame:
      "Positioning, audience, and identity decisions for a brand at the beginning.",
  },
  "customer-experience": {
    projectSlug: "executive-springboard",
    proofFrame:
      "Content sequences for each platform, designed to carry attention into webinar registration.",
    packageSlug: "brand-clarity",
    serviceFrame:
      "One scope for connecting touchpoints that currently produce an uneven journey.",
  },
  "distinctive-brand": {
    projectSlug: "herbalcart",
    proofFrame:
      "Campaign and content direction built to shift an accidental Ayurvedic frame toward a modern supplement brand.",
    packageSlug: "brand-clarity",
    serviceFrame:
      "Repositioning, messaging, and expression aligned across the full brand system.",
  },
  "brand-messaging": {
    projectSlug: "plaxonic-content-portfolio",
    proofFrame:
      "Sixteen pieces structured across four formats for leaders and audiences with different levels of technical fluency.",
    packageSlug: "brand-partnership",
    serviceFrame:
      "An ongoing content and consistency system for a message that travels across channels.",
  },
  "brand-memory": {
    projectSlug: "dr-haley-nutrition",
    proofFrame:
      "Content efficiency evidence: 104% more followers earned per Instagram post and 1,350% more comments per post. Recall measurement sat outside this engagement.",
    packageSlug: "brand-partnership",
    serviceFrame:
      "Sustained content, review, and adjustment designed to compound recognition over time.",
  },
};

export function getInsightApplication(topicSlug: string) {
  return insightApplications[topicSlug];
}
