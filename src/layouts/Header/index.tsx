"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { LinkButton } from "@/components/Button";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useCurrentElement } from "@/lib/currentElement";
import { navigation } from "@/data/site";
import type { HeaderProps } from "./types";
import { SCROLLED_THRESHOLD, HIDE_REVEAL_DELTA, HIDE_REVEAL_MIN_SCROLL } from "./constants";
import {
  ICON_TRANSITION,
  BACKDROP_TRANSITION,
  MOBILE_NAV_TRANSITION,
  BAR_TRANSITION,
  NAV_ITEM_TRANSITION,
  NAV_CTA_TRANSITION,
  menuIconVariants,
  closeIconVariants,
  backdropVariants,
  mobileNavVariants,
  navListVariants,
  navItemVariants,
  barVariants,
} from "./animations";

// A compact, floating pill instead of a full-width bar: the wordmark stays
// the only permanent fixture (dead center, so it reads the same whether
// the CTA or menu button is present), everything else — every nav link,
// on every breakpoint — lives behind one hamburger toggle. Less chrome
// competing with whatever hero sits underneath it. Hides on scroll-down
// and reveals on scroll-up, so it gets out of the way while reading but
// is always one upward flick away.

export function Header({ transparent = false }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const element = useCurrentElement();

  useEffect(() => {
    function handleScroll(current: number) {
      setScrolled(current > SCROLLED_THRESHOLD);

      const last = lastScrollRef.current;
      const delta = current - last;
      if (Math.abs(delta) < HIDE_REVEAL_DELTA) return;

      if (current < HIDE_REVEAL_MIN_SCROLL) {
        setBarHidden(false);
      } else {
        setBarHidden(delta > 0);
      }
      lastScrollRef.current = current;
    }

    // Lenis drives real scroll, but doesn't reliably fire the native
    // `scroll` event alongside it — a prior attempt at this integration
    // broke on exactly that assumption. Subscribe to Lenis's own scroll
    // event when it's active; fall back to the native listener when it
    // isn't (prefers-reduced-motion, or before Lenis has mounted).
    if (lenis) {
      handleScroll(lenis.scroll);
      return lenis.on("scroll", (instance) => handleScroll(instance.scroll));
    }

    function onScroll() {
      handleScroll(window.scrollY);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [transparent]);

  // Was a two-tone system — a plain white/cream pill once scrolled past
  // a transparent hero, dark glass only at the very top. Direct, blunt
  // feedback three times over: first that the pill was "boring and
  // conventional," then that a thin gradient ring on the same white
  // pill still read as "bland white and plain orange," then that even
  // after going to one consistent dark-glass pill, an ivory CTA button
  // was still "white and boring." The CTA is now tied to the current
  // month's element color (useCurrentElement, shared with the footer's
  // own buttons and the calendar's own accent) instead of a fixed
  // ivory or clay — it actually changes through the year rather than
  // defaulting to the same one or two tones everywhere.
  const isBarHidden = barHidden && !open;

  return (
    <>
      <motion.header
        variants={prefersReducedMotion ? undefined : barVariants}
        animate={isBarHidden ? "hidden" : "visible"}
        transition={BAR_TRANSITION}
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:pt-5"
      >
        {/* nav-pill-ring: a slow rotating conic-gradient carrying all
            five element colors, plus nav-pill-glow — the same gradient
            blurred behind the pill as a soft halo, so the palette reads
            as genuinely vivid rather than a hairline most people would
            never consciously notice against a bright white fill. */}
        <div className="nav-pill-glow relative w-full max-w-4xl lg:max-w-5xl">
          <div className="nav-pill-ring rounded-full p-[2.5px] shadow-elevation-md">
            <div
              className={`flex w-full items-center justify-between gap-4 rounded-full px-4 py-2.5 backdrop-blur-md transition-colors duration-500 sm:px-5 ${
                scrolled ? "bg-soil/85" : "bg-soil/55"
              }`}
            >
              {/* Editorial nav order per direct feedback: identity on
                  the left, pages in the middle, actions on the right —
                  the centered logo was colliding with the inline links. */}
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <LogoMark size={30} light className="shrink-0" />
                <Logo light className="hidden origin-left scale-[0.72] min-[400px]:inline-flex sm:scale-[0.78]" />
              </Link>

              <div className="flex items-center justify-end gap-3 sm:gap-5">
                {/* Direct feedback: visitors should reach other pages
                    without scrolling to the top and opening the menu.
                    The primary pages sit inline on desktop; the menu
                    button remains for mobile and for the fuller list. */}
                <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ivory/75 transition-colors duration-300 hover:text-ivory"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="hidden sm:block">
                  <LinkButton href="/contact" className="px-4 py-2 text-xs" style={{ backgroundColor: element.color }}>
                    Start a project
                  </LinkButton>
                </div>
                <button
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-ivory transition-colors duration-500"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                >
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.span
                        key="close"
                        variants={prefersReducedMotion ? undefined : closeIconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={ICON_TRANSITION}
                        className="absolute flex"
                      >
                        <X size={20} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        variants={prefersReducedMotion ? undefined : menuIconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={ICON_TRANSITION}
                        className="absolute flex"
                      >
                        <Menu size={20} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              variants={prefersReducedMotion ? undefined : backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={BACKDROP_TRANSITION}
              className="fixed inset-0 z-30 bg-soil/40 backdrop-blur-xs"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-x-0 top-20 z-40 flex justify-center px-4 sm:top-24">
              <motion.nav
                variants={prefersReducedMotion ? undefined : mobileNavVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={MOBILE_NAV_TRANSITION}
                className="w-full max-w-sm rounded-lg border border-border bg-background-elevated p-3 shadow-elevation-lg"
                aria-label="Primary"
              >
                <motion.ul
                  variants={prefersReducedMotion ? undefined : navListVariants}
                  className="flex flex-col"
                >
                  {navigation.map((item) => (
                    <motion.li
                      key={item.href}
                      variants={prefersReducedMotion ? undefined : navItemVariants}
                      transition={NAV_ITEM_TRANSITION}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-4 py-3 text-center font-display text-xl text-soil transition-colors hover:bg-soil/5 hover:text-clay"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  variants={prefersReducedMotion ? undefined : navItemVariants}
                  transition={NAV_CTA_TRANSITION}
                  className="mt-2 border-t border-border pt-3 sm:hidden"
                >
                  <LinkButton
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="w-full"
                    style={{ backgroundColor: element.color }}
                  >
                    Start a project
                  </LinkButton>
                </motion.div>
              </motion.nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
