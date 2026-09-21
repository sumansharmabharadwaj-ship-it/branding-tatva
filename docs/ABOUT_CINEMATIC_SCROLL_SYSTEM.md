# About cinematic scroll system

Branch: `august-8-isolated`  
Route: `/about`  
Protected opening: `AboutSplitHero` remains structurally and visually unchanged.

## What the system does

After the existing opening hero, the About page behaves as one short editorial film. Native browser scrolling remains the input. The page turns that input into a reversible sequence of six scenes:

| Scene | Narrative action | Scroll-controlled visual state | Resolution |
| --- | --- | --- | --- |
| Point of view | Separate three working beliefs | Perception → Language → Memory | Recognition becomes a system |
| Convergence | Bring two disciplines together | Read → Converge → Resolve | Psychology and literature become practice |
| Principles | Inspect the standards around the work | Four observable principles | Values become testable behaviour |
| Founder-led | Follow one continuous strategic thread | Question → Decision → Language → System | A usable handover is visible |
| Evidence | Build a proof ledger | Three documented engagements | Claim, decision, and record settle together |
| Close | Release visual tension | The moving field becomes still | One calm invitation remains |

Every explanatory scene uses a short `146–156svh` runway on larger screens. Its visible composition stays close to one viewport with `position: sticky`, while the extra `46–56svh` provides enough movement to change meaningful states. These are short shots, not long pinned chapters. Tablet, touch, and reduced-motion layouts remove the sticky runway.

## The shared four-beat language

`AboutCinematicRuntime.tsx` measures each scene once per animation frame and publishes six CSS variables directly on the scene element:

```css
--scene-progress: 0;  /* beginning 0 → ending 1 */
--scene-focus: 0;     /* distance from the viewport's focal plane */
--scene-enter: 0;     /* anticipation becoming activation */
--scene-exit: 0;      /* resolution giving way to the next shot */
--scene-velocity: 0;  /* smoothed absolute scroll speed */
--scene-direction: 1; /* -1 backward, 0 still, 1 forward */
```

The runtime also assigns one semantic phase:

```text
0.00–0.27  anticipation
0.27–0.50  activation
0.50–0.76  discovery
0.76–1.00  resolution
```

That common state gives every scene the same camera grammar without forcing every scene to look the same. The background reacts more quickly to velocity, the information plane moves more slowly, and the current scene settles at full focus. Reversing the scroll reverses the progress and the visualizer state.

## How a visualizer becomes scroll-driven

Use `useScrollDrivenVisualizer` for information that has a small number of meaningful states. The target must be the scene runway, not the sticky child.

```tsx
const storyRef = useRef<HTMLDivElement>(null);
const reducedMotion = Boolean(useHydratedReducedMotion());
const inView = useInView(storyRef, { amount: 0.16 });

const sequence = useScrollDrivenVisualizer({
  count: states.length,
  target: storyRef,
  enabled: inView,
  reducedMotion,
});

return (
  <div ref={storyRef} className={styles.scrollStory}>
    <div className={styles.sticky}>
      {/* Render states[sequence.activeIndex]. */}
    </div>
  </div>
);
```

Hover and keyboard focus may temporarily preview another state. Releasing the preview returns to the state owned by the current scroll position:

```tsx
<button
  onClick={() => sequence.choose(index)}
  onPointerEnter={() => sequence.preview(index)}
  onPointerLeave={sequence.releasePreview}
  onFocus={() => sequence.preview(index)}
  onBlur={sequence.releasePreview}
/>
```

This prevents timers, hover, and scroll from competing for control.

## Adding another scene

1. Give the page-level wrapper `data-about-film-scene` and a stable `data-about-chapter`.
2. Put moving content inside `data-about-film-plane`.
3. Put the atmospheric media inside `data-about-film-background`.
4. Make the component's outer element the runway and the immediate inner layout the sticky viewport.
5. Map scroll only to semantic states. Keep decorative ambient motion independent and restrained.
6. Write a complete static layout for reduced motion before adding movement.

```tsx
<section
  data-about-film-scene
  data-about-chapter="new-chapter"
  data-scene-tone="dark"
>
  <div data-about-film-background>{/* muted atmospheric media */}</div>
  <div data-about-film-plane>
    <NewVisualizer />
  </div>
</section>
```

```css
.scrollStory { position: relative; }

@media (min-width: 981px) and (prefers-reduced-motion: no-preference) {
  .scrollStory { height: 148svh; }
  .sticky { position: sticky; top: 0; height: 100svh; }
}

@media (max-width: 980px), (prefers-reduced-motion: reduce) {
  .scrollStory { height: auto; }
  .sticky { position: relative; top: auto; height: auto; }
}
```

## Interaction and performance contract

- Keep native wheel, trackpad, touch, keyboard, anchor, and browser history behaviour.
- Use proximity snapping only on large fine-pointer layouts. Never use mandatory snap or wheel interception.
- Update transforms, opacity, and CSS variables in `requestAnimationFrame`; do not set React state for the camera layer.
- Stop requesting frames while the document is hidden. Background videos already pause when they leave the viewport.
- Keep text readable throughout a transition. Camera treatment can soften an inactive plane, but it must never hide required content.
- Prefer one primary motion, one supporting depth motion, and one ambient cue per viewport.
- Use direct taps on touch screens. Cursor light, velocity veil, and chapter spine remain desktop enhancements.
- In reduced motion, remove sticky runways, scroll snapping, camera transforms, and scrub-dependent movement. Present the real first state and keep every tab directly selectable.

### Atomic film handoffs

`VideoWarden` owns the page-wide playback budget: at most one film may be playing at any instant. Scroll, resize, mutation, and intersection changes remain frame-batched, but a video's `play` event is arbitrated synchronously. This immediately pauses the outgoing film before the incoming decoder can compete for a frame.

Keep the `play` listener synchronous if the media system changes. `npm run check:about` guards this invariant alongside the rest of the About journey contract.

## QA route

Check these states before publishing:

1. Desktop `1440×900`: one wheel gesture creates visible progress; headings rest below navigation.
2. Short laptop `1366×768`: complete scene information fits or remains directly reachable with no overlap.
3. Tablet portrait and landscape: no sticky cage, no horizontal overflow, all controls tappable.
4. Mobile `390×844`: vertical reading order remains clear; horizontal tab rows scroll independently.
5. Reduced motion: stable static compositions, working tabs, no content dependent on scrub progress.
6. Backward scrolling: visualizer stages reverse in order with no animation reset.
7. Anchor and browser-back arrival: landing position remains stable after videos load.
8. Performance: no layout shift, only the visible media keeps playing, and no continuous React rerender loop appears in the profiler.
