"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "guide" | "visitor"; text: string };

const STARTERS = [
  "Clarify my positioning",
  "Make the website feel premium",
  "Find the right package",
] as const;

function answerFor(input: string) {
  const value = input.toLowerCase();

  if (value.includes("position") || value.includes("different") || value.includes("clar")) {
    return "Start with the decision only your brand can own: who it is for, what tension it resolves, and why your way is meaningfully different. The Foundation path is the cleanest place to begin.";
  }
  if (value.includes("premium") || value.includes("website") || value.includes("design")) {
    return "Premium is usually felt through restraint, hierarchy, and proof—not decoration. First define the perception you want to create, then make every page, phrase, and interaction reinforce it.";
  }
  if (value.includes("package") || value.includes("service") || value.includes("price") || value.includes("cost")) {
    return "If the business is unclear, begin with Foundation. If the strategy is sound but the expression feels dated, choose Reposition. If the system exists but delivery is fragmented, choose Consistency.";
  }
  if (value.includes("hello") || value.includes("hi ") || value === "hi") {
    return "Hello. Tell me what feels hardest to explain about the business right now, and I’ll point you toward the most useful next step.";
  }
  return "The useful first move is to name the gap between what the business has become and what people currently perceive. Share that gap in one sentence, and use it as the brief for the next brand decision.";
}

export function AskTatva() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "guide", text: "What should people understand about you first?" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [open]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: "visitor", text: clean },
      { role: "guide", text: answerFor(clean) },
    ]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <aside className={`ask-tatva${open ? " is-open" : ""}`} aria-label="Ask Tatva strategy guide">
      <button
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
        aria-hidden={!open}
        inert={!open}
      >
        <header>
          <div>
            <span>Private strategy guide</span>
            <strong>Ask Tatva</strong>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close Ask Tatva">
            <X size={17} />
          </button>
        </header>

        <div className="ask-tatva__conversation" aria-live="polite">
          {messages.slice(-4).map((message, index) => (
            <p key={`${message.role}-${index}`} data-role={message.role}>
              {message.text}
            </p>
          ))}
        </div>

        <div className="ask-tatva__starters" aria-label="Suggested questions">
          {STARTERS.map((starter) => (
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
          <span>Nothing is sent or stored.</span>
          <Link href="/contact">
            Speak with Suman <ArrowUpRight size={13} />
          </Link>
        </footer>
      </section>
    </aside>
  );
}
