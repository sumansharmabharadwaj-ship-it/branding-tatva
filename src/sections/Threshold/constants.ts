// "Left expands, right compresses" without ever animating a layout
// property (width/flex-basis/grid-template-columns) — both panels stay
// a fixed 50% the whole time. The expansion is perceptual instead: the
// hovered panel's image scales up and brightens, its sibling's image
// scales down and dims, so attention visibly shifts to one side
// without triggering a single reflow.
export const ACTIVE_IMAGE_SCALE = 1.08;
export const INACTIVE_IMAGE_SCALE = 0.97;
export const INACTIVE_DIM_OPACITY = 0.55;
export const PANEL_TRANSITION_MS = 700;
