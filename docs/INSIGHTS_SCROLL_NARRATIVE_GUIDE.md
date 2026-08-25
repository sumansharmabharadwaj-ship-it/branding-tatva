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

The shared seam separates momentum from intent. Scene media follows the
interpolated velocity, preserving a calm inertial release, while the seam uses
the latest travel direction and the eased speed magnitude. Forward and
backward gestures therefore register immediately without snapping the camera.
During movement the seam tightens; once input settles, the active scene gains a
soft accent bloom that rewards the pause without adding another looping effect.

Mobile browser chrome, rotation, keyboard changes, history restoration, and
tab visibility receive explicit recovery paths. The director reads the visual
viewport when available, clears stale momentum after a viewport change, and
halts animation frames while the document is hidden. Returning to the page
recalculates the composition from the real document position, preventing a
camera jump or stale scroll direction.

~~~ts
const viewport = window.visualViewport;
const viewportBottom = (viewport?.offsetTop ?? 0)
  + (viewport?.height ?? window.innerHeight);

const seamShift = direction * Math.abs(renderedVelocity) * 14;
target.style.setProperty("--scene-seam-shift", seamShift + "px");
~~~

`BackgroundVideo` mounts its Framer scroll subscription only when a caller
actually requests parallax. The Insights films use the lighter static stage,
metadata-only video preload, offscreen pause/resume, and lazy reduced-motion
posters. The four generated scene clips are each below 175 KB.

### Meaningful scene layers

Each scene consumes the shared values in a way tied to its content:

| Scene | Visual idea | Meaning |
| --- | --- | --- |
| Decision mirror | Five familiar tensions tune one live diagnostic frame | Self-recognition narrows a broad archive to one credible first move |
| Knowledge atlas | Paths advance with scroll and reverse on back-scroll | A vague problem becomes a navigable system |
| Essay library | The search lens aligns, then a three-card folio turns in place | A question focuses the archive without lengthening the page |
| Audit seam | A film mask opens while the reader marks weak evidence layers | Surface symptoms become a focused working brief |
| Field notes | Question, lens, and move settle beside the form | Exploration resolves into a specific, low-noise promise |

The opening `PhotoHero` is absent from `INSIGHT_SCENES`. The director therefore
cannot add a wrapper, dataset, transform, or animation state to the protected
first section.

## Behavioral reader journey

The post-hero sequence follows the visitor's decision state, rather than the
site's content taxonomy:

1. Recognise: choose the sentence closest to the current business tension.
2. Trace: watch that symptom resolve into a strategic reading and question.
3. Explore: follow the related path, or search in ordinary problem language.
4. Verify: connect the argument to an audit, a proof point, or a service route.
5. Keep: subscribe only after the page has delivered practical value.

The decision mirror uses self-relevant symptoms because self-reference can
increase message elaboration when the underlying argument is strong. It avoids
overclaiming: the selected sentence produces a likely reading, a diagnostic
question, and a first article rather than a definitive diagnosis. See the
[Journal of Consumer Research study on self-referencing and persuasion](https://academic.oup.com/jcr/article-abstract/22/1/17/1808102).

Every route exposes a strong proximal cue: a recognisable symptom, the name of
the path, the question it answers, and the next article. This follows
information-foraging research in which people use information scent to judge
whether staying on a path is likely to satisfy their goal. See
[Pirolli and Card's information-foraging theory](https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog0000_20).

The interface groups the five routes, recommends one first read, and still
keeps the full atlas available. Choice overload is conditional on choice
complexity, task difficulty, preference uncertainty, and the visitor's goal;
the design therefore improves comparison and ranking instead of blindly
removing options. See the
[meta-analysis of moderators of choice overload](https://doi.org/10.1016/j.jcps.2014.08.002).

The atlas and search lens preserve exploration while the audit scene adds
evaluation and reassurance. This supports the recursive exploration and
evaluation behavior described in Google's
[research on purchase decision-making](https://business.google.com/en-all/think/consumer-insights/navigating-purchase-behavior-and-decision-making/).

### Decision mirror implementation

The mirror is a semantic tab interface. Hover previews on pointer devices,
focus and arrow keys expose the same state, and touch keeps selection explicit.
Only one compact answer panel changes, so the section stays close to one screen.

~~~tsx
<InsightsDecisionMirror
  quests={[{
    tension: "People compare us on price.",
    reading: "The market may be using the wrong comparison.",
    firstQuestion: "Which category does the buyer place you in?",
    article: firstPositioningArticle,
  }]}
/>
~~~

The answer connects directly to the matching atlas tab through a stable hash.
`InsightsKnowledgeAtlas` reads the hash on load and on `hashchange`, making
anchor navigation and browser history deterministic.

### Intent-ranked search

Visitors often search with symptoms rather than strategy terminology. The
library maps natural phrases such as “price pressure”, “hard to explain”, and
“looks the same” to the relevant topic, then weights direct title and keyword
matches above broader excerpt or intent-language matches.

~~~ts
if (title.includes(cleanQuery)) score += 24;
if (primaryKeyword.includes(cleanQuery)) score += 18;
if (intentLanguage.includes(cleanQuery)) score += 10;

tokens.forEach((token) => {
  if (title.includes(token)) score += 7;
  if (intentLanguage.includes(token)) score += 3;
});
~~~

`useDeferredValue` lets the input stay responsive while the ranked archive
settles. Empty queries retain the editorial ordering, filters remain explicit,
and the result message explains whether the visitor sees chronology or ranked
matches.

The search lens also exposes its interpretation. Once a phrase settles, the
top-ranked essay determines the strongest strategic current and the interface
names that path beside its element glyph. Empty searches keep all five paths
open; unmatched searches ask for a wider clue. This feedback makes relevance
visible without silently applying another filter.

~~~tsx
const inferredTopic = settledQuery
  ? topics.find((topic) => topic.slug === filteredPosts[0]?.topicSlug)
  : selectedTopic;

<motion.p key={inferredTopic?.slug ?? "open"}>
  <span>Strongest current</span>
  <strong>{inferredTopic?.name}</strong>
</motion.p>
~~~

The first ranked card now explains the kind of connection it found. A direct
title, keyword, or excerpt overlap appears as `Closest wording match`; a match
through the symptom vocabulary appears as `Closest tension match`. A choice
carried from the Decision Mirror keeps the more human `Closest to your chosen
tension`. The cue sits over the image, so it reduces ranking uncertainty
without increasing the folio height or adding another control.

Article selection is measured as one journey across the Decision Mirror,
Knowledge Atlas, Library, topic hubs, and related-reading cards. Events record
the route, article, position, folio, and match category. They deliberately do
not include the visitor's typed query: the interface may use that language in
the current browser session, while analytics receives only coarse interaction
context. This preserves useful behavioral evidence without turning a private
problem statement into telemetry.

### Stable atlas handoffs

Decision Mirror links land on a specific atlas tab. The atlas now holds that
selection while the browser or smooth-scroll provider completes the anchor
journey, then releases control after the reader moves a forgiving distance
away. Pointer and keyboard selections receive the same short spatial lock.

~~~ts
if (Math.abs(window.scrollY - arrivalY) < window.innerHeight * 0.18) {
  setActiveIndex(selectionLock.index);
  return;
}

selectionLockRef.current = null;
~~~

The lock never captures the wheel or changes document position. It only keeps
the intended panel stable long enough to be read, after which normal
scroll-linked atlas progression resumes in either direction.

An unmatched library search also remains productive. Four symptom-led recovery
buttons clear any narrow topic filter and rerun the search with a broader clue:
price pressure, trust gaps, brand sameness, or faint recall. The empty state
therefore becomes a reversible route back into the archive instead of a dead
end.

### Evidence ledger and micro-commitment

The audit scene replaces a decorative five-item list with a reversible working
ledger. Each layer exposes one signal to investigate and the corresponding
evidence to collect. Readers may mark any combination of layers; the progress
rule and summary update without changing the section height or forcing a form.

~~~tsx
<button
  type="button"
  aria-pressed={marked}
  onClick={() => toggleLayer(layer.slug, index)}
>
  <strong>{layer.name}</strong>
  <small>{marked ? "Marked" : "Open"}</small>
</button>
~~~

The interaction creates a small commitment before the audit link while keeping
the outcome useful on its own. Hover previews the evidence strip, keyboard
focus exposes the same detail, touch selection remains explicit, and the marked
state stays mounted when the reader scrolls away and returns.

Marking now produces a live working brief inside the same fixed detail frame.
One layer opens a first route; two named layers are read as a connected buyer
journey; three or more become one compact audit route. The copy remains
cautious: the interface calls the result a working hypothesis, then gives one
specific evidence move for the active marked layer. This rewards the
micro-commitment without presenting a five-click interaction as a diagnosis.

~~~tsx
const showsSynthesis = markedCount > 0 && focusedIsMarked;
const primaryDetail = showsSynthesis
  ? `Read ${markedRoute} as one connected buyer journey; evidence can reveal where confidence changes.`
  : focusedLayer.signal;
~~~

Hovering or focusing an open layer temporarily restores its raw signal and
evidence preview. Leaving the ledger returns to the latest marked layer, so the
reader keeps both free exploration and a stable result. Selection, synthesis,
and reduced-motion states use the same semantic buttons and live regions; no
additional effect, subscription, or document listener is introduced.

The final field-notes scene then states the exchange precisely: every message
contains one question, one practical lens, and one focused move. This closes the
journey with control and expectation clarity instead of a generic newsletter
request.

When the reader has chosen a verified path in the Decision Mirror, Knowledge
Atlas, or Library, that short-lived thread resolves in the final scene. The
topic's element glyph and colour return, the headline names the decision now in
view, and Question–Lens–Move adopts path-specific evidence language. The scene
keeps the same camera, form, and height, so continuity feels like a narrative
payoff rather than another branch to operate.

~~~tsx
const selectedPath = readerIntent
  ? paths.find((path) => path.slug === readerIntent.topicSlug)
  : undefined;

<NewsletterForm readerPath={selectedPath?.slug} />
~~~

The field-note request records only the verified topic slug and the API result.
Typed search language stays inside the reader trail in session storage and is
never attached to newsletter analytics or the subscription request.

The three promises now resolve through the shared scene phases rather than a
separate timeline: Question uses activation, Lens uses discovery, and Move uses
resolution. Back-scroll reverses the sequence automatically, while the final
gold rule reaches full width only when the scene settles.

~~~css
.insights-notes-scene__cadence li:nth-child(1) {
  opacity: var(--scene-activation);
}

.insights-notes-scene__cadence li:nth-child(2) {
  opacity: var(--scene-discovery);
}

.insights-notes-scene__cadence li:nth-child(3) {
  opacity: var(--scene-resolution);
}
~~~

The form names the destination, uses “Send the next note” as its action, states
the confirmation and exit expectation, and turns success into a warm completed
state. Validation and honeypot protection remain unchanged; the request now
uses the existing `newsletter` source value so downstream subscription records
retain a clear acquisition route.

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

### Carrying a reader's choice between scenes

Explicit choices in the decision mirror and knowledge atlas now shape the
library later in the journey. The page publishes one small local intent event;
the library receives it, selects the matching strategic path, and reorders the
first folio without moving the reader or changing the URL.

~~~tsx
publishInsightsIntent({
  topicSlug: quest.topicSlug,
  query: quest.tension,
  label: quest.pathName,
  origin: "decision-mirror",
});
~~~

Only click and keyboard selection carry intent. Hover remains a reversible
preview, and the atlas's scroll-linked path changes remain cinematic rather
than silently rewriting the library. Manual search, filtering, recovery
queries, and Clear the view return full control to the reader.

The carried choice also forms a short-lived reader trail in `sessionStorage`.
It expires after 30 minutes, restores the matching Atlas path and library
folio after an article visit or browser-back journey, and remains optional:
manual search, topic filters, recovery suggestions, and Clear the view remove
it immediately. Storage failures fall back to the in-page event, so strict
privacy modes never block navigation or discovery.

The Decision Mirror's article and Atlas links count as explicit choices. A
reader who previews a tension with hover and then follows its recommended link
therefore keeps that precise question, while passive hover and scroll-linked
Atlas changes still leave no persistent trace.

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
- A direction reversal changes the seam immediately while the camera releases
  its previous momentum smoothly.
- Pausing completes the active seam; resuming tightens it without a layout
  shift.
- Pointer movement stays subtle and ends when the pointer leaves.
- Mobile horizontal folios remain reachable by swipe and keyboard focus.
- Folio paging replaces cards in place without moving the next scene.
- Short laptop viewports show the primary argument without a dead scroll zone.
- No fixed element overlaps headings, controls, or form fields.
- Hash links land at stable scene starts.
- Mobile viewport resize, browser restoration, and tab return recalculate from
  the current position without stale velocity.
- Videos are muted, inline, lazy, and paused away from the viewport.
- Reduced motion shows complete static compositions.
- TypeScript, production build, and generated static routes pass.
