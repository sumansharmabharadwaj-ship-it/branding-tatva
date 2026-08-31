type HandoffMotif =
  | "mist"
  | "river"
  | "root"
  | "aperture"
  | "paper"
  | "constellation"
  | "light";

export function SceneHandoff({
  motif,
  preservePrevious = false,
}: {
  motif: HandoffMotif;
  preservePrevious?: boolean;
}) {
  return (
    <div
      className={`home-v4-handoff home-v4-handoff--${motif}`}
      data-home-handoff-preserve={preservePrevious ? "true" : undefined}
      aria-hidden="true"
    >
      <span className="home-v4-handoff__veil" />
      {motif === "river" || motif === "root" ? (
        <svg viewBox="0 0 1200 96" preserveAspectRatio="none">
          <path
            d={
              motif === "river"
                ? "M-20 50 C160 8 290 86 462 48 C638 10 770 88 955 42 C1048 20 1120 27 1220 55"
                : "M-20 74 C130 25 250 90 390 56 C530 22 645 78 756 45 C860 14 1010 70 1220 28"
            }
            fill="none"
            stroke={motif === "river" ? "rgba(125,155,175,.72)" : "rgba(199,119,82,.68)"}
            strokeWidth="1.4"
            strokeDasharray="6 11"
          />
        </svg>
      ) : null}
      {motif === "constellation" ? (
        <span className="home-v4-handoff__stars">
          {[12, 28, 44, 61, 78, 91].map((left, index) => (
            <i
              key={left}
              style={{ left: `${left}%`, top: `${28 + (index % 3) * 20}%` }}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}
