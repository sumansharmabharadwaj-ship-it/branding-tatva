import { Facebook, Instagram, Linkedin } from "lucide-react";
import { site } from "@/data/site";

export const socialLinks = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
].filter((s) => s.href);

// Warm, low-glow embers drifting over the closing photo — the "floating
// light in a dark scene" mood reimagined in the site's own ochre/clay
// palette instead of literal white stars, since the backdrop is a warm
// alpenglow rather than a night sky.
export const EMBERS = [
  { top: "18%", left: "10%", size: 3, delay: "0s", duration: "8s" },
  { top: "28%", left: "84%", size: 4, delay: "1.4s", duration: "10s" },
  { top: "64%", left: "20%", size: 2, delay: "2.8s", duration: "7.5s" },
  { top: "46%", left: "70%", size: 3, delay: "0.6s", duration: "9.2s" },
  { top: "78%", left: "48%", size: 2, delay: "3.6s", duration: "8.6s" },
  { top: "12%", left: "58%", size: 3, delay: "2s", duration: "9.8s" },
  { top: "86%", left: "80%", size: 2, delay: "1s", duration: "7s" },
  { top: "40%", left: "6%", size: 2, delay: "4.2s", duration: "8.2s" },
] as const;

// Stagger for the logo signature vs. the headline above it, so the mark
// settles a beat after the words land instead of both arriving at once.
export const REVEAL_DELAY_LOGO = 0.1;
