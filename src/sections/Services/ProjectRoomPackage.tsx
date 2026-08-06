"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LinkButton } from "@/components/Button";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { packages, type Package } from "@/data/services";
import type { Project } from "@/data/projects";
import { formatPrice, type PackageSlug, type Region } from "@/data/pricing";
import { track } from "@/lib/analytics";

const ROOM_TABS = [
  { id: "brief", label: "The brief" },
  { id: "route", label: "The route" },
  { id: "scope", label: "What arrives" },
  { id: "investment", label: "Investment" },
] as const;

type RoomTab = (typeof ROOM_TABS)[number]["id"];

// The approved project route is presented as a sequence, not six equal
// process cards. The proposal still decides the exact breadth and timing;
// these labels explain the shape of the work without promising a fixed
// calendar before the brief is understood.
const PROJECT_ROUTE = ["Discover", "Define", "Design", "Develop", "Deliver", "Evolve"] as const;

const SEPARATE_ADDITIONS = ["Production", "Media", "Printing", "Development", "Travel", "Licensing"] as const;

// The package is treated as a working room rather than a retail plan.
// Four chapters keep business situation, decision, process, handover,
// localized investment, and quotation policy inspectable without
// pouring the whole proposal into one very tall card.
export function ProjectRoomPackage({
  pkg,
  region,
  proof,
}: {
  pkg: Package;
  region: Region;
  proof?: Project;
}) {
  const [tab, setTab] = useState<RoomTab>("brief");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const packageIndex = packages.findIndex((candidate) => candidate.slug === pkg.slug);
  const activeTabIndex = ROOM_TABS.findIndex((candidate) => candidate.id === tab);
  const price = formatPrice(region, pkg.slug as PackageSlug);

  function selectTab(index: number, focus = false) {
    const nextIndex = (index + ROOM_TABS.length) % ROOM_TABS.length;
    const next = ROOM_TABS[nextIndex];
    setTab(next.id);
    track("package_viewed", {
      package: pkg.slug,
      source: "project_room",
      chapter: next.id,
    });
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = index - 1;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = ROOM_TABS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectTab(nextIndex, true);
  }

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <article
      data-project-room="true"
      data-project-room-version="2"
      data-project-room-package={pkg.slug}
      data-project-room-tab={tab}
      className="overflow-hidden rounded-[1.75rem] border border-ivory/14 bg-[rgba(12,17,20,0.78)] text-left shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      style={{ borderTopColor: pkg.color, borderTopWidth: 2 }}
    >
      <header className="grid gap-5 border-b border-ivory/10 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-end sm:px-7 sm:py-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/45">Project room</span>
            <span className="h-px w-8 bg-ivory/18" aria-hidden="true" />
            <span className="font-display text-sm text-ivory/45">
              {String(packageIndex + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-normal text-ivory sm:text-3xl">{pkg.name}</h3>
        </div>
        <div className="sm:text-right">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/45">
            {pkg.billing === "monthly" ? "Ongoing from" : "Projects begin at"}
          </p>
          <p className="mt-1 font-display text-2xl font-normal text-ivory">{price}</p>
          {pkg.billing === "monthly" && <p className="text-xs text-ivory/55">per month</p>}
        </div>
      </header>

      <div
        role="tablist"
        aria-label={`${pkg.name} project room`}
        className="grid grid-cols-2 border-b border-ivory/10 sm:grid-cols-4"
      >
        {ROOM_TABS.map((roomTab, index) => {
          const selected = roomTab.id === tab;
          return (
            <button
              key={roomTab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${pkg.slug}-room-tab-${roomTab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${pkg.slug}-room-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={`relative min-h-12 border-r border-ivory/10 px-3 py-3 text-center text-[0.66rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sandstone sm:min-h-14 ${
                selected ? "text-ivory" : "text-ivory/45 hover:bg-ivory/[0.035] hover:text-ivory/80"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId={`${pkg.slug}-project-room-active-tab`}
                  aria-hidden="true"
                  className="absolute inset-x-5 bottom-0 h-px"
                  style={{ backgroundColor: pkg.color }}
                  transition={transition}
                />
              )}
              {roomTab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${pkg.slug}-room-panel`}
        role="tabpanel"
        aria-labelledby={`${pkg.slug}-room-tab-${tab}`}
        aria-live="polite"
        className="relative min-h-[20rem] px-5 py-6 sm:min-h-[21rem] sm:px-7 sm:py-7"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6, filter: "blur(2px)" }}
            transition={transition}
          >
            {tab === "brief" && (
              <div className="grid gap-7 md:grid-cols-2 md:gap-10">
                <div>
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Business situation</p>
                  <p className="mt-3 font-display text-xl font-normal leading-snug text-ivory sm:text-2xl">{pkg.forWho}</p>
                </div>
                <div className="border-t border-ivory/12 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Core decision</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/82 sm:text-base">{pkg.description}</p>
                </div>
                <p className="border-t border-ivory/10 pt-4 text-sm leading-relaxed text-ivory/58 md:col-span-2">
                  This is the working scope, not an instant quote. Discovery confirms what stays, what changes, and what the final proposal needs to contain.
                </p>
              </div>
            )}

            {tab === "route" && (
              <div>
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Project phases</p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ivory/70">
                      One connected route. The breadth of each phase is confirmed after discovery.
                    </p>
                  </div>
                  <p className="hidden font-display text-sm text-ivory/35 sm:block">01 → 06</p>
                </div>
                <ol className="relative mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-3">
                  <span
                    aria-hidden="true"
                    className="absolute left-[8%] right-[8%] top-[1.05rem] hidden h-px bg-gradient-to-r from-transparent via-ivory/20 to-transparent sm:block"
                  />
                  {PROJECT_ROUTE.map((phase, index) => (
                    <li key={phase} className="relative text-center">
                      <span
                        className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full border bg-[#11181B] font-display text-xs"
                        style={{ borderColor: `${pkg.color}99`, color: pkg.color }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 text-xs text-ivory/72">{phase}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ivory/10 bg-ivory/[0.025] p-4">
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ivory/45">Client input</p>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/72">
                      Your input, decision points, and approvals are mapped inside the proposal rather than scattered across the project.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ivory/10 bg-ivory/[0.025] p-4">
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ivory/45">Timeline policy</p>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/72">
                      The proposal confirms the broad phases and approximate timeline after the scope is understood.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "scope" && (
              <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.72fr)] md:gap-10">
                <div>
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Included deliverables</p>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {pkg.includes.map((item, index) => (
                      <li key={item} className="flex items-start gap-3 border-t border-ivory/10 pt-3 text-sm leading-relaxed text-ivory/80">
                        <span className="font-display text-xs" style={{ color: pkg.color }} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-ivory/12 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Quoted separately where relevant</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEPARATE_ADDITIONS.map((addition) => (
                      <span key={addition} className="rounded-full border border-ivory/12 px-3 py-1.5 text-xs text-ivory/62">
                        {addition}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-ivory/45">
                    Only the additions the final scope actually needs appear in the quotation.
                  </p>
                </div>
              </div>
            )}

            {tab === "investment" && (
              <div className="grid gap-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-10">
                <div>
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-ivory/45">Localized investment</p>
                  <div className="mt-3 flex items-end gap-2">
                    <p className="font-display text-4xl font-normal text-ivory sm:text-5xl">{price}</p>
                    {pkg.billing === "monthly" && <span className="pb-1 text-sm text-ivory/55">/ month</span>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/62">
                    Final scope and quotation follow the discovery conversation. Taxes and relevant third-party costs are listed separately.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <LinkButton href="/contact" style={{ backgroundColor: pkg.color }}>
                      Request a scoped quotation
                    </LinkButton>
                    {proof ? (
                      <LinkButton
                        href={`/work/${proof.slug}`}
                        variant="secondary"
                        className="border-ivory/30 text-ivory hover:bg-ivory/10"
                      >
                        See the decision trail
                      </LinkButton>
                    ) : (
                      <LinkButton href="/work" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                        Explore verified work
                      </LinkButton>
                    )}
                  </div>
                </div>

                {proof ? (
                  <a
                    href={`/work/${proof.slug}`}
                    className="group rounded-2xl border border-ivory/12 bg-ivory/[0.025] p-5 transition-colors hover:border-ivory/28 hover:bg-ivory/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ivory/45">Related verified work</p>
                      <span aria-hidden="true" className="text-ivory/45 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                    <p className="mt-3 font-display text-xl font-normal text-ivory">{proof.title}</p>
                    <p className="mt-1 text-xs text-ivory/50">{proof.industry}</p>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ivory/70">{proof.hook ?? proof.outcome}</p>
                    {proof.stats?.[0] && (
                      <div className="mt-5 border-t border-ivory/10 pt-4">
                        <p className="font-display text-2xl text-ivory">{proof.stats[0].value}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ivory/50">{proof.stats[0].label}</p>
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="rounded-2xl border border-dashed border-ivory/14 p-5">
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ivory/45">Quotation path</p>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/68">
                      Share the business stage, service required, country, approximate timeline, and optional budget range. The proposal can then reflect the real project instead of a generic tier.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-ivory/10 px-5 py-3.5 sm:px-7">
        <p className="text-xs text-ivory/42">
          Chapter {activeTabIndex + 1} of {ROOM_TABS.length}
        </p>
        <button
          type="button"
          data-project-room-next="true"
          onClick={() => selectTab(activeTabIndex + 1)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs text-ivory/65 transition-colors hover:bg-ivory/[0.04] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
        >
          {activeTabIndex === ROOM_TABS.length - 1 ? "Return to the brief" : `Next: ${ROOM_TABS[activeTabIndex + 1].label}`}
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </article>
  );
}