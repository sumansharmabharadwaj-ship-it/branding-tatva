import type { Variants, Transition } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";

// Every timing/easing value the header's motion uses, in one place —
// so the icon swap, the mobile menu, and the hide-on-scroll bar all
// move with the same hand rather than three independently-tuned ones.

export const ICON_TRANSITION: Transition = { duration: 0.25, ease: EASE_AIR };
export const BACKDROP_TRANSITION: Transition = { duration: 0.3 };
export const MOBILE_NAV_TRANSITION: Transition = { duration: 0.35, ease: EASE_AIR };
export const BAR_TRANSITION: Transition = { duration: 0.4, ease: EASE_AIR };
export const NAV_ITEM_TRANSITION: Transition = { duration: 0.3, ease: EASE_AIR };
// A flat delay rather than an extra stagger step, so the CTA row always
// lands just after the last link regardless of how many nav items exist.
export const NAV_CTA_TRANSITION: Transition = { duration: 0.3, ease: EASE_AIR, delay: 0.35 };

export const menuIconVariants: Variants = {
  initial: { rotate: 90, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: -90, opacity: 0 },
};

export const closeIconVariants: Variants = {
  initial: { rotate: -90, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: 90, opacity: 0 },
};

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const mobileNavVariants: Variants = {
  initial: { opacity: 0, y: -14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.98 },
};

// The panel itself fades/scales in as one piece (above); the links inside
// it cascade in on top of that, rather than arriving as a single flat
// block — this is what makes the menu opening read as a considered
// sequence instead of a toggle. Reversed and quickened on the way out,
// since an exit should feel snappier than an entrance.
export const navListVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export const navItemVariants: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// The floating pill itself, sliding just out of view on scroll-down and
// dropping back in on scroll-up — translate/opacity only, so it stays
// off the layout-triggering properties the rest of the site's motion
// already avoids.
export const barVariants: Variants = {
  visible: { y: "0%", opacity: 1 },
  hidden: { y: "-130%", opacity: 0 },
};
