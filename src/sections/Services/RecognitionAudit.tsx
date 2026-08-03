"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";

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

type Status = "idle" | "submitting" | "done" | "error";

export function RecognitionAudit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [consent, setConsent] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const unlocked = status === "done";

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
    } catch {
      setError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  const shown = unlocked ? CHECKS : CHECKS.slice(0, VISIBLE);

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-20">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The Brand Recognition Audit</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
            Ten checks that tell you where recognition stands today.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
            Count how many hold true for your brand right now. The first five are open to anyone; the full ten arrive
            with your name on them.
          </p>
          <ol className="mt-8">
            {shown.map((check, i) => (
              <motion.li
                key={check}
                initial={prefersReducedMotion || i < VISIBLE ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : (i - VISIBLE) * 0.08 }}
                className="flex items-start gap-4 border-t border-ivory/12 py-4"
              >
                <span className="pt-0.5 font-display text-lg leading-none text-sandstone" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-ivory/90">{check}</p>
              </motion.li>
            ))}
          </ol>
          {!unlocked && (
            <p className="border-t border-ivory/12 pt-4 text-sm text-ivory/60">
              Checks six through ten unlock with the form beside this list.
            </p>
          )}
          {unlocked && (
            <p className="border-t border-ivory/12 pt-4 text-sm text-ivory/75">
              Fewer than seven holding true usually means recognition is leaking somewhere specific. The health check
              above narrows down where.
            </p>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
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
                  All ten checks are now visible beside this panel. A confirmation email is on its way to {email}, and
                  future insights follow only after you confirm.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                className="rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-7"
                style={{ backgroundColor: "rgba(244,239,230,0.05)" }}
              >
                <p className="font-display text-lg font-normal text-ivory">Unlock the full ten</p>
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
                  className="mt-6 w-full rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-transform duration-300 hover:translate-y-[-2px] disabled:opacity-60"
                >
                  {status === "submitting" ? "Opening the audit…" : "Open the full audit"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
