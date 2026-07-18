"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { site, navigation } from "@/data/site";

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`sticky top-0 z-40 transition-colors duration-500 ${
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
              className={`text-sm transition-colors ${
                isLight ? "text-ivory/80 hover:text-ivory" : "text-foreground-secondary hover:text-soil"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-warm-white hover:bg-action-primary-hover transition-colors"
          >
            Start a project
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 -mr-2 ${isLight ? "text-ivory" : "text-foreground"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {/* Mobile nav */}
      {open && (
        <nav
          className="md:hidden border-t border-border bg-background"
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
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-action-primary px-3 py-3 text-center text-base font-medium text-warm-white"
            >
              Start a project
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
