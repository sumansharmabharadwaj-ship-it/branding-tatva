"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { TexturedDark } from "@/components/TexturedDark";
import { Logo } from "@/components/Logo";
import { SeasonalCalendarPanel } from "@/components/SeasonalCalendarPanel";
import { Reveal } from "@/components/Reveal";
import { ElementAccentButton } from "@/components/ElementAccentButton";
import { MotionToggle } from "@/components/MotionPreference";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { site, footerLinks } from "@/data/site";
import { socialLinks } from "./constants";

const WIDGET_CLASS =
  "rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md p-5 sm:p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-black/25";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {isHome && <FinalInvitation />}

      <footer className="relative">
        <TexturedDark
          image="/images/own-jagged-peaks.jpg"
          video="/videos/own-jagged-peaks.mp4"
          imagePosition="center 85%"
          className="py-12 sm:py-14"
        >
          <Container className="relative">
            <Reveal className="mx-auto max-w-xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-ivory/50">Let&apos;s talk</p>
              <h2 className="mt-2 font-display text-2xl font-normal leading-tight text-ivory sm:text-3xl">
                Every brand is visible. Let&apos;s make yours unforgettable.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row">
              <div className={`${WIDGET_CLASS} flex flex-col justify-center gap-5 sm:w-[240px] sm:shrink-0`}>
                <div>
                  <Logo light className="origin-left scale-90" />
                  <p className="mt-3 text-sm text-ivory/80">
                    A solo practice. Every project led directly by Suman, start to finish.
                  </p>
                </div>
                <div className="self-start">
                  <ElementAccentButton href="/contact">Book a Session</ElementAccentButton>
                </div>
              </div>

              <div className="sm:min-w-0 sm:flex-1">
                <SeasonalCalendarPanel />
              </div>

              <div className={`${WIDGET_CLASS} flex flex-col justify-center gap-5 sm:w-[220px] sm:shrink-0`}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Get in touch</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-2 block break-all text-sm text-ivory/80 transition-colors hover:text-ivory"
                  >
                    {site.email}
                  </a>
                </div>
                <div className="h-px w-8 bg-ivory/20" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Follow along</p>
                  <div className="mt-2 flex gap-3">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${site.name} on ${label}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 text-ivory/70 transition-colors hover:border-ivory/50 hover:text-ivory"
                      >
                        <Icon size={16} strokeWidth={1.75} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </TexturedDark>

        <div className="flex flex-col-reverse items-center gap-3 bg-soil px-6 py-5 text-center sm:flex-row sm:justify-between sm:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-xs text-ivory/60">
              © {new Date().getFullYear()} {site.name}
            </p>
            <p className="text-[0.65rem] text-ivory/40">
              Ambient music: &ldquo;That Zen Moment&rdquo; by{" "}
              <a
                href="https://incompetech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-ivory/30 underline-offset-2 hover:text-ivory/60"
              >
                Kevin MacLeod
              </a>{" "}
              (CC BY 4.0)
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MotionToggle />
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-ivory/60 hover:text-ivory">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
