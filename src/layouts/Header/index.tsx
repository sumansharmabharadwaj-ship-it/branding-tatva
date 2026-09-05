"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { AmbientAudioButton } from "@/components/AmbientAudio";
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();
  const element = useCurrentElement();
  const pathname = usePathname() ?? "/";

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
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.siteMenu = "open";
    const inertTargets = [document.querySelector<HTMLElement>("main"), document.querySelector<HTMLElement>("footer")]
      .filter((target): target is HTMLElement => Boolean(target));
    const previousInert = inertTargets.map((target) => target.inert);
    inertTargets.forEach((target) => {
      target.inert = true;
    });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (e.key !== "Tab") return;

      const menu = menuRef.current;
      const trigger = menuButtonRef.current;
      if (!menu || !trigger) return;
      const menuItems = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((item) => item.getClientRects().length > 0);
      const focusables = [trigger, ...menuItems];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !active || !focusables.includes(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !active || !focusables.includes(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      delete document.documentElement.dataset.siteMenu;
      inertTargets.forEach((target, index) => {
        target.inert = previousInert[index];
      });
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, transparent]);

  const isBarHidden = barHidden && !open;
  const accent =
    pathname.startsWith("/services") ? "#8FAE83"
    : pathname.startsWith("/work") ? "#D4B99A"
    : pathname.startsWith("/insights") || pathname.startsWith("/glossary") ? "#C28A28"
    : pathname.startsWith("/contact") ? "#AD6F5C"
    : pathname.startsWith("/about") ? "#795A43"
    : "#C6A97A";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        data-site-header
        variants={barVariants}
        animate={isBarHidden ? "hidden" : "visible"}
        transition={prefersReducedMotion ? { duration: 0 } : BAR_TRANSITION}
        className="site-header fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <div className="relative w-full max-w-4xl lg:max-w-5xl">
          <div
            className={`site-header__bar flex w-full items-center justify-between gap-4 rounded-full border border-soil/10 px-4 py-2.5 shadow-elevation-md backdrop-blur-md transition-colors duration-500 sm:px-6 sm:py-3 ${
              scrolled ? "bg-[#f4efe6]/94" : "bg-[#f4efe6]/84"
            }`}
          >
            <Link href="/" className="site-header__brand flex min-w-0 shrink-0 items-center gap-3">
              <LogoMark size={32} className="shrink-0" />
              <span aria-hidden="true" className="site-header__divider hidden h-6 w-px bg-soil/20 min-[360px]:block" />
              {/* Logo owns an inline-flex display internally, so the
                  responsive visibility belongs to a parent wrapper.
                  Shared mobile CSS keeps the complete wordmark visible
                  without crowding the menu control on narrow phones. */}
              <span className="site-header__wordmark hidden min-[360px]:inline-flex">
                <Logo className="origin-left" />
              </span>
            </Link>

            <div className="site-header__actions flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-5">
              {/* The complete label set needs a genuinely wide canvas. At
                  laptop widths the CTA and always-available menu preserve
                  every route without compressing the wordmark or allowing
                  Brand Strategy & Systems to collide with its neighbours. */}
              <nav aria-label="Primary" className="hidden items-center gap-7 2xl:flex">
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
                          active ? "" : "text-soil/72 hover:text-soil"
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
              <span aria-hidden="true" className="hidden h-6 w-px bg-soil/20 2xl:block" />
              <Link
                href="/contact"
                className="group hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:inline-flex"
                style={{ borderColor: `${accent}c0`, color: accent }}
              >
                Talk with Suman
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <span className="site-header__ambient">
                <AmbientAudioButton accent={accent} />
              </span>
              <button
                ref={menuButtonRef}
                className="site-header__menu-button relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500"
                style={{ color: accent }}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="primary-menu"
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
            <div className="site-header__menu-shell fixed inset-x-0 top-20 z-40 flex justify-center px-4 sm:top-24">
              <motion.nav
                ref={menuRef}
                id="primary-menu"
                variants={prefersReducedMotion ? undefined : mobileNavVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={MOBILE_NAV_TRANSITION}
                className="site-header__menu-panel w-full max-w-sm rounded-2xl border border-soil/10 bg-[#f4efe6]/96 p-3 text-soil shadow-[0_28px_90px_rgba(67,54,42,0.22)] backdrop-blur-xl"
                aria-label="Primary"
              >
                <motion.ul variants={prefersReducedMotion ? undefined : navListVariants} className="flex flex-col">
                  {navigation.map((item) => (
                    <motion.li
                      key={item.href}
                      variants={prefersReducedMotion ? undefined : navItemVariants}
                      transition={NAV_ITEM_TRANSITION}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block min-h-12 rounded-2xl px-4 py-3 text-center font-display text-xl text-soil/80 transition-colors hover:bg-soil/[0.05] hover:text-clay focus-visible:bg-soil/[0.05] focus-visible:text-clay"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  variants={prefersReducedMotion ? undefined : navItemVariants}
                  transition={NAV_ITEM_TRANSITION}
                  className="site-header__mobile-audio mt-2 items-center justify-between rounded-2xl border-t border-soil/10 px-4 pt-3 min-[430px]:hidden"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-soil/62">
                    Ambient sound
                  </span>
                  <AmbientAudioButton accent={accent} />
                </motion.div>
                <motion.div
                  variants={prefersReducedMotion ? undefined : navItemVariants}
                  transition={NAV_CTA_TRANSITION}
                  className="mt-2 border-t border-soil/10 pt-3 sm:hidden"
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 w-full items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.16em] text-soil"
                    style={{ backgroundColor: element.color }}
                  >
                    Talk with Suman
                  </Link>
                </motion.div>
              </motion.nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
