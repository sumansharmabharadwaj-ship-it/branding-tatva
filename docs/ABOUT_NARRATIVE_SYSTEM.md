# About narrative system

The About page is designed as one reversible editorial film. The protected
opening remains independent. Every chapter after it participates in the same
four-beat rhythm:

1. **Anticipation** — the living thread, chapter spine, and background tone
   establish the next scene before its main transformation begins.
2. **Activation** — scroll progress selects a meaningful state in the active
   visualizer. Forward and backward scroll use the same timeline.
3. **Discovery** — the active state exposes a decision, credential, belief, or
   documented result; hover and keyboard focus may preview another state.
4. **Resolution** — the scene leaves one complete composition on screen before
   native scroll carries the visitor into the next chapter.

## Scene contract

Every post-hero scene uses the same attributes so
`AboutCinematicRuntime.tsx` can coordinate it without owning the content:

```tsx
<section
  data-about-film-scene
  data-about-chapter="origin"
  data-scene-tone="light"
>
  <div data-about-film-background>{/* image or lazy ambient video */}</div>
  <div data-about-film-plane>{/* one chapter visualizer */}</div>
</section>
```

The runtime writes scene progress, focus, entrance, exit, velocity, direction,
and phase as CSS custom properties/data attributes. A chapter may read those
values for transform/opacity effects, but it should not add another global
scroll listener.

## Scroll visualizers

Interactive chapters use `useScrollDrivenVisualizer`:

```tsx
const visualizer = useScrollDrivenVisualizer({
  count: states.length,
  target: sectionRef,
  enabled: inView,
  reducedMotion,
});

const active = states[visualizer.activeIndex];
```

The helper keeps wheel, trackpad, keyboard, and assisted scrolling on the same
reversible state map. Tabs call `choose`; pointer/focus exploration calls
`preview` and `releasePreview`. Arrow keys, Home, and End must remain available
for every tablist.

## Founder-origin chapter

`FounderFieldNotes.tsx` fills the largest information gap found in the audit:
the page previously explained the method but did not adequately reveal the
person and disciplines behind it. It uses only facts recorded in
`src/data/about.ts`:

- M.A. Clinical Psychology — Amity University, 2023
- B.A. (Hons) English Literature — University of Delhi, 2021
- 60 + 30 documented clinical/counselling internship hours
- National Winner, “16 Frames” — Thomso ’19, IIT Roorkee

The interaction translates each fact into a practical brand-strategy lens. All
three fields remain visible as one formation map while the scroll gathers them
around the real portrait and resolves them into the founder-led practice. The
active record now holds one credential, one trained instinct, and one concise
translation into brand work, removing the competing quote, term chips, giant
word layer, and separate bottom control row from the earlier composition.

The desktop runway is reduced from 158svh to 144svh. Pointer movement changes
the portrait depth, scroll direction reverses the gathering sequence, and
hover or keyboard focus can inspect any field. Touch and reduced-motion modes
show the portrait, the three verified fields, and the completed synthesis in
normal reading order.

## Synthesis chapter

`Convergence.tsx` no longer repeats the founder-origin chapter as another pair
of discipline cards. It answers the next visitor question instead: *how do
those disciplines change a brand decision?*

The desktop scene uses one short native-scroll runway and three reversible
states:

```tsx
const STAGES = [
  { label: "Read", meaning: "Keep the two lenses distinct." },
  { label: "Connect", meaning: "Pair human signals with language." },
  { label: "Carry", meaning: "Resolve one usable brand signal." },
];
```

The middle state makes the logic inspectable through four pairings—attention
with framing, association with metaphor, memory with narrative, and choice
with tone. Hover, focus, or click isolates one connection and lets its two
source signals brighten while the centre explains the brand consequence:
Category, Meaning, Recognition, or Confidence. The resolution does not invent
a performance claim; it shows the kind of strategic outputs the practice
produces: positioning, language, and recognition.

Desktop motion clarifies that sequence by moving the two disciplines toward a
shared field, drawing their connections, and then letting the input layers
recede behind the resolved outputs. Tablet, mobile, and reduced-motion modes
render the same model as a complete linear explanation rather than a shrunken
version of the pinned composition.

The desktop runway falls from 148svh to 140svh. Fine-pointer movement shifts
the shared field and paper light gently, while every explanation remains
available through focus and click.

The global chapter spine names this scene **Synthesis**, so navigation language
matches what the visitor is actually watching rather than repeating the degree
labels from the origin chapter.

## Brand-system atlas

`BrandSignalAtlas.tsx` answers the practical question that follows synthesis:
*what does the resolved signal need to govern?* The scene holds four connected
brand surfaces in one composition—position, language, creative direction, and
team practice—while the short scroll runway changes the system state:

```tsx
const stages = [
  { label: "Find", meaning: "Isolate one credible signal." },
  { label: "Carry", meaning: "Coordinate every expression around it." },
  { label: "Recognise", meaning: "Let repeated coherence compound." },
];
```

Scroll controls the whole composition rather than selecting a single card.
Hover, click, and keyboard focus inspect each surface without interrupting the
scroll state. Each record includes a coherence question so the interaction
works as a compact diagnostic as well as an explanation of the practice.

The 142svh desktop runway stays below the page's existing pin cap. Touch and
reduced-motion layouts present the same four surfaces as a complete linear
atlas, with no dependency on pointer discovery.

## Point-of-view recognition camera

`PointOfView.tsx` treats perception, language, and memory as one recognition
sequence rather than a set of expanding interface panels. One camera now keeps
the stage selector, a real project still, the buyer question, the strategic
response, and the recorded proof in the same composition:

```tsx
const recognitionSequence = [
  { verb: "See", lens: "Category", example: "HerbalCart" },
  { verb: "Name", lens: "Value", example: "MyShopInEurope" },
  { verb: "Return", lens: "Memory", example: "Dr. Haley Nutrition" },
];
```

Each scroll state replaces the complete case frame with a direction-aware
masked cut. The image, before-and-after strategic frame, buyer question,
decision, proof classification, and case-study route therefore change as one
shot. The cumulative line beneath the camera resolves category, value, and
pattern into recognition without adding another explanatory card.

The desktop runway uses 140svh. Pointer movement changes
the physical viewing angle through a requestAnimationFrame-synchronised CSS
variable update, while page velocity adds a restrained camera response. Touch
uses a horizontal proximity-snap case reel. Reduced-motion mode presents all
three records in a stable grid or vertical mobile reading order, so no claim
depends on the scrubbed camera.

## Working-standards record

`Behaviours.tsx` turns four stated values into one pressure-test instrument.
The scene keeps one recommendation in view while scroll progress moves it
through four gates. Each gate strengthens the same signal and leaves something
another person can inspect in the finished work:

```tsx
const visibleTrace = [
  "Observed evidence",
  "Category choice",
  "Reasoning trail",
  "Repeatable signal",
];
```

The gate line, active pressure test, visible trace, and decision stamp resolve
as one composition. Reverse scroll returns the recommendation to an earlier
test, while direct selection makes the reasoning inspectable without changing
the page position. Pointer position changes the viewing angle and light. Mobile
and reduced-motion modes replace the instrument with the complete four-part
editorial record, so every standard remains readable without a hidden gesture.

The chapter uses a light vellum field over the moving moss film. This creates a
visual release between the dark brand-atlas and founder-led chapters while the
shared film runtime, clay accents, typography, and cumulative record preserve
continuity. The supporting copy explains the visible trace each standard leaves
in the work and avoids an explicit scrolling instruction. The desktop runway
uses 138svh: enough distance for four deliberate states without pinning fatigue.

## Founder-led continuity record

`WorkingDirectly.tsx` keeps one living decision trail in frame from the
original question through the usable system. The old split composition repeated
the active stage in a left-hand explanation and four dense document rows. The
new scene gives the whole viewport to one record: incoming context enters, the
active decision sharpens in the centre, and its output is stamped into the
same accumulating archive. Reverse scroll removes later conclusions while
preserving the earlier context they depend on.

```tsx
<button data-reached={index <= activeIndex} data-active={index === activeIndex}>
  <Icon />
  <span>{stage.label}</span>
</button>
```

Pointer position moves the working light and restrained paper angle. The
desktop runway falls from 154svh to 140svh. Touch and reduced-motion modes
receive the complete four-stage record in normal reading order, with every
input, decision, and output available without a hidden gesture.

## Comparative evidence chain

`Evidence.tsx` uses one comparative evidence lens instead of an expanding
table. Scroll selects an engagement while one uninterrupted visual path carries
the eye from ambiguity to strategic decision to the recorded outcome or
deliverable:

```tsx
const cases = [
  { evidenceType: "Measured performance", record: "104%" },
  { evidenceType: "Documented strategic output", record: "Brand foundation" },
  { evidenceType: "Implementation-ready system", record: "5 formats" },
];
```

The scene deliberately distinguishes performance metrics from strategic
artifacts and implementation-ready deliverables. Each case changes as one
masked camera cut, so its image, ambiguity, decision, and record always belong
to the same argument. Scroll direction reverses the comparison naturally;
hover, click, and keyboard focus preview the other cases. Touch and
reduced-motion modes receive three complete linear records.

## Resolution threshold

`AboutResolution.tsx` replaces the old generic notebook card with a final
decision threshold. The closing scene keeps the three real engagement routes
visible and lets the visitor read their own situation against the existing
package definitions:

```tsx
const paths = [
  { cue: "Beginning", package: "Foundation" },
  { cue: "Realigning", package: "Full Brand System" },
  { cue: "Sustaining", package: "Brand Partnership" },
];
```

The moving confluence film resolves the page's living-thread metaphor inside a
short 136svh threshold. Every route carries a question into the composition and
returns one first decision, making the transformation legible before the
package link appears. Backward scroll restores the previous route. Hover,
focus, click, and arrow-key input use the same state model. Package audiences
and first working choices come directly from `data/services.ts`.

Touch and reduced-motion modes show all three routes in full, followed by the
same package and conversation links. The final state therefore remains a
complete decision aid even when the camera and masked record transitions are
removed.

## Performance and accessibility rules

- Desktop pinning is capped at a 158svh runway with a 100svh scene; the
  comparative evidence lens uses only 138svh. Native scroll is never
  intercepted or trapped.
- Motion uses transform, opacity, clip-path, and a capped-density canvas. No
  scroll event measures layout more than once per animation frame.
- Background video uses the shared observer-controlled player, metadata preload,
  poster fallback, muted inline looping, and offscreen pause behaviour.
- Fine-pointer depth is decorative and never required to access information.
- Touch viewports get a deliberately linear, fully readable field-record layout.
- `prefers-reduced-motion` and the in-product motion setting both receive a
  complete static composition, not missing content.
- Chapter controls preserve semantic headings, tab roles, focus states, and
  arrow/Home/End navigation.

Relevant standards and implementation references:

- W3C WCAG Technique C39: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- W3C WCAG 2.3.3 Animation from Interactions: https://www.w3.org/TR/WCAG21/#animation-from-interactions
- MDN scroll-driven animation timelines: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion

## Review checklist for future chapters

- Does the scene answer a visitor question that the page does not already answer?
- Is the meaning legible in one viewport before adding motion?
- Does backward scroll restore every prior state without a reset?
- Is the final state visibly complete before the next scene enters?
- Is pointer motion additive rather than required?
- Does mobile reveal the same information without a miniature desktop pin?
- Does reduced motion present a coherent static layout?
- Are claims sourced from the project data rather than invented for animation?
- Does the background asset add context without repeating an earlier visual?
- Is the runway short enough to avoid pinning fatigue?
