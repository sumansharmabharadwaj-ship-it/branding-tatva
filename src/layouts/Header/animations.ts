import type { Variants, Transition } from "framer-motion";

// Every timing/easing value the header's motion uses, in one place —
// so the icon swap, the mobile menu, and the hide-on-scroll bar all
// move with the same hand rather than three independently-tuned ones.

export const ICON_TRANSITION: Transition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] };
export const BACKDROP_TRANSITION: Transition = { duration: 0.3 };
export const MOBILE_NAV_TRANSITION: Transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };
export const BAR_TRANSITION: Transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

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

// The floating pill itself, sliding just out of view on scroll-down and
// dropping back in on scroll-up — translate/opacity only, so it stays
// off the layout-triggering properties the rest of the site's motion
// already avoids.
export const barVariants: Variants = {
  visible: { y: "0%", opacity: 1 },
  hidden: { y: "-130%", opacity: 0 },
};
