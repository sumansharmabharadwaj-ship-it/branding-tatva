"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  // The living pill (Suman's board, item six): the bar's one gold
  // accent shifts with the page's own world — warm earth at Home,
  // river green through Services, paper sand across Work, book ochre
  // in Insights, studio rose at Contact — and the active route gets
  // named with color and a small node, per the manual's active-state
  // requirement. One accent at a time; the charcoal glass stays put.
  const pathname = usePathname() ?? "/";
  const accent =
    pathname.startsWith("/services") ? "#8FAE83"
    : pathname.startsWith("/work") ? "#D4B99A"
    : pathname.startsWith("/insights") || pathname.startsWith("/glossary") ? "#C28A28"
    : pathname.startsWith("/contact") ? "#AD6F5C"
    : "#C6A97A";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        variants={prefersReducedMotion ? undefined : barVariants}
        animate={isBarHidden ? "hidden" : "visible"}
        transition={BAR_TRANSITION}
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:pt-5"
      >
        {/* Rebuilt to the approved reference board (Aug 2026): one dark
            glass pill, quiet hairline border, monogram + hairline
            divider + wordmark as the identity block on the left, the
            four content pages inline on the right, a second hairline,
            then an outlined Warm Sand CTA and a Warm Sand menu toggle.
            The earlier rotating five-color ring and the element-tinted
            solid CTA are gone on purpose — the reference's whole point
            is restraint: charcoal glass, ivory type, one gold accent. */}
        <div className="relative w-full max-w-4xl lg:max-w-5xl">
          <div
            className={`flex w-full items-center justify-between gap-4 rounded-full border border-ivory/10 px-4 py-2.5 shadow-elevation-md backdrop-blur-md transition-colors duration-500 sm:px-6 sm:py-3 ${
              scrolled ? "bg-[#1B1B1B]/90" : "bg-[#1B1B1B]/60"
            }`}
          >
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <LogoMark size={32} light className="shrink-0" />
              <span aria-hidden="true" className="hidden h-6 w-px bg-ivory/25 min-[400px]:block" />
              <Logo light className="hidden origin-left min-[400px]:inline-flex" />
            </Link>

            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
              {/* Home rides on the logo and Contact rides on the CTA, so
                  the inline list carries only the four content pages —
                  exactly the reference's ABOUT · SERVICES · WORK ·
                  INSIGHTS row. The menu keeps the complete list. */}
              <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-7">
                {navigation
                  .filter((item) => item.href !== "/" && item.href !== "/contact")
                  .map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                          active ? "" : "text-ivory/85 hover:text-ivory"
                        }`}
                        style={active ? { color: accent } : undefined}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                        )}
                      </Link>
                    );
                  })}
              </nav>
              <span aria-hidden="true" className="hidden h-6 w-px bg-ivory/25 lg:block" />
              <Link
                href="/contact"
                className="group hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:inline-flex"
                style={{ borderColor: `${accent}c0`, color: accent }}
              >
                Book a Session
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <button
                  className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500"
                  style={{ color: accent }}
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
                className="w-full max-w-sm rounded-2xl border border-border bg-background-elevated p-3 shadow-elevation-lg"
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
                        className="block rounded-2xl px-4 py-3 text-center font-display text-xl text-soil transition-colors hover:bg-soil/5 hover:text-clay"
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
                    Book a Session
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
