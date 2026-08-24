# Insights scroll narrative

## Intent

The Insights landing page uses native vertical scroll as an editorial camera.
The opening scene remains outside the system. Scenes two through six share one
motion grammar:

1. Anticipation: part of the next visual field becomes visible.
2. Activation: the incoming scene opens and aligns.
3. Discovery: the useful information reaches its clearest state.
4. Resolution: the composition settles before the following scene arrives.

The page never pins the reader, captures the wheel, or creates an artificial
scroll runway. Each scene remains close to one viewport and can be crossed with
normal wheel, trackpad, touch, keyboard, or assistive navigation.

## Architecture

### Scene director

"InsightsSceneNavigator.tsx" reads four inputs:

- actual document position;
- Lenis velocity when the provider is active;
- pointer position for desktop focal shifts;
- passive touch movement for mobile focal shifts.

An animation frame writes a small set of CSS custom properties directly to
nearby scene nodes. Transient values stay out of React state, which avoids a
component render for every scroll or pointer event.

~~~ts
const sceneProgress = clamp(
  (viewportHeight - bounds.top) / (viewportHeight + bounds.height),
);
const presence = clamp(1 - Math.abs(sceneProgress - 0.5) * 2);

target.style.setProperty("--scene-progress", sceneProgress.toFixed(4));
target.style.setProperty("--scene-presence", presence.toFixed(4));
target.style.setProperty("--scene-camera-y", cameraY.toFixed(2) + "px");
~~~

The director updates only scenes within one viewport above or two viewports
below the current screen. Velocity and pointer interpolation stop requesting
frames as soon as their values settle.

`BackgroundVideo` mounts its Framer scroll subscription only when a caller
actually requests parallax. The Insights films use the lighter static stage,
metadata-only video preload, offscreen pause/resume, and lazy reduced-motion
posters. The four generated scene clips are each below 175 KB.

### Meaningful scene layers

Each scene consumes the shared values in a way tied to its content:

| Scene | Visual idea | Meaning |
| --- | --- | --- |
| Foundation | A folio opens and five decision bands assemble | Positioning supports every later decision |
| Knowledge atlas | Paths advance with scroll and reverse on back-scroll | A vague problem becomes a navigable system |
| Essay library | The search lens aligns, then a three-card folio turns in place | A question focuses the archive without lengthening the page |
| Audit seam | A film mask opens while evidence enters a ledger | Surface symptoms resolve into diagnostic layers |
| Field notes | Copy and form settle into one final frame | Exploration resolves into an ongoing relationship |

The opening `PhotoHero` is absent from `INSIGHT_SCENES`. The director therefore
cannot add a wrapper, dataset, transform, or animation state to the protected
first section.

### Scroll-linked CSS

JavaScript calculates values that CSS can composite without layout changes:

~~~css
.insights-foundation__film {
  clip-path: inset(0 calc(100% - var(--scene-mask)) 0 0);
  transform:
    translate3d(var(--scene-camera-x), var(--scene-camera-y), 0)
    scale(var(--scene-camera-scale))
    rotate(var(--scene-camera-roll));
}
~~~

Animated properties are limited to transform, opacity, and deliberate mask
reveals. Section height, grid geometry, padding, and typography metrics remain
stable during scroll.

## Adding a scene

1. Give the scene a stable ID and add it to "INSIGHT_SCENES".
2. Keep the scene at "min-height: 100svh"; allow natural growth when the
   content genuinely needs it.
3. Create one camera layer for media and one content composition.
4. Use the shared variables before adding any component-specific listener.
5. Connect movement to the argument of the scene.
6. Confirm the final static frame remains complete under reduced motion.

~~~tsx
<section
  id="insights-new-scene"
  className="insights-scene insights-new-scene"
  data-scene-active="false"
>
  <div className="insights-new-scene__camera">{/* meaningful content */}</div>
</section>
~~~

~~~css
.insights-new-scene__camera {
  opacity: var(--scene-content-opacity);
  transform:
    translate3d(var(--scene-discovery-shift), var(--scene-resolution-shift), 0);
}
~~~

## Interaction rules

- Hover can preview or focus information; leaving returns authority to scroll.
- Keyboard focus always exposes the same information as hover.
- Touch gestures never call "preventDefault()"; vertical scroll stays native.
- Horizontal mobile folios use local, forgiving proximity snapping.
- Vertical desktop scenes use forgiving proximity snapping.
- Anchor links and browser hash restoration remain native and stable.
- Scene changes are expressed inside the composition; no fixed chapter control
  competes with headings, search, or the newsletter form.

### Keeping the library inside one screen

The library replaces a growing "show more" grid with an in-place folio. Search
and topic filters still inspect the complete archive, while each folio contains
three cards and preserves the next scene's location.

~~~tsx
const firstPostIndex = activeFolio * POSTS_PER_FOLIO;
const visiblePosts = filteredPosts.slice(
  firstPostIndex,
  firstPostIndex + POSTS_PER_FOLIO,
);

<AnimatePresence mode="wait" initial={false} custom={folio.direction}>
  <motion.div key={`${topicSlug}-${activeFolio}`} variants={FOLIO_TURN_VARIANTS}>
    {visiblePosts.map((post) => <InsightCard key={post.slug} post={post} />)}
  </motion.div>
</AnimatePresence>
~~~

Forward and backward buttons turn the folio in matching directions. Reduced
motion swaps the rows immediately in the same stable layout.

## Reduced motion

The operating-system preference and Branding Tatva motion control both produce
a complete static page:

- every mask is fully open;
- every content block is fully opaque;
- every camera transform returns to its neutral state;
- the atlas stays on a stable selectable path;
- ambient orbiting stops;
- vertical scene snapping is removed.

Reduced motion changes presentation only. Links, search, filters, tabs, forms,
headings, and landmarks retain their original semantics.

## Tuning guide

The director owns the feel of the whole page. Tune these values together:

- "targetVelocity / 32": overall sensitivity to fast input;
- the "0.18" interpolation factor: inertial catch-up;
- the "0.84" velocity decay: momentum release;
- "cameraY": forward/backward dolly response;
- "cameraScale": energy at high velocity;
- "--scene-mask": activation reveal;
- phase ranges in "range()": the four-beat rhythm.

Scene CSS should tune composition and pacing, while the director should retain
ownership of input response. Creating a separate wheel listener or easing
system for one section breaks the shared language.

## Verification checklist

- Opening scene markup and styling remain unchanged.
- Forward and backward scroll resolve to matching reversible states.
- A fast wheel gesture adds energy without hiding text.
- Pointer movement stays subtle and ends when the pointer leaves.
- Mobile horizontal folios remain reachable by swipe and keyboard focus.
- Folio paging replaces cards in place without moving the next scene.
- Short laptop viewports show the primary argument without a dead scroll zone.
- No fixed element overlaps headings, controls, or form fields.
- Hash links land at stable scene starts.
- Videos are muted, inline, lazy, and paused away from the viewport.
- Reduced motion shows complete static compositions.
- TypeScript, production build, and generated static routes pass.
