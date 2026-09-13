import type { ReactNode } from "react";

export type VisualizerStep = {
  id: string;
  label: string;
  description: string;
};

type AccessibleVisualizerProps = {
  id: string;
  title: string;
  summary: string;
  steps: readonly VisualizerStep[];
  children: ReactNode;
  className?: string;
};

/**
 * Shared contract for SVG/DOM visualizers.
 * The visual layer may animate, while the ordered semantic explanation remains
 * available to readers, crawlers, keyboard users and reduced-motion modes.
 */
export function AccessibleVisualizer({
  id,
  title,
  summary,
  steps,
  children,
  className = "",
}: AccessibleVisualizerProps) {
  const titleId = `${id}-title`;
  const summaryId = `${id}-summary`;

  return (
    <figure
      className={`bt-visualizer ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      data-visualizer-id={id}
    >
      <figcaption className="bt-visualizer__caption">
        <h3 id={titleId}>{title}</h3>
        <p id={summaryId}>{summary}</p>
      </figcaption>

      <div className="bt-visualizer__stage" aria-hidden="true">
        {children}
      </div>

      <ol className="bt-visualizer__explanation">
        {steps.map((step) => (
          <li key={step.id} id={`${id}-${step.id}`}>
            <strong>{step.label}</strong>
            <span>{step.description}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
