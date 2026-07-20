// A mid-article break for otherwise-plain long-form text, matching
// ImageBreak/VideoBreak's existing quote typography (font-display,
// italic, curly quotes) rather than inventing new styling — just
// adapted for a light background inside a narrow reading column
// instead of full-bleed over a photo: text-soil instead of text-ivory,
// no textShadow, and an element-colored left border standing in for
// the photo those breaks would otherwise use.
export function PullQuote({ quote, color }: { quote: string; color: string }) {
  return (
    <blockquote
      className="border-l-2 py-1 pl-6 font-display text-2xl italic leading-snug text-soil sm:text-3xl"
      style={{ borderColor: color }}
    >
      &ldquo;{quote}&rdquo;
    </blockquote>
  );
}
