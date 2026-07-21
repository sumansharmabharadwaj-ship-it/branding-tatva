import { Facebook, Instagram, Linkedin } from "lucide-react";
import { site } from "@/data/site";

export const socialLinks = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
].filter((s) => s.href);

// Warm, low-glow embers drifting over the closing scene — the "floating
// light in a dark scene" mood, one per element color cycling through the
// full set instead of a single fixed ochre, so the site's actual final
// visual beat completes all five rather than gesturing at one of them.
const EARTH = "rgba(184, 90, 52, 0.42)";
const WATER = "rgba(36, 57, 77, 0.42)";
const FIRE = "rgba(194, 138, 40, 0.42)";
const AIR = "rgba(92, 107, 74, 0.42)";
const SPACE = "rgba(173, 111, 92, 0.42)";

export const EMBERS = [
  { top: "18%", left: "10%", size: 3, delay: "0s", duration: "8s", color: EARTH },
  { top: "28%", left: "84%", size: 4, delay: "1.4s", duration: "10s", color: WATER },
  { top: "64%", left: "20%", size: 2, delay: "2.8s", duration: "7.5s", color: FIRE },
  { top: "46%", left: "70%", size: 3, delay: "0.6s", duration: "9.2s", color: AIR },
  { top: "78%", left: "48%", size: 2, delay: "3.6s", duration: "8.6s", color: SPACE },
  { top: "12%", left: "58%", size: 3, delay: "2s", duration: "9.8s", color: EARTH },
  { top: "86%", left: "80%", size: 2, delay: "1s", duration: "7s", color: WATER },
  { top: "40%", left: "6%", size: 2, delay: "4.2s", duration: "8.2s", color: FIRE },
] as const;

// Stagger for the logo signature vs. the headline above it, so the mark
// settles a beat after the words land instead of both arriving at once.
export const REVEAL_DELAY_LOGO = 0.1;
