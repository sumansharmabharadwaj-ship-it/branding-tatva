import type { CSSProperties } from "react";

// These are explanatory work sequences, not client results or extra scope.
const OUTPUTS = [
  { title: "One position. Every expression.", steps: [
    ["Position", "Why this business"], ["Language", "What buyers hear"], ["Identity", "What buyers recognise"],
  ] },
  { title: "A point of view, before a publishing plan.", steps: [
    ["Subjects", "What the brand owns"], ["Arguments", "What earns belief"], ["Editorial plan", "What gets repeated"],
  ] },
  { title: "Different posts. The same recognisable brand.", steps: [
    ["Point of view", "A consistent belief"], ["Recurring cues", "A familiar expression"], ["Live response", "A reason to refine"],
  ] },
  { title: "Every page gives the next decision a place.", steps: [
    ["Offer", "Make the value clear"], ["Evidence", "Answer buyer doubt"], ["Enquiry", "Make the next step easy"],
  ] },
  { title: "One voice, wherever the brand speaks.", steps: [
    ["Verbal rules", "A shared vocabulary"], ["Copy & design", "A repeatable expression"], ["Published work", "The same brand, applied"],
  ] },
  { title: "A campaign begins with a promise you can prove.", steps: [
    ["Promise", "A reason to believe"], ["Buyer", "A reason to care"], ["Moment", "A reason to act"],
  ] },
];

export function DisciplineOutput({ index }: { index: number }) {
  const output = OUTPUTS[index] ?? OUTPUTS[0];
  return (
    <div className="discipline-output" role="group" aria-label="How this discipline becomes usable work">
      <div className="discipline-output-heading">
        <span>From decision to delivery</span>
        <span aria-hidden="true">↗</span>
      </div>
      <p className="discipline-output-title">{output.title}</p>
      <ol className="discipline-output-sequence">
        {output.steps.map(([label, detail], step) => (
          <li key={label} style={{ "--output-step": step } as CSSProperties}>
            <span className="discipline-output-number" aria-hidden="true">0{step + 1}</span>
            <strong>{label}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
