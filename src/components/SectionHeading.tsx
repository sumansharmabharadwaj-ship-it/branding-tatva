export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-display-sm font-display font-normal text-soil">{title}</h2>
      {description && (
        <p className="mt-4 text-foreground-secondary">{description}</p>
      )}
    </div>
  );
}
