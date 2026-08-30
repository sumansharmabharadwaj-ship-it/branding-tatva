"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";
import { packages } from "@/data/services";
import { site } from "@/data/site";
import { useServicesContactPackage } from "@/hooks/useServicesContactPackage";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";

export function ContactHeroBookingLink() {
  const packageSlug = useServicesContactPackage();
  const href = calendlyHrefForServicesPackage(site.calendlyUrl, packageSlug);

  return (
    <TrackedLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      event="calendar_opened"
      eventProps={{
        source: "contact_hero",
        ...(packageSlug ? { package: packageSlug } : {}),
      }}
      data-cursor-label="Book a session"
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-ivory px-6 py-3 text-sm font-medium text-soil transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ivory"
    >
      Book a {site.consultationMinutes} minute session
      <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" strokeWidth={1.5} />
    </TrackedLink>
  );
}

export function ContactHeroContextCard() {
  const packageSlug = useServicesContactPackage();
  const selectedPackage = packages.find((entry) => entry.slug === packageSlug);

  return (
    <div
      data-services-contact-handoff={selectedPackage ? "true" : undefined}
      className="max-w-xs rounded-2xl border border-white/15 bg-soil/25 p-4 text-left shadow-[0_18px_60px_rgba(12,18,13,0.18)] backdrop-blur-xl sm:p-5 lg:ml-auto"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sandstone">
          <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <div aria-live="polite">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/55">
            {selectedPackage ? "Carried from Brand Strategy" : "A personal reply"}
          </p>
          <p className="mt-1 font-display text-lg text-ivory">
            {selectedPackage?.name ?? site.founder}
          </p>
        </div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-sm leading-relaxed text-ivory/72">
        {selectedPackage
          ? "Your selected package stays attached whether you book a session or write a note."
          : "Read by Suman from the first note to the final reply."}
      </p>
    </div>
  );
}
