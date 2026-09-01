"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";
import { publishServicesRecognitionAudit, recognitionAuditGuidance } from "@/lib/servicesJourney";

// The Brand Recognition Audit — the redesign brief's one secondary
// lead asset. Ten real checks drawn from the site's own frameworks
// (positioning, distinctive assets, mental availability, verbal
// identity, consistency). The first five are readable by anyone, no
// email required — the brief's own rule: show a useful preview, never
// hide the entire result behind a form. Submitting unlocks the rest
// in place and subscribes through the existing Mailchimp double opt in
// endpoint with an explicit consent checkbox, first name, and an
// optional business name.
const CHECKS = [
  "Everyone who explains the business uses the same sentence.",
  "The category you compete in was chosen deliberately before the tagline was written.",
  "A stranger could identify your brand with the logo covered.",
  "Colour, type, image direction, and voice repeat across every channel.",
  "Buyers mention the brand without prompting when they describe the category.",
  "Your pricing signals the position you claim.",
  "Every piece of content reads like the same person wrote it.",
  "You could list your three most distinctive assets from memory.",
  "The last five things you published repeated the same position.",
  "Someone who saw the brand six months ago would recognise it today.",
] as const;

const VISIBLE = 5;
const MOBILE_CHAPTERS = [
  { id: "checks", label: "Five open checks" },
  { id: "unlock", label: "See all ten" },
] as const;

type Status = "idle" | "submitting" | "done" | "error";
type MobileChapter = (typeof MOBILE_CHAPTERS)[number]["id"];

export function RecognitionAudit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [consent, setConsent] = useState(false);
  const [markedChecks, setMarkedChecks] = useState<Set<number>>(() => new Set());
  const [mobileChapter, setMobileChapter] = useState<MobileChapter>("checks");
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const unlocked = status === "done";

  function toggleCheck(index: number) {
    const next = new Set(markedChecks);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setMarkedChecks(next);
    const total = unlocked ? CHECKS.length : VISIBLE;
    const score = Array.from({ length: total }, (_, checkIndex) => checkIndex).filter((checkIndex) =>
      next.has(checkIndex),
    ).length;
    publishServicesRecognitionAudit(score, total);
  }

  function openMobileChapter(nextChapter: MobileChapter) {
    setMobileChapter(nextChapter);
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    requestAnimationFrame(() => {
      mobileNavRef.current?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  function selectChapter(index: number, focus = false) {
    const nextIndex = (index + MOBILE_CHAPTERS.length) % MOBILE_CHAPTERS.length;
    openMobileChapter(MOBILE_CHAPTERS[nextIndex].id);
    if (focus) requestAnimationFrame(() => chapterRefs.current[nextIndex]?.focus());
  }

  function handleChapterKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
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
        nextIndex = MOBILE_CHAPTERS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectChapter(nextIndex, true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          business: business || undefined,
          consent,
          source: "recognition-audit",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "The checklist request did not reach the mailing list. Send it once more.");
        setStatus("error");
        return;
      }
      track("lead_magnet_requested");
      setStatus("done");
      const fullScore = CHECKS.reduce(
        (score, _check, checkIndex) => score + (markedChecks.has(checkIndex) ? 1 : 0),
        0,
      );
      publishServicesRecognitionAudit(fullScore, CHECKS.length);
      // The reward is the content, not a thank-you cul-de-sac. On a
      // phone, return directly to the checks chapter so six through ten
      // replace the form inside the same frame.
      openMobileChapter("checks");
    } catch {
      setError("The checklist form cannot reach the server. Check the connection, then send again.");
      setStatus("error");
    }
  }

  const shown = unlocked ? CHECKS : CHECKS.slice(0, VISIBLE);
  const markedCount = shown.filter((_, index) => markedChecks.has(index)).length;
  const scoreGuidance = recognitionAuditGuidance(markedCount, shown.length);

  return (
    <div data-recognition-audit-desk="true" data-mobile-chapter={mobileChapter}>
      <Container className="max-w-6xl">
        <div
          ref={mobileNavRef}
          role="tablist"
          aria-label="Recognition Audit chapters"
          className="scroll-mt-24 mb-7 grid grid-cols-2 gap-2 rounded-2xl border border-ivory/14 bg-[rgba(18,20,18,0.9)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"
        >
          {MOBILE_CHAPTERS.map((chapter, index) => {
            const selected = mobileChapter === chapter.id;
            const label = chapter.id === "checks" && unlocked ? "All ten checks" : chapter.label;
            return (
              <button
                key={chapter.id}
                ref={(node) => {
                  chapterRefs.current[index] = node;
                }}
                id={`recognition-audit-tab-${chapter.id}`}
                type="button"
                role="tab"
                aria-label={label}
                aria-selected={selected}
                aria-controls={`recognition-audit-panel-${chapter.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectChapter(index)}
                onKeyDown={(event) => handleChapterKey(event, index)}
                className={`relative min-h-12 overflow-hidden rounded-xl px-3 py-2.5 text-center text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                  selected ? "bg-sandstone/12 text-ivory" : "text-ivory/48 hover:text-ivory"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="active-recognition-audit-chapter"
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-0 h-px bg-sandstone"
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: motionTokens.durationFast }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-20">
          <section
            data-services-chapter-copy="true"
            id="recognition-audit-panel-checks"
            role="tabpanel"
            aria-labelledby="recognition-audit-tab-checks"
            data-audit-chapter="checks"
            className={`${mobileChapter === "checks" ? "block" : "hidden"} lg:block`}
          >
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Brand recognition check</p>
            <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
              Ten questions that expose where the brand loses recognition.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
              Mark what is true today. Answer the first five without sharing contact details. The remaining five are
              shown after you request the complete check.
            </p>
            <ol data-public-audit-checks="true" className="mt-7 sm:mt-8" aria-label="Brand recognition checks">
              {shown.map((check, i) => (
                <motion.li
                  key={check}
                  data-audit-marked={markedChecks.has(i) ? "true" : "false"}
                  initial={prefersReducedMotion || i < VISIBLE ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : (i - VISIBLE) * 0.08 }}
                  className="border-t border-ivory/12"
                >
                  <button
                    type="button"
                    aria-pressed={markedChecks.has(i)}
                    onClick={() => toggleCheck(i)}
                    className={`group flex min-h-11 w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone sm:gap-4 sm:py-3.5 ${
                      markedChecks.has(i) ? "bg-sandstone/[0.09]" : "hover:bg-ivory/[0.035]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-sm leading-none transition-colors duration-300 ${
                        markedChecks.has(i)
                          ? "border-sandstone bg-sandstone text-soil"
                          : "border-sandstone/45 text-sandstone group-hover:border-sandstone"
                      }`}
                      aria-hidden="true"
                    >
                      {markedChecks.has(i) ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 text-[0.95rem] leading-relaxed text-ivory/90 sm:text-base">{check}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            {!unlocked && (
              <div className="border-t border-ivory/12 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                  <div role="status" aria-live="polite">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-sandstone/75">
                      Your private first pass
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ivory/68">{scoreGuidance}</p>
                  </div>
                  {markedCount > 0 ? (
                    <a
                      href="#book"
                      data-recognition-audit-handoff="true"
                      onClick={() => publishServicesRecognitionAudit(markedCount, shown.length)}
                      className="group inline-flex min-h-11 shrink-0 items-center justify-between gap-4 rounded-full border border-sandstone/38 bg-sandstone/[0.06] px-4 py-2 text-left transition-colors hover:border-sandstone hover:bg-sandstone/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      aria-label={`Bring your ${markedCount} of ${shown.length} recognition score to the Strategy Room`}
                    >
                      <span className="font-display text-2xl text-ivory">
                        {markedCount}
                        <span className="text-base text-ivory/45"> / {shown.length}</span>
                      </span>
                      <span className="text-[0.62rem] font-medium uppercase leading-[1.35] tracking-[0.12em] text-sandstone">
                        Bring to the
                        <br />
                        Strategy Room <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  ) : (
                    <p
                      className="shrink-0 font-display text-2xl text-ivory"
                      aria-label={`${markedCount} of ${shown.length} checks marked`}
                    >
                      {markedCount}
                      <span className="text-base text-ivory/45"> / {shown.length}</span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openMobileChapter("unlock")}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-sandstone/45 px-5 py-2.5 text-sm text-sandstone transition-colors hover:border-sandstone hover:bg-sandstone/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone lg:hidden"
                >
                  Continue to the full check
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            {unlocked && (
              <div
                className="flex items-end justify-between gap-5 border-t border-ivory/12 pt-4"
                role="status"
                aria-live="polite"
              >
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-sandstone/75">
                    Your full audit
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/68">{scoreGuidance}</p>
                </div>
                <a
                  href="#book"
                  data-recognition-audit-handoff="true"
                  onClick={() => publishServicesRecognitionAudit(markedCount, shown.length)}
                  className="group inline-flex min-h-11 shrink-0 items-center justify-between gap-4 rounded-full border border-sandstone/38 bg-sandstone/[0.06] px-4 py-2 text-left transition-colors hover:border-sandstone hover:bg-sandstone/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  aria-label={`Bring your ${markedCount} of ${shown.length} recognition score to the Strategy Room`}
                >
                  <span className="font-display text-2xl text-ivory">
                    {markedCount}
                    <span className="text-base text-ivory/45"> / {shown.length}</span>
                  </span>
                  <span className="text-[0.62rem] font-medium uppercase leading-[1.35] tracking-[0.12em] text-sandstone">
                    Bring to the
                    <br />
                    Strategy Room <span aria-hidden="true">→</span>
                  </span>
                </a>
              </div>
            )}
          </section>

          <section
            data-services-chapter-instrument="true"
            id="recognition-audit-panel-unlock"
            role="tabpanel"
            aria-labelledby="recognition-audit-tab-unlock"
            data-audit-chapter="unlock"
            className={`${mobileChapter === "unlock" ? "block" : "hidden"} lg:block lg:sticky lg:top-28 lg:self-start`}
          >
            <button
              type="button"
              onClick={() => openMobileChapter("checks")}
              className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm text-ivory/65 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone lg:hidden"
            >
              <span aria-hidden="true">←</span>
              Back to the five open checks
            </button>

            <div
              data-recognition-audit-meter="true"
              style={{ "--audit-progress": `${(markedCount / shown.length) * 100}%` } as CSSProperties}
              role="status"
              aria-live="polite"
              aria-label={`${markedCount} of ${shown.length} recognition checks currently hold`}
            >
              <span data-recognition-audit-dial="true" aria-hidden="true">
                <span>{markedCount}</span>
                <small>of {shown.length}</small>
              </span>
              <span data-recognition-audit-reading="true">
                <small>Recognition signal</small>
                <strong>{scoreGuidance}</strong>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {unlocked ? (
                <motion.div
                  key="thanks"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-ivory/20 p-6 shadow-[0_28px_90px_rgba(5,10,8,0.3)] backdrop-blur-xl sm:p-7"
                  style={{ backgroundColor: "rgba(18,26,22,0.84)" }}
                >
                  <p className="font-display text-xl font-normal text-ivory">All ten questions are ready.</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                    All ten checks are visible in the first chapter. A confirmation email is on its way to {email}, and
                    future insights follow only after you confirm.
                  </p>
                  <button
                    type="button"
                    onClick={() => openMobileChapter("checks")}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-sandstone/45 px-5 py-2.5 text-sm text-sandstone transition-colors hover:bg-sandstone/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone lg:hidden"
                  >
                    View all ten checks
                    <span aria-hidden="true">→</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  data-recognition-audit-form="true"
                  onSubmit={submit}
                  className="rounded-2xl border border-ivory/20 p-6 shadow-[0_28px_90px_rgba(5,10,8,0.3)] backdrop-blur-xl sm:p-7"
                  style={{ backgroundColor: "rgba(18,26,22,0.84)" }}
                >
                  <p className="font-display text-lg font-normal text-ivory">Continue with all ten questions</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/82">
                    Enter your details to see the remaining questions. Email notes are sent only after you tick the box
                    and confirm your address.
                  </p>
                  <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/78">
                    First name
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="mt-2 min-h-11 w-full rounded-xl border border-ivory/30 bg-black/15 px-3 py-2 text-base normal-case tracking-normal text-ivory outline-none transition-[border-color,background-color,box-shadow] focus:border-sandstone focus:bg-black/25 focus:shadow-[0_0_0_3px_rgba(212,185,154,0.12)]"
                    />
                  </label>
                  <label className="mt-4 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/78">
                    Email
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-2 min-h-11 w-full rounded-xl border border-ivory/30 bg-black/15 px-3 py-2 text-base normal-case tracking-normal text-ivory outline-none transition-[border-color,background-color,box-shadow] focus:border-sandstone focus:bg-black/25 focus:shadow-[0_0_0_3px_rgba(212,185,154,0.12)]"
                    />
                  </label>
                  <label className="mt-4 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/78">
                    Business name, optional
                    <input
                      type="text"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      autoComplete="organization"
                      className="mt-2 min-h-11 w-full rounded-xl border border-ivory/30 bg-black/15 px-3 py-2 text-base normal-case tracking-normal text-ivory outline-none transition-[border-color,background-color,box-shadow] focus:border-sandstone focus:bg-black/25 focus:shadow-[0_0_0_3px_rgba(212,185,154,0.12)]"
                    />
                  </label>
                  <label className="mt-5 flex items-start gap-3 text-sm text-ivory/88">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[#D4B99A]"
                    />
                    <span>
                      I agree to receive the audit and occasional branding insights by email. Unsubscribing takes one
                      click, any time.
                    </span>
                  </label>
                  {error && (
                    <p className="mt-4 text-sm text-terracotta" role="status" aria-live="polite">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-6 min-h-11 w-full rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-transform duration-300 hover:translate-y-[-2px] disabled:opacity-60"
                  >
                    {status === "submitting" ? "Opening the audit…" : "Open the full audit"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </section>
        </div>
      </Container>
    </div>
  );
}
