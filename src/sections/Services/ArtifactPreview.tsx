"use client";

import { LogoMark } from "@/components/Logo";
import { ELEMENT_HEX } from "@/lib/sectionWash";
import type { Deliverable } from "@/data/deliverables";

// The artifact layer of the deliverables explorer — each deliverable
// renders as a document object rather than a text panel, answering
// "what will I actually receive?" with the thing's own shape. Honesty
// rules from the graph and data policy apply throughout: previews are
// STRUCTURAL (the shape of the document, never fabricated client
// content), and every structural preview carries the "Sample
// structure, illustrative" label. The one exception is the identity
// sheet, which demonstrates with this site's own real system and says
// so. All previews are decorative alongside the real text content, so
// they stay aria hidden; the words carry the meaning for assistive
// technology.

function IllustrativeLabel({ text = "Sample structure · illustrative" }: { text?: string }) {
  return (
    <p className="mt-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-[#6F4E37]/70">{text}</p>
  );
}

function IdentityPreview() {
  return (
    <div aria-hidden="true">
      <div className="flex items-end gap-5">
        <span className="font-display text-6xl font-medium leading-none text-[#1B1B1B]">Aa</span>
        <div className="pb-1">
          <p className="font-display text-sm text-[#1B1B1B]">Cormorant Garamond · display</p>
          <p className="font-body text-xs text-[#3A3A3A]">Manrope · body and interface</p>
        </div>
        <span className="ml-auto pb-1">
          <LogoMark size={40} />
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        {Object.values(ELEMENT_HEX).map((hex) => (
          <span key={hex} className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
        ))}
      </div>
      <IllustrativeLabel text="Demonstrated with this site's own identity system" />
    </div>
  );
}

function WebsitePreview() {
  return (
    <div aria-hidden="true">
      <div className="grid grid-cols-3 gap-2">
        {["Notice", "Understand", "Act"].map((job) => (
          <div key={job} className="rounded border border-[#1B1B1B]/20 p-2">
            <div className="h-1.5 w-3/4 rounded-sm bg-[#1B1B1B]/60" />
            <div className="mt-1.5 h-1 w-full rounded-sm bg-[#1B1B1B]/20" />
            <div className="mt-1 h-1 w-5/6 rounded-sm bg-[#1B1B1B]/20" />
            <div className="mt-2 h-2 w-1/2 rounded-sm bg-[#7D8E52]/60" />
            <p className="mt-2 text-[0.55rem] uppercase tracking-[0.12em] text-[#6F4E37]">{job}</p>
          </div>
        ))}
      </div>
      <IllustrativeLabel />
    </div>
  );
}

function CalendarPreview() {
  const cadence = [1, 3, 8, 10, 15, 17, 22, 24];
  return (
    <div aria-hidden="true">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="flex h-6 items-center justify-center rounded border border-[#1B1B1B]/10 text-[0.5rem] text-[#1B1B1B]/40"
          >
            {cadence.includes(i) ? <span className="h-1.5 w-1.5 rounded-full bg-[#556B4A]" /> : i + 1}
          </span>
        ))}
      </div>
      <IllustrativeLabel text="A month's publishing rhythm · illustrative" />
    </div>
  );
}

function MeasurementPreview() {
  const rows = [
    { label: "Business · qualified leads", w: "92%" },
    { label: "Marketing · consultation starts", w: "72%" },
    { label: "Content · saves and completion", w: "54%" },
    { label: "Social · qualified conversations", w: "38%" },
  ];
  return (
    <div aria-hidden="true">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="text-[0.55rem] uppercase tracking-[0.12em] text-[#6F4E37]">{r.label}</p>
            <div className="mt-0.5 h-2 rounded-sm bg-[#1B1B1B]/10">
              <div className="h-full rounded-sm bg-[#556B4A]/70" style={{ width: r.w }} />
            </div>
          </div>
        ))}
      </div>
      <IllustrativeLabel text="Measurement hierarchy · illustrative, no real figures shown" />
    </div>
  );
}

function AuditPreview() {
  const touchpoints = ["Website", "Social profiles", "Sales material", "Packaging", "Email"];
  return (
    <div aria-hidden="true">
      <div className="space-y-1.5">
        {touchpoints.map((t, i) => (
          <div key={t} className="flex items-center gap-2 border-b border-[#1B1B1B]/10 pb-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: i % 3 === 0 ? "#556B4A" : i % 3 === 1 ? "#C6A97A" : "#AD6F5C" }}
            />
            <p className="text-[0.62rem] text-[#1B1B1B]/70">{t}</p>
            <div className="ml-auto h-1 w-16 rounded-sm bg-[#1B1B1B]/15" />
          </div>
        ))}
      </div>
      <IllustrativeLabel text="Touchpoint scorecard · illustrative states" />
    </div>
  );
}

function DocumentPreview() {
  return (
    <div aria-hidden="true">
      <div className="space-y-1.5">
        <div className="h-2 w-2/3 rounded-sm bg-[#1B1B1B]/50" />
        <div className="h-1 w-full rounded-sm bg-[#1B1B1B]/15" />
        <div className="h-1 w-11/12 rounded-sm bg-[#1B1B1B]/15" />
        <div className="mt-2 h-1.5 w-1/3 rounded-sm bg-[#556B4A]/60" />
        <div className="h-1 w-full rounded-sm bg-[#1B1B1B]/15" />
        <div className="h-1 w-4/5 rounded-sm bg-[#1B1B1B]/15" />
      </div>
      <IllustrativeLabel text="Document structure · illustrative" />
    </div>
  );
}

const SPECIALIZED: Record<string, () => React.ReactNode> = {
  identity: IdentityPreview,
  website: WebsitePreview,
  "content-mgmt": CalendarPreview,
  tracking: MeasurementPreview,
  audit: AuditPreview,
};

export function ArtifactPreview({ deliverable }: { deliverable: Deliverable }) {
  const Preview = SPECIALIZED[deliverable.id] ?? DocumentPreview;
  return (
    <div
      className="rounded-2xl p-5 shadow-[0_14px_36px_rgba(0,0,0,0.35)] sm:p-6"
      style={{ backgroundColor: "#F2F0E8", transform: "rotate(-0.4deg)" }}
    >
      <div className="flex items-baseline justify-between border-b border-[#1B1B1B]/15 pb-2">
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[#6F4E37]">{deliverable.group}</p>
        <p className="font-display text-[0.62rem] uppercase tracking-[0.24em] text-[#1B1B1B]/60">Branding Tatva</p>
      </div>
      <p className="mt-3 font-display text-xl font-normal text-[#1B1B1B]">{deliverable.name}</p>
      <div className="mt-4">
        <Preview />
      </div>
    </div>
  );
}
