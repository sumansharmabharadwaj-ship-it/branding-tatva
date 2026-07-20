export type ThresholdPanelData = {
  key: "left" | "right";
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  video?: string; // ambient clip that cross-fades in on hover, same pattern as CaseStudyCard
  gradient: string;
  ctaLabel: string;
  ctaHref: string;
  activeHeading?: string; // shown in place of the section's shared heading while this panel is active
};
