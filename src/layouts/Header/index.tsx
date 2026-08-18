"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { AmbientAudioButton } from "@/components/AmbientAudio";
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

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const focusFrame = window.requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ?.focus({ preventScroll: true });
    });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute("hidden"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      menuButton?.focus({ preventScroll: true });
    };
  }, [lenis, open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, transparent]);

  const isBarHidden = barHidden && !open;
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
        <div className="relative w-full max-w-4xl lg:max-w-5xl">
          <div
            className={`flex w-full items-center justify-between gap-4 rounded-full border border-ivory/10 px-4 py-2.5 shadow-elevation-md backdrop-blur-md transition-colors duration-500 sm:px-6 sm:py-3 ${
              scrolled ? "bg-[#1B1B1B]/90" : "bg-[#1B1B1B]/60"
            }`}
          >
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
              <LogoMark size={32} light className="shrink-0" />
              <span aria-hidden="true" className="hidden h-6 w-px bg-ivory/25 min-[376px]:block" />
              {/* Logo owns an inline-flex display internally, so the
                  responsive visibility belongs to a parent wrapper.
                  This keeps the wordmark at 390px while leaving enough
                  room for sound and menu controls at 360px. */}
              <span className="hidden min-[376px]:inline-flex">
                <Logo light className="origin-left" />
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-5">
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
              <AmbientAudioButton accent={accent} />
              <button
                ref={menuButtonRef}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500"
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
                ref={menuRef}
                variants={prefersReducedMotion ? undefined : mobileNavVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={MOBILE_NAV_TRANSITION}
                className="w-full max-w-sm rounded-2xl border border-border bg-background-elevated p-3 shadow-elevation-lg"
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
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="flex min-h-12 items-center justify-center rounded-2xl px-4 py-3 text-center font-display text-xl text-soil transition-colors hover:bg-soil/5 hover:text-clay"
                        style={isActive(item.href) ? { color: accent, backgroundColor: `${accent}12` } : undefined}
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
