"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "./Button";
import { useLenis } from "./SmoothScrollProvider";
import { site, navigation } from "@/data/site";

// A compact, floating pill instead of a full-width bar: the wordmark stays
// the only permanent fixture (dead center, so it reads the same whether
// the CTA or menu button is present), everything else — every nav link,
// on every breakpoint — lives behind one hamburger toggle. Less chrome
// competing with whatever hero sits underneath it.

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (!transparent) return;

    // Lenis drives real scroll, but doesn't reliably fire the native
    // `scroll` event alongside it — a prior attempt at this integration
    // broke on exactly that assumption. Subscribe to Lenis's own scroll
    // event when it's active; fall back to the native listener when it
    // isn't (prefers-reduced-motion, or before Lenis has mounted).
    if (lenis) {
      setScrolled(lenis.scroll > 80);
      return lenis.on("scroll", (instance) => setScrolled(instance.scroll > 80));
    }

    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent, lenis]);

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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:pt-5">
        <div
          className={`grid w-full max-w-3xl grid-cols-3 items-center rounded-full border px-3 py-2.5 backdrop-blur-md transition-colors duration-500 sm:px-4 ${
            isLight
              ? "border-ivory/25 bg-soil/25"
              : "border-border bg-background-elevated/90 shadow-elevation-sm"
          }`}
        >
          <div className="flex justify-start">
            <LinkButton
              href="/contact"
              className={`hidden px-4 py-2 text-xs sm:inline-flex ${
                isLight ? "!bg-ivory !text-soil hover:!bg-ivory/90" : ""
              }`}
            >
              Start a project
            </LinkButton>
          </div>

          <Link href="/" aria-label={site.name} className="flex justify-center">
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
                    initial={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute flex"
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute flex"
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-soil/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-x-0 top-20 z-40 flex justify-center px-4 sm:top-24">
              <motion.nav
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: -14, scale: 0.98 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm rounded-lg border border-border bg-background-elevated p-3 shadow-elevation-lg"
                aria-label="Primary"
              >
                <ul className="flex flex-col">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-4 py-3 text-center font-display text-xl text-soil transition-colors hover:bg-soil/5 hover:text-clay"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 border-t border-border pt-3 sm:hidden">
                  <LinkButton href="/contact" onClick={() => setOpen(false)} className="w-full">
                    Start a project
                  </LinkButton>
                </div>
              </motion.nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
