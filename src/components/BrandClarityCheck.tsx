"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { site } from "@/data/site";

// The Brand Clarity Check: a nine question self diagnosis that scores a
// visitor's own brand across position, distinctiveness and presence, then
// reads back the lowest scoring section. The result stays ungated so the
// page is worth linking to from anywhere; the enquiry step underneath it is
// optional and reuses /api/contact, which means no new delivery surface and
// no new environment variables.
//
// Every question and its point values are rendered as text rather than held
// in script alone, so the page reads as a real document to search engines
// and answer engines, and so a reader can audit the scoring.

type SectionId = "position" | "distinctiveness" | "presence";

type Question = {
  id: string;
  prompt: string;
  helper?: string;
  choices: readonly [string, string, string]; // index 0 scores 2, then 1, then 0
};

type Section = {
  id: SectionId;
  ordinal: string;
  name: string;
  standfirst: string;
  questions: readonly Question[];
};

const SECTIONS: readonly Section[] = [
  {
    id: "position",
    ordinal: "One",
    name: "Position",
    standfirst:
      "Positioning answers one question inside a buyer's head: why this one, ahead of the obvious alternative. Everything visible in a brand exists to express it, so a business vague here stays vague everywhere.",
    questions: [
      {
        id: "sentence",
        prompt:
          "Write, in one sentence, who your business is for and why they choose it over the obvious alternative.",
        helper: "Write it before reading the answers.",
        choices: [
          "It came quickly, it names a specific buyer, and it names what I am chosen over.",
          "I wrote something, though it could describe several competitors too.",
          "I paused, hedged, or listed services instead of a reason.",
        ],
      },
      {
        id: "homepage",
        prompt:
          "Cover your logo and read your homepage's first line. Could your closest competitor run it word for word?",
        choices: [
          "The line is clearly mine and would sit oddly on a rival's site.",
          "Mostly generic, with a distinctive phrase or two.",
          "A competitor could paste it unchanged and nobody would notice.",
        ],
      },
      {
        id: "refusal",
        prompt:
          "Name who your business is happy to lose. Who does it deliberately turn away?",
        choices: [
          "I can name them without flinching.",
          "I can, though saying it out loud makes me uneasy.",
          "My honest answer is anyone who will pay.",
        ],
      },
    ],
  },
  {
    id: "distinctiveness",
    ordinal: "Two",
    name: "Distinctiveness",
    standfirst:
      "A position compounds only if people recognise the business carrying it. Distinctiveness is the set of cues, a colour, a voice, a recurring style, that let a buyer identify you before they read a word.",
    questions: [
      {
        id: "cue",
        prompt:
          "Beyond your logo, name one cue a buyer would recognise as yours: a colour you own, a typographic style, a recurring format.",
        choices: [
          "I named one and I use it consistently everywhere.",
          "I named one, though I apply it loosely.",
          "The logo is the only thing that identifies me.",
        ],
      },
      {
        id: "coherence",
        prompt:
          "Open your website, your most used social profile and your last proposal side by side. Do they read as one company?",
        choices: [
          "A stranger would see one business across all three.",
          "They are related, though clearly made at different times.",
          "They look and sound like three different companies.",
        ],
      },
      {
        id: "message",
        prompt:
          "How often does your core message change: the one thing you most want remembered?",
        choices: [
          "It has held steady for a year or more.",
          "It shifts every few months.",
          "It changes with each campaign, or I would struggle to say what it is.",
        ],
      },
    ],
  },
  {
    id: "presence",
    ordinal: "Three",
    name: "Presence",
    standfirst:
      "Recognition is built by being met more than once. A business seen only at the moment of buying pays full price for every sale, because memory never had a chance to form.",
    questions: [
      {
        id: "between",
        prompt:
          "Between the moments a buyer needs you, are you present anywhere they would meet you?",
        choices: [
          "I show up consistently somewhere my buyers already are.",
          "I appear occasionally, in bursts.",
          "I am visible only while actively selling.",
        ],
      },
      {
        id: "pause",
        prompt:
          "If you paused all paid promotion for a month, would anyone still arrive already knowing you?",
        choices: [
          "Yes, a steady trickle would.",
          "A few might.",
          "Demand would go quiet almost immediately.",
        ],
      },
      {
        id: "words",
        prompt:
          "When a past buyer describes you to someone else, do they use your words or their own guess?",
        choices: [
          "I have heard my own phrases come back to me.",
          "They describe me roughly right, in their own words.",
          "I have no idea how they describe me, or they get it wrong.",
        ],
      },
    ],
  },
];

const READINGS: Record<SectionId, { title: string; body: string }> = {
  position: {
    title: "Your gap is strategy rather than design.",
    body: "This is the cheapest gap to close and the most expensive to leave alone. A new logo changes little while the reason to choose you stays vague, because the design has nothing clear to express. Fix the one sentence, who you are for and what you are chosen over, and most of the visual questions answer themselves. Spend here first, whatever the rest of the score says.",
  },
  distinctiveness: {
    title: "Your position may be sound, and people struggle to recognise the business carrying it.",
    body: "The fix is rarely more design and almost always more discipline. Choose a small set of cues you can own, a colour, a voice, a format, and apply them identically everywhere for far longer than feels interesting. Recognition is repetition, and repetition costs effort rather than money.",
  },
  presence: {
    title: "Your brand may be clear and recognisable, and simply absent between purchases.",
    body: "Memory never forms when a business appears only at the moment of sale. The answer is a steady presence somewhere your buyers already are, held long enough to be remembered. This is the slowest of the three to pay off and the one that lowers the cost of every future sale once it does.",
  },
};

const STRONG_READING = {
  title: "You have a genuinely clear brand.",
  body: "Your remaining gains sit in consistency and patience rather than any large project. Protect what you have built and resist the urge to reinvent a message your buyers are only beginning to remember.",
};

const SECTION_LABEL: Record<SectionId, string> = {
  position: "position",
  distinctiveness: "distinctiveness",
  presence: "presence",
};

type Answers = Record<string, number>;

function scoreFor(section: Section, answers: Answers) {
  return section.questions.reduce(
    (total, question) => total + (answers[question.id] ?? 0),
    0,
  );
}

export function BrandClarityCheck() {
  const [answers, setAnswers] = useState<Answers>({});
  const [revealed, setRevealed] = useState(false);
  const startedRef = useRef(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const totalQuestions = SECTIONS.reduce(
    (count, section) => count + section.questions.length,
    0,
  );
  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === totalQuestions;

  const scores = useMemo(() => {
    const bySection = SECTIONS.map((section) => ({
      id: section.id,
      name: section.name,
      score: scoreFor(section, answers),
    }));
    const total = bySection.reduce((sum, entry) => sum + entry.score, 0);
    const lowest = bySection.reduce((worst, entry) =>
      entry.score < worst.score ? entry : worst,
    );
    return { bySection, total, lowest };
  }, [answers]);

  function choose(questionId: string, value: number) {
    if (!startedRef.current) {
      startedRef.current = true;
      track("health_check_started", { source: "brand_clarity_check" });
    }
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function reveal() {
    setRevealed(true);
    track("health_check_completed", {
      source: "brand_clarity_check",
      total: scores.total,
      lowest_section: scores.lowest.id,
    });
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const reading =
    scores.total >= 14 ? STRONG_READING : READINGS[scores.lowest.id as SectionId];

  const summary = [
    "Brand Clarity Check result.",
    ...scores.bySection.map((entry) => `${entry.name}: ${entry.score} of 6.`),
    `Total: ${scores.total} of 18.`,
    `Lowest section: ${SECTION_LABEL[scores.lowest.id as SectionId]}.`,
  ].join(" ");

  return (
    <div className="mt-14">
      {SECTIONS.map((section) => (
        <section key={section.id} className="mt-14 first:mt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            Section {section.ordinal} · {section.name}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-foreground-secondary">
            {section.standfirst}
          </p>

          {section.questions.map((question, index) => {
            const selected = answers[question.id];
            return (
              <fieldset
                key={question.id}
                className="mt-8 rounded-[1.5rem] border border-border bg-background-elevated p-6 sm:p-8"
              >
                <legend className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-clay-ink">
                  Question {index + 1}
                </legend>
                <p className="font-display text-2xl font-normal leading-snug text-soil sm:text-[1.7rem]">
                  {question.prompt}
                </p>
                {question.helper && (
                  <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                    {question.helper}
                  </p>
                )}
                <div className="mt-6 grid gap-3">
                  {question.choices.map((choice, choiceIndex) => {
                    const value = 2 - choiceIndex;
                    const active = selected === value;
                    return (
                      <label
                        key={choice}
                        className={[
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-sm leading-6 transition-colors",
                          active
                            ? "border-clay bg-clay/10 text-soil"
                            : "border-border text-foreground-secondary hover:border-clay/50",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={value}
                          checked={active}
                          onChange={() => choose(question.id, value)}
                          className="mt-1 h-4 w-4 accent-clay"
                        />
                        <span className="flex-1">{choice}</span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-clay-ink/70"
                        >
                          {value}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-clay-ink">
            {section.name} score: {scoreFor(section, answers)} of 6
          </p>
        </section>
      ))}

      <div className="mt-14 rounded-[1.75rem] bg-soil p-7 text-ivory sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
          Your reading
        </p>
        <h2 className="mt-4 font-display text-3xl font-normal sm:text-4xl">
          Read the lowest section rather than the total.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/75">
          The lowest scoring section is where your next pound belongs. Answer
          all nine questions to see which one it is.
        </p>

        {revealed ? null : (
          <button
            type="button"
            onClick={reveal}
            disabled={!complete}
            className="mt-7 rounded-full bg-sandstone px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-soil transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
          >
            {complete
              ? "Read my result"
              : `${answeredCount} of ${totalQuestions} answered`}
          </button>
        )}
      </div>

      {revealed && (
        <div
          ref={resultRef}
          className="mt-10 scroll-mt-28 rounded-[1.75rem] border border-border bg-background-elevated p-7 sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            Total {scores.total} of 18
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {scores.bySection.map((entry) => (
              <div
                key={entry.id}
                className={[
                  "rounded-2xl border p-4",
                  entry.id === scores.lowest.id && scores.total < 14
                    ? "border-clay bg-clay/10"
                    : "border-border",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
                  {entry.name}
                </p>
                <p className="mt-2 font-display text-3xl text-soil">
                  {entry.score}
                  <span className="text-base text-foreground-secondary"> of 6</span>
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 max-w-3xl font-display text-2xl font-normal leading-snug text-soil sm:text-3xl">
            {reading.title}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-foreground-secondary">
            {reading.body}
          </p>

          <ResultEnquiry summary={summary} lowest={scores.lowest.id as SectionId} />
        </div>
      )}
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

function ResultEnquiry({
  summary,
  lowest,
}: {
  summary: string;
  lowest: SectionId;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const submissionRef = useRef<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);

    if (!submissionRef.current) submissionRef.current = crypto.randomUUID();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      business: business.trim() || undefined,
      description: `${summary} Sent from the Brand Clarity Check page, asking what to do about the ${SECTION_LABEL[lowest]} gap.`,
      referral: "brand-clarity-check",
      company_website: honeypot,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Contact-Submission": submissionRef.current,
        },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json().catch(() => null);
      const delivered =
        res.ok &&
        data !== null &&
        typeof data === "object" &&
        "ok" in data &&
        data.ok === true;

      if (delivered) {
        track("lead_magnet_requested", {
          source: "brand_clarity_check",
          lowest_section: lowest,
        });
        setStatus("success");
        return;
      }

      setError(
        data && typeof data === "object" && "error" in data && typeof data.error === "string"
          ? data.error
          : `The server returned no confirmation. Write to ${site.email} instead.`,
      );
      setStatus("error");
    } catch {
      setError(`Something failed on the way out. Write to ${site.email} instead.`);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-10 rounded-[1.5rem] border border-clay bg-clay/10 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-ink">
          Sent
        </p>
        <h4 className="mt-3 font-display text-2xl font-normal text-soil">
          Your result is with Suman.
        </h4>
        <p className="mt-3 text-sm leading-7 text-foreground-secondary">
          She reads these herself and replies with where she would start. If you
          would rather talk it through first, the calendar below stays open.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={site.calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-soil px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition-opacity hover:opacity-90"
          >
            Book the thirty minute diagnosis
          </a>
          <Link
            href="/insights"
            className="rounded-full border border-soil/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-soil transition-colors hover:border-soil/60"
          >
            Read the guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h4 className="font-display text-2xl font-normal text-soil">
        The one honest next step
      </h4>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-secondary">
        If this surfaced a gap you already half suspected, that is the point of
        it. Send the result through and Suman will reply with where she would
        start, with no obligation to work together.
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
            Your name
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-soil outline-none focus:border-clay"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-soil outline-none focus:border-clay"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
            Business or website
          </span>
          <input
            type="text"
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-soil outline-none focus:border-clay"
          />
        </label>

        <label className="hidden" aria-hidden="true">
          Company website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-soil px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending" : "Send my result to Suman"}
          </button>
          <a
            href={site.calendlyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("calendar_opened", { source: "brand_clarity_check" })}
            className="text-xs font-semibold uppercase tracking-[0.15em] text-clay-ink underline underline-offset-4"
          >
            Or book the thirty minute diagnosis
          </a>
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm leading-6 text-rose-earth">{error}</p>
        )}
      </form>
    </div>
  );
}
