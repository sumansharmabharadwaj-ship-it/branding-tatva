// Shared opacity easing for every pinned multi-stage sequence on the
// site (ElementsIntroPinned, SelectedWorkPinned, PinnedJourney,
// MeadowClosing — PinnedSlider has its own inline copy of this same
// formula, fixed first). The naive `1 - |progress - i|` curve only
// reaches full opacity at one exact scroll pixel per stage, then
// immediately starts fading into the neighbor — direct, repeated
// feedback that pinned scrolling on both Home and About never felt
// "stable," every stage read as permanently mid-transition. This
// carves out a plateau around each stage's own center where it stays
// fully opaque before the crossfade into the next stage begins.
export function stageOpacity(progress: number, index: number, hold = 0.4): number {
  const d = Math.abs(progress - index);
  if (d <= hold) return 1;
  if (d <= 1 - hold) return 1 - (d - hold) / (1 - 2 * hold);
  return 0;
}
