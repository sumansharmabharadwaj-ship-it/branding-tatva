import Link from "next/link";

// The secondary lead asset's sitewide pointer (bible §11: lead magnet
// placement on Home after the five decisions, About after the
// interdisciplinary section, Insights inside pillar articles). One
// compact, consistent block linking to the real Brand Recognition
// Audit on Services — the audit itself stays in one place; these are
// signposts, never duplicate forms. Server component, zero JS.
export function AuditInvite({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 ${
        dark ? "border-ivory/15" : "border-soil/15"
      }`}
      style={{ backgroundColor: dark ? "rgba(244,239,230,0.04)" : "rgba(39,34,30,0.04)" }}
    >
      <p className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? "text-sandstone" : "text-clay"}`}>
        Take something useful
      </p>
      <p className={`mt-2 font-display text-xl font-normal sm:text-2xl ${dark ? "text-ivory" : "text-soil"}`}>
        The Brand Recognition Audit
      </p>
      <p className={`mt-2 max-w-xl text-sm leading-relaxed ${dark ? "text-ivory/75" : "text-foreground-secondary"}`}>
        A short diagnostic covering positioning clarity, distinctive assets, verbal identity, and recognition
        consistency. Five checks open to anyone right away; the full ten arrive by email with explicit consent.
      </p>
      <Link
        href="/services#audit"
        className={`mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors ${
          dark
            ? "text-sandstone decoration-sandstone/40 hover:text-ivory"
            : "text-clay decoration-clay/40 hover:text-soil"
        }`}
      >
        Run the audit <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
