"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";

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
  "One sentence says what the brand stands for, and everyone involved repeats the same one.",
  "The category you compete in was named deliberately, well before any tagline.",
  "A stranger could pick your brand out of a lineup with the logo covered.",
  "Colors, type, and voice repeat exactly across every channel.",
  "Buyers mention the brand unprompted when they describe the category.",
  "Your pricing signals the position you claim.",
  "Every piece of content reads like the same person wrote it.",
  "You could list your three most distinctive assets from memory.",
  "The last five things you published served one recognizable position.",
  "Someone who saw the brand six months ago would recognize it today.",
] as const;

const VISIBLE = 5;
const MOBILE_CHAPTERS = [
  { id: "checks", label: "Five open checks" },
  { id: "unlock", label: "Unlock all ten" },
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
  const [mobileChapter, setMobileChapter] = useState<MobileChapter>("checks");
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const unlocked = status === "done";

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
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      track("lead_magnet_requested");
      setStatus("done");
      // The reward is the content, not a thank-you cul-de-sac. On a
      // phone, return directly to the checks chapter so six through ten
      // replace the form inside the same frame.
      openMobileChapter("checks");
    } catch {
      setError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  const shown = unlocked ? CHECKS : CHECKS.slice(0, VISIBLE);

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
            id="recognition-audit-panel-checks"
            role="tabpanel"
            aria-labelledby="recognition-audit-tab-checks"
            data-audit-chapter="checks"
            className={`${mobileChapter === "checks" ? "block" : "hidden"} lg:block`}
          >
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The Brand Recognition Audit</p>
            <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
              Ten checks that tell you where recognition stands today.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
              Count how many hold true for your brand right now. The first five are open to anyone; the full ten arrive
              with your name on them.
            </p>
            <ol data-public-audit-checks="true" className="mt-7 sm:mt-8">
              {shown.map((check, i) => (
                <motion.li
                  key={check}
                  initial={prefersReducedMotion || i < VISIBLE ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : (i - VISIBLE) * 0.08 }}
                  className="flex items-start gap-4 border-t border-ivory/12 py-3.5 sm:py-4"
                >
                  <span className="pt-0.5 font-display text-lg leading-none text-sandstone" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-ivory/90 sm:text-base">{check}</p>
                </motion.li>
              ))}
            </ol>
            {!unlocked && (
              <div className="border-t border-ivory/12 pt-4">
                <p className="text-sm text-ivory/60">
                  Checks six through ten open after an explicit email consent. The first five remain useful without it.
                </p>
                <button
                  type="button"
                  onClick={() => openMobileChapter("unlock")}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-sandstone/45 px-5 py-2.5 text-sm text-sandstone transition-colors hover:border-sandstone hover:bg-sandstone/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone lg:hidden"
                >
                  Continue to unlock all ten
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            {unlocked && (
              <p className="border-t border-ivory/12 pt-4 text-sm text-ivory/75">
                Fewer than seven holding true usually means recognition is leaking somewhere specific. The health check
                above narrows down where.
              </p>
            )}
          </section>

          <section
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

            <AnimatePresence mode="wait">
              {unlocked ? (
                <motion.div
                  key="thanks"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-7"
                  style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
                >
                  <p className="font-display text-xl font-normal text-ivory">The full audit is open.</p>
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
                  className="rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-7"
                  style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
                >
                  <p className="font-display text-lg font-normal text-ivory">See all ten checks</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                    Your details deliver the full audit. The checkbox below controls future email, and confirmation is
                    still required before anything else is sent.
                  </p>
                  <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                    First name
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="mt-1.5 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                    />
                  </label>
                  <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                    Email
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-1.5 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                    />
                  </label>
                  <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                    Business name, optional
                    <input
                      type="text"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      autoComplete="organization"
                      className="mt-1.5 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                    />
                  </label>
                  <label className="mt-6 flex items-start gap-3 text-sm text-ivory/80">
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
                  {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}
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
