"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { deliverables, SCOPE_GROUPS, type ScopeGroup } from "@/data/deliverables";
import { packages } from "@/data/services";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";
import { ArtifactPreview } from "@/sections/Services/ArtifactPreview";

const DETAIL_MODES = [
  { id: "what", label: "What it is" },
  { id: "why", label: "Why it matters" },
  { id: "use", label: "How it gets used" },
] as const;

type DetailMode = (typeof DETAIL_MODES)[number]["id"];

// Fourteen stacked chips made the archive accurate but expensive to
// travel through, particularly on a phone. The same real catalog now
// opens through five scope drawers. Only the active drawer's three or
// four artifacts occupy the scene, while a second compact switcher lets
// the visitor inspect what, why, and use without adding three paragraphs
// to the page height. Every item and sentence still comes directly from
// data/deliverables.ts.
export function DeliverablesExplorer() {
  const [group, setGroup] = useState<ScopeGroup>(SCOPE_GROUPS[0]);
  const [activeId, setActiveId] = useState(deliverables[0].id);
  const [detailMode, setDetailMode] = useState<DetailMode>("what");
  const groupRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const detailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useHydratedReducedMotion();

  const visible = deliverables.filter((deliverable) => deliverable.group === group);
  const active = deliverables.find((deliverable) => deliverable.id === activeId) ?? visible[0] ?? deliverables[0];
  const activeGroupIndex = SCOPE_GROUPS.indexOf(group);
  const groupCount = (scope: ScopeGroup) => deliverables.filter((deliverable) => deliverable.group === scope).length;
  const detailText = detailMode === "what" ? active.what : detailMode === "why" ? active.why : active.use;

  function pick(id: string) {
    setActiveId(id);
    setDetailMode("what");
    track("deliverable_inspected", { deliverable: id });
  }

  function pickGroup(nextGroup: ScopeGroup) {
    setGroup(nextGroup);
    const pool = deliverables.filter((deliverable) => deliverable.group === nextGroup);
    if (pool.length && !pool.some((deliverable) => deliverable.id === activeId)) {
      setActiveId(pool[0].id);
      setDetailMode("what");
    }
    track("filter_used", {
      page: "services",
      filter_name: "deliverable_scope",
      filter_value: nextGroup,
    });
  }

  function selectGroup(index: number, focus = false) {
    const nextIndex = (index + SCOPE_GROUPS.length) % SCOPE_GROUPS.length;
    pickGroup(SCOPE_GROUPS[nextIndex]);
    if (focus) requestAnimationFrame(() => groupRefs.current[nextIndex]?.focus());
  }

  function handleGroupKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
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
        nextIndex = SCOPE_GROUPS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectGroup(nextIndex, true);
  }

  function selectDetail(index: number, focus = false) {
    const nextIndex = (index + DETAIL_MODES.length) % DETAIL_MODES.length;
    setDetailMode(DETAIL_MODES[nextIndex].id);
    if (focus) requestAnimationFrame(() => detailRefs.current[nextIndex]?.focus());
  }

  function handleDetailKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
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
        nextIndex = DETAIL_MODES.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectDetail(nextIndex, true);
  }

  return (
    <Container
      data-deliverables-explorer="drawers"
      data-deliverable-total={deliverables.length}
      className="max-w-6xl"
    >
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Deliverables</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          What you actually leave with.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
          Fourteen real deliverables across five drawers. Open a scope, choose an artifact, then inspect what it is,
          why it matters, and how it gets used without leaving the scene.
        </p>
      </Reveal>

      <div
        role="tablist"
        aria-label="Deliverable scope drawers"
        aria-orientation="horizontal"
        className="mt-8 flex snap-x gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible"
      >
        {SCOPE_GROUPS.map((scope, index) => {
          const selected = group === scope;
          const count = groupCount(scope);
          return (
            <button
              key={scope}
              ref={(node) => {
                groupRefs.current[index] = node;
              }}
              id={`deliverable-group-tab-${scope.toLowerCase()}`}
              type="button"
              role="tab"
              aria-label={`${scope} drawer, ${count} deliverables`}
              aria-selected={selected}
              aria-controls="deliverable-drawer-panel"
              data-deliverable-count={count}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectGroup(index)}
              onKeyDown={(event) => handleGroupKey(event, index)}
              className={`relative min-h-20 min-w-[9.5rem] snap-start overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone lg:min-w-0 ${
                selected
                  ? "border-sandstone/60 bg-sandstone/10 text-ivory"
                  : "border-ivory/14 bg-ivory/[0.025] text-ivory/65 hover:border-ivory/35 hover:text-ivory"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="active-deliverable-drawer"
                  aria-hidden="true"
                  className="absolute inset-x-3 top-0 h-px bg-sandstone"
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                />
              )}
              <span aria-hidden="true" className="block font-display text-xs text-sandstone/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block font-display text-lg font-normal leading-tight">{scope}</span>
              <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.14em] text-ivory/45">
                {count} {count === 1 ? "artifact" : "artifacts"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={group}
            id="deliverable-drawer-panel"
            role="tabpanel"
            aria-labelledby={`deliverable-group-tab-${group.toLowerCase()}`}
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, x: 9 }}
            transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationFast, ease: motionTokens.easeOrganic }}
            className="rounded-3xl border border-ivory/12 bg-[rgba(8,13,12,0.3)] p-4 backdrop-blur-md sm:p-5"
          >
            <div className="flex items-end justify-between gap-4 border-b border-ivory/10 pb-4">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ivory/45">
                  Drawer {String(activeGroupIndex + 1).padStart(2, "0")} / {String(SCOPE_GROUPS.length).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-2xl font-normal text-ivory">{group}</h3>
              </div>
              <p className="text-xs text-ivory/45">{visible.length} of {deliverables.length}</p>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-2.5" aria-label={`${group} deliverables`}>
              {visible.map((deliverable, index) => {
                const selected = deliverable.id === activeId;
                return (
                  <motion.li
                    key={deliverable.id}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: motionTokens.durationFast, delay: prefersReducedMotion ? 0 : index * 0.045 }}
                  >
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => pick(deliverable.id)}
                      className={`relative flex min-h-32 w-full flex-col justify-between overflow-hidden rounded-2xl border p-3.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:min-h-36 sm:p-4 ${
                        selected
                          ? "border-sandstone/65 bg-ivory/[0.075] text-ivory"
                          : "border-ivory/13 bg-ivory/[0.025] text-ivory/72 hover:border-ivory/30 hover:bg-ivory/[0.045] hover:text-ivory"
                      }`}
                    >
                      <span aria-hidden="true" className="font-display text-xs text-sandstone/65">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-5 font-display text-[0.92rem] font-normal leading-snug sm:text-base">
                        {deliverable.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-3 h-px w-full origin-left transition-transform duration-500 ${
                          selected ? "scale-x-100 bg-sandstone/70" : "scale-x-0 bg-ivory/25"
                        }`}
                      />
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div data-deliverable-detail="true" aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: motionTokens.durationFast, ease: motionTokens.easeOrganic }}
              className="rounded-3xl border border-ivory/15 p-5 backdrop-blur-md sm:p-7"
              style={{ backgroundColor: "rgba(244,239,230,0.05)", perspective: 900 }}
            >
              <motion.div
                initial={prefersReducedMotion ? undefined : { rotateX: -14, opacity: 0, y: 6 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                style={{ transformOrigin: "top center" }}
              >
                <ArtifactPreview deliverable={active} />
              </motion.div>

              <div
                role="tablist"
                aria-label="Deliverable explanation"
                aria-orientation="horizontal"
                className="mt-5 grid grid-cols-3 gap-1.5 rounded-2xl border border-ivory/10 bg-[rgba(7,11,10,0.25)] p-1.5"
              >
                {DETAIL_MODES.map((mode, index) => {
                  const selected = detailMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      ref={(node) => {
                        detailRefs.current[index] = node;
                      }}
                      id={`deliverable-detail-tab-${mode.id}`}
                      type="button"
                      role="tab"
                      aria-label={mode.label}
                      aria-selected={selected}
                      aria-controls="deliverable-explanation-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectDetail(index)}
                      onKeyDown={(event) => handleDetailKey(event, index)}
                      className={`relative min-h-11 rounded-xl px-2 py-2 text-center text-[0.58rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:text-[0.64rem] ${
                        selected ? "bg-sandstone/12 text-ivory" : "text-ivory/48 hover:text-ivory"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="active-deliverable-explanation"
                          aria-hidden="true"
                          className="absolute inset-x-3 bottom-0 h-px bg-sandstone"
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                        />
                      )}
                      <span className="relative">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative min-h-28">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={detailMode}
                    id="deliverable-explanation-panel"
                    role="tabpanel"
                    aria-labelledby={`deliverable-detail-tab-${detailMode}`}
                    tabIndex={0}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: prefersReducedMotion ? 0 : motionTokens.durationFast, ease: motionTokens.easeOrganic }}
                    className="pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
                  >
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/48">
                      {DETAIL_MODES.find((mode) => mode.id === detailMode)?.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/90 sm:text-base">{detailText}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ivory/12 pt-4">
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/55">
                  Included in
                </span>
                {active.packages.map((slug) => {
                  const pkg = packages.find((entry) => entry.slug === slug);
                  return pkg ? (
                    <span
                      key={slug}
                      className="rounded-full border px-2.5 py-1 text-xs text-ivory/90"
                      style={{ borderColor: `${pkg.color}88`, backgroundColor: `${pkg.color}22` }}
                    >
                      {pkg.name}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="mt-5">
                <LinkButton href="#desire" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                  See the packages
                </LinkButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
