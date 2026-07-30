"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { LinkButton } from "@/components/Button";
import { useLenis } from "@/components/SmoothScrollProvider";
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

  const isLight = transparent && !scrolled && !open;
  // Never actually hide the bar while the mobile menu is open — its own
  // toggle button lives inside it.
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
            five element colors, replacing the old flat single-tone
            border — direct feedback that the pill read as boring/
            generic against the rest of a site built entirely on this
            palette. 1.5px padding is the whole "border" now; the inner
            pill no longer sets its own border color. */}
        <div className="nav-pill-ring w-full max-w-3xl rounded-full p-[1.5px] shadow-elevation-sm">
          <div
            className={`grid w-full grid-cols-3 items-center rounded-full px-3 py-2.5 backdrop-blur-md transition-colors duration-500 sm:px-4 ${
              isLight ? "bg-soil/40" : "bg-background-elevated/95"
            }`}
          >
            <div className="hidden justify-start sm:flex">
              <LinkButton
                href="/contact"
                className={`px-4 py-2 text-xs ${
                  isLight ? "bg-ivory! text-soil! hover:bg-ivory/90!" : ""
                }`}
              >
                Start a project
              </LinkButton>
            </div>

            <Link href="/" className="col-start-2 flex items-center justify-center gap-1.5">
              <LogoMark size={20} className="shrink-0" />
              <Logo light={isLight} className="scale-[0.72] sm:scale-[0.78]" />
            </Link>

            <div className="flex justify-end">
              <button
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 ${
                  isLight ? "text-ivory" : "text-foreground"
                }`}
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
                  <LinkButton href="/contact" onClick={() => setOpen(false)} className="w-full">
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
