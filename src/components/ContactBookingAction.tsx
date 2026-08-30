"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/Magnetic";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useSpotlight } from "@/hooks/useSpotlight";
import { track } from "@/lib/analytics";
import { EASE_AIR } from "@/lib/motion";
import { useServicesContactPackage } from "@/hooks/useServicesContactPackage";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";

let bookingRippleId = 0;

function getVisitorTimezoneLabel() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return null;
    const city = zone.split("/").pop()?.replaceAll("_", " ");
    if (!city) return null;
    return city === "Calcutta" ? "Kolkata" : city;
  } catch {
    return null;
  }
}

export function ContactBookingAction({
  href,
  consultationMinutes,
  founder,
}: {
  href: string;
  consultationMinutes: number;
  founder: string;
}) {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const packageSlug = useServicesContactPackage();
  const bookingHref = calendlyHrefForServicesPackage(href, packageSlug);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const rippleTimersRef = useRef<Set<number>>(new Set());
  const spotlightRef = useSpotlight(linkRef, Boolean(prefersReducedMotion));
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const visitorTimezone = useMemo(
    () => (hydrated ? getVisitorTimezoneLabel() : null),
    [hydrated],
  );

  useEffect(() => {
    const timers = rippleTimersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    track("calendar_opened", {
      source: "contact_final_scene",
      ...(packageSlug ? { package: packageSlug } : {}),
    });
    if (prefersReducedMotion || event.detail === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const id = bookingRippleId++;
    setRipples((current) => [
      ...current,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    const timer = window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
      rippleTimersRef.current.delete(timer);
    }, 720);
    rippleTimersRef.current.add(timer);
  }

  return (
    <Magnetic intensity={0.14} range={120} className="contact-booking-action-wrap mt-8 block">
      <a
        data-contact-booking-action
        ref={linkRef}
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex min-h-16 w-full items-center gap-4 overflow-hidden rounded-2xl bg-soil p-4 text-left text-ivory shadow-elevation-sm transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-action-primary-hover hover:shadow-elevation-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay sm:p-5"
        aria-label={`Open Calendly in ${visitorTimezone ?? "your timezone"} to book a ${consultationMinutes} minute meeting with ${founder}`}
      >
        <span
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
        {!prefersReducedMotion ? (
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                aria-hidden="true"
                className="pointer-events-none absolute h-[260px] w-[260px] rounded-full bg-current"
                style={{ left: ripple.x - 130, top: ripple.y - 130 }}
                initial={{ scale: 0, opacity: 0.22 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.72, ease: EASE_AIR }}
              />
            ))}
          </AnimatePresence>
        ) : null}
        <span className="relative z-10 min-w-0 flex-1">
          <span data-contact-booking-action-title className="block font-display text-2xl font-normal sm:text-3xl">
            Choose a time
          </span>
          <span className="mt-1 block min-h-5 text-sm text-ivory/65">
            Your timezone · {visitorTimezone ?? "live calendar"}
          </span>
        </span>
        <span data-contact-booking-action-arrow className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sandstone text-soil transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105">
          <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
        </span>
      </a>
    </Magnetic>
  );
}
