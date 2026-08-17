"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Action = { href: string; label: string };
type Message = { role: "guide" | "visitor"; text: string; action?: Action };
type Reply = { text: string; action?: Action; prompts: readonly string[] };

const STARTERS = [
  "People misunderstand us",
  "The business has changed",
  "The website feels generic",
] as const;

const PROMPTS = {
  foundation: ["Who should the brand choose?", "What can the brand own?"],
  perception: ["What should the site signal?", "Where does trust break?"],
  pathway: ["Which path fits the business?", "What should happen first?"],
  system: ["Where does the brand fragment?", "What should stay consistent?"],
} as const;

function includesAny(value: string, terms: readonly string[]) {
  return terms.some((term) => value.includes(term));
}

function answerFor(input: string): Reply {
  const value = input.toLowerCase();

  if (
    includesAny(value, [
      "position",
      "different",
      "clar",
      "misunderstand",
      "audience",
      "choose",
      "own",
    ])
  ) {
    return {
      text: "The brand needs one defensible position: the audience it chooses, the tension it resolves, and the expectation it can repeat. Begin with Foundation, then let identity and language carry that decision.",
      action: { href: "#foundation", label: "Explore Foundation" },
      prompts: PROMPTS.foundation,
    };
  }

  if (
    includesAny(value, [
      "website",
      "design",
      "generic",
      "trust",
      "signal",
      "perception",
    ])
  ) {
    return {
      text: "A generic website usually reflects an unresolved perception brief. Name the three qualities a visitor should feel within ten seconds, then remove every visual and verbal cue that teaches something else.",
      action: { href: "#studio", label: "Enter the Studio" },
      prompts: PROMPTS.perception,
    };
  }

  if (
    includesAny(value, [
      "package",
      "service",
      "price",
      "cost",
      "path",
      "changed",
      "outgrown",
      "rebrand",
      "dated",
      "first",
    ])
  ) {
    return {
      text: "Choose by the source of friction. Foundation fits unclear positioning, Reposition fits a business that has changed, and Consistency fits a sound strategy expressed unevenly.",
      action: { href: "/services", label: "Compare the paths" },
      prompts: PROMPTS.pathway,
    };
  }

  if (
    includesAny(value, [
      "fragment",
      "inconsistent",
      "scattered",
      "messy",
      "cohesive",
    ])
  ) {
    return {
      text: "Fragmentation means the brand is teaching several expectations at once. Define one positioning idea, then align identity, language, website, and behaviour around it.",
      action: { href: "#tatva", label: "See the whole system" },
      prompts: PROMPTS.system,
    };
  }

  if (includesAny(value, ["name", "naming", "rename"])) {
    return {
      text: "A name earns value through the meaning the whole system teaches around it. Judge it for memorability, category signal, verbal range, and the behaviours it can support.",
      action: { href: "#process", label: "View the method" },
      prompts: PROMPTS.foundation,
    };
  }

  if (includesAny(value, ["launch", "new business", "starting", "startup"])) {
    return {
      text: "At launch, speed comes from sequence: position first, identity second, expression third. A clear foundation prevents every later asset from becoming a separate debate.",
      action: { href: "#foundation", label: "Start with Foundation" },
      prompts: PROMPTS.pathway,
    };
  }

  if (value.includes("hello") || value.includes("hi ") || value === "hi") {
    return {
      text: "Hello. Name the part of the business people understand least clearly, and I will trace the most useful next move.",
      prompts: STARTERS,
    };
  }

  return {
    text: "The sharpest clue is the gap between the business today and the expectation people still carry. Which part feels furthest behind: the position, identity, language, or website?",
    action: { href: "#decision", label: "Find the real decision" },
    prompts: STARTERS,
  };
}

export function AskTatva() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "guide", text: "Which gap feels closest to the business today?" },
  ]);
  const [prompts, setPrompts] = useState<readonly string[]>(STARTERS);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeGuide = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      closeGuide();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeGuide, open]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const reply = answerFor(clean);
    setMessages((current) => [
      ...current,
      { role: "visitor", text: clean },
      { role: "guide", text: reply.text, action: reply.action },
    ]);
    setPrompts(reply.prompts);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <aside className={`ask-tatva${open ? " is-open" : ""}`} aria-label="Ask Tatva strategy guide">
      <button
        ref={triggerRef}
        type="button"
        className="ask-tatva__trigger"
        aria-expanded={open}
        aria-controls="ask-tatva-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle size={17} aria-hidden="true" />
        <span>Ask Tatva</span>
        <i aria-hidden="true" />
      </button>

      <section
        id="ask-tatva-panel"
        className="ask-tatva__panel"
        role="dialog"
        aria-label="Ask Tatva private strategy guide"
        aria-hidden={!open}
        inert={!open}
      >
        <header>
          <div>
            <span>Private strategy guide</span>
            <strong>Ask Tatva</strong>
          </div>
          <button type="button" onClick={closeGuide} aria-label="Close Ask Tatva">
            <X size={17} />
          </button>
        </header>

        <div className="ask-tatva__conversation" aria-live="polite">
          {messages.slice(-6).map((message, index) => (
            <div
              className="ask-tatva__message"
              key={`${message.role}-${index}`}
              data-role={message.role}
            >
              <p>{message.text}</p>
              {message.action ? (
                <Link href={message.action.href} onClick={() => setOpen(false)}>
                  {message.action.label} <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>

        <div className="ask-tatva__starters" aria-label="Suggested questions">
          {prompts.map((starter) => (
            <button type="button" key={starter} onClick={() => ask(starter)}>
              {starter}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <label htmlFor="ask-tatva-input">Ask about your brand</label>
          <div>
            <input
              ref={inputRef}
              id="ask-tatva-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Describe the gap you are feeling…"
              autoComplete="off"
            />
            <button type="submit" aria-label="Send question" disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </form>

        <footer>
          <span>Private to this browser session.</span>
          <Link href="/contact">
            Speak with Suman <ArrowUpRight size={13} />
          </Link>
        </footer>
      </section>
    </aside>
  );
}
