/** A quiet reading progress line at the edge of the Services page. */
export function ServicesJourneyThread() {
  return (
    <div data-services-journey-thread="true" aria-hidden="true">
      <span data-services-thread-rail="true">
        <span data-services-thread-progress="true" />
      </span>
    </div>
  );
}
