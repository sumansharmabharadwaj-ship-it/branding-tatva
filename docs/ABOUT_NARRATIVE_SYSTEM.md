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

The interaction translates each fact into a practical brand-strategy lens. The
real portrait remains the visual anchor while the scroll controls crop, focus,
aperture, evidence card, and editorial emphasis.

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
with tone. The resolution does not invent a performance claim; it shows the
kind of strategic outputs the practice produces: positioning, language, and
recognition.

Desktop motion clarifies that sequence by moving the two disciplines toward a
shared field, drawing their connections, and then letting the input layers
recede behind the resolved outputs. Tablet, mobile, and reduced-motion modes
render the same model as a complete linear explanation rather than a shrunken
version of the pinned composition.

The global chapter spine names this scene **Synthesis**, so navigation language
matches what the visitor is actually watching rather than repeating the degree
labels from the origin chapter.

## Point-of-view camera

`PointOfView.tsx` treats perception, language, and memory as one recognition
sequence rather than three tabs followed by three interchangeable cards. The
same horizontal composition changes focus as scroll advances:

```tsx
const recognitionSequence = [
  { verb: "See", belief: "Perception precedes preference." },
  { verb: "Name", belief: "Language frames value." },
  { verb: "Return", belief: "Consistency creates memory." },
];
```

The active field widens like a camera finding focus while the other two remain
visible as context. The record rail beneath it keeps the strategic decision,
verified engagement evidence, and case-study path in the same visual plane.
Pointer position changes only the ambient light; scroll, keyboard focus, and
hover all operate the same reversible state model.

Touch and reduced-motion modes show all three beliefs as a compact editorial
record. Nothing depends on discovering a hidden gesture, and no claim is lost
when the pinned camera is removed.

## Working-standards record

`Behaviours.tsx` turns four stated values into one cumulative decision record.
The scene does not ask the visitor to browse four interchangeable cards. Each
scroll phase adds something another person can inspect in the finished work:

```tsx
const visibleTrace = [
  "Observed evidence",
  "Category choice",
  "Reasoning trail",
  "Repeatable signal",
];
```

The paper stays in the same camera while its record fills in. Scroll direction
reverses the assembly, pointer position changes the viewing angle and light,
and the page-level velocity variable gives the sheet a restrained physical
response. Mobile and reduced-motion modes replace the camera with the complete
four-part editorial record, so every standard remains readable without a
hidden gesture.

## Founder-led continuity record

`WorkingDirectly.tsx` now keeps one strategic document in frame from the
original question through the usable system. Scroll progressively adds the
problem, position, language, and operating rules to that same record, so
continuity is demonstrated through accumulation rather than explained through
four interchangeable panels. Reverse scroll removes later conclusions while
preserving the earlier context they depend on.

```tsx
const state = index < activeIndex
  ? "complete"
  : index === activeIndex
    ? "active"
    : "waiting";

<button data-state={state} onClick={() => sequence.choose(index)}>
  <span>{stage.recordLabel}</span>
  <strong>{stage.record}</strong>
  <em>{stage.output}</em>
</button>
```

Pointer position moves the working light and restrained paper angle. Touch and
reduced-motion modes receive the complete four-stage record in normal reading
order, with every input, decision, and output available without a hidden
gesture.

## Performance and accessibility rules

- Pinning is limited to a 158svh runway with a 100svh scene; native scroll is
  never intercepted or trapped.
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
