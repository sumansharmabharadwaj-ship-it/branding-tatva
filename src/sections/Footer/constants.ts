import { Instagram, Facebook, Linkedin } from "lucide-react";
import { site } from "@/data/site";

export const socialLinks = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
].filter((s) => s.href);

// The same warm ember radial the cursor and page-load veil both use,
// behind the closing manifesto's glyph — one glow recipe carried through
// to the very last beat instead of a one-off gradient.
export const MANIFESTO_GLOW =
  "radial-gradient(circle, rgba(194,138,40,0.16) 0%, rgba(184,90,52,0.08) 45%, rgba(184,90,52,0) 75%)";

// Stagger for the closing manifesto vs. the logo signature beneath it,
// so the logo settles a beat after the words rather than both landing
// at once.
export const REVEAL_DELAY_LOGO = 0.1;
