"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { LinkButton } from "./Button";
import { site, navigation } from "@/data/site";

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!transparent) return;
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const isLight = transparent && !scrolled && !open;

  return (
    <header
      className={`${transparent ? "fixed" : "sticky"} top-0 z-40 w-full transition-colors duration-500 ${
        isLight
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/90 backdrop-blur"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" aria-label={site.name}>
          <Logo light={isLight} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative text-sm transition-colors ${
                isLight ? "text-ivory/90 hover:text-ivory" : "text-foreground-secondary hover:text-soil"
              }`}
              style={isLight ? { textShadow: "0 1px 8px rgba(20,17,14,0.7)" } : undefined}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-earth group-hover:scale-x-100 ${
                  isLight ? "bg-ivory" : "bg-soil"
                }`}
              />
            </Link>
          ))}
          <LinkButton href="/contact" className="px-4 py-2">
            Start a project
          </LinkButton>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 -mr-2 transition-colors duration-500 ${isLight ? "text-ivory" : "text-foreground"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base text-foreground hover:bg-soil/5"
                >
                  {item.label}
                </Link>
              ))}
              <LinkButton
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 w-full px-3 py-3"
              >
                Start a project
              </LinkButton>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
