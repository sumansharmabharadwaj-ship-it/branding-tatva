// Honest placeholder, not filled with invented quotes. Real client
// testimonials go here once collected; see the outreach note in
// PROJECT_PLAN.md. Fabricating attributed quotes would be a fake-review
// problem, not just a content gap, so this stays empty on purpose until
// real ones exist.

export function Testimonials({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-lg border border-dashed border-border bg-background-alt p-6"
        >
          <p className="font-display text-3xl italic text-soil/25">&ldquo;</p>
          <p className="mt-2 text-sm text-foreground-secondary">
            Reserved for a real client quote.
          </p>
          <p className="mt-4 text-xs text-foreground-secondary/70">
            Client name &middot; Business
          </p>
        </div>
      ))}
    </div>
  );
}
