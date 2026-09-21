# Component inventory — the proven bases and the buried material

Written 15 Sep 2026 from a measured sweep, after HomeBrandHealthCheck was
found complete, ticked on the board, and imported by nothing. This file
answers two questions before anyone builds anything new: **what proven
base should this be built on**, and **does a finished version already
exist unwired?** 63 components (~10,000 lines) currently sit orphaned —
exported, complete, imported nowhere.

A ticked board box means *was built*, never *is on the page*. Verify a
component renders before trusting any tick, and run an orphan check
before writing a replacement:

```
b=$(basename file .tsx); grep -rlF "$b" src --include='*.tsx' --include='*.ts' | grep -v "file"
```

## The proven bases (build on these)

Verified working on production this week, with their load-bearing rules:

- **`LivingGradient`** (`src/components/`) — the site's shared animated
  ground system; eight palette presets from the reference board, each
  declaring `carries: "ivory" | "soil"` (the bone `wanderlust` plate
  cannot hold light type, measured ~1.2:1). `plain` mode layers over
  footage. On Home it answers scroll for free via the camera's inherited
  custom properties. Rules: render it as the FIRST child of a
  `position: relative` section, content after; it takes no children by
  design — wrapping a section's background in anything that can animate
  to zero opacity is the bug class that made whole sections vanish.
- **The scroll camera contract** (`HomeV4ScrollCamera`) — publishes
  `--home-camera-velocity` (eased 0–1) and `--home-camera-shift`
  (signed vw) on `[data-home-v4]`. Any CSS inside Home may consume them;
  keep changes on `opacity`/`transform`/`translate` so everything stays
  on the compositor. Never mount a second writer to the
  `--home-handoff-*` set — two rAF loops racing one property set was a
  real shipped bug.
- **The stacked-sticky pattern** (`HomeV4/CostStack.module.css`) — cards
  as sticky siblings, spacing carried by the container's `row-gap`,
  never by card margins: a sticky element stops sticking when its own
  margin box runs out, so margin spacing turns a pile into a hand-off.
  Stagger `top` by enough to keep each covered card's number row
  visible. Degrade to a plain list under 900px, short viewports, and
  both reduced-motion signals.
- **`BtScene` + `useCinematicScene`** (`src/components/`, `src/hooks/`)
  — the measured held-scene system: a frame only holds cleanly when its
  CONTENT fits one viewport (measure content, not section height).
  Currently unwired; it is the right base for any future pinned scene,
  not a new pin implementation. Its CSS deliberately matches on two
  classes because the chapter stylesheets load last and win every
  single-class tie.
- **`useVideoFadeIn` / `VideoWarden`** — every video calls `.play()`
  explicitly (bare `autoplay` is proven unreliable here) and playback
  runs under one budget (2 desktop / 1 mobile). A visible-but-paused
  video next to a playing one is usually the warden working, not a bug.
- **`useRevealTrigger` / `SplitReveal` / `Reveal` family** — the
  hardened entrance system. Backgrounds stay OUTSIDE reveal wrappers.
- **The type floor token** — anything that is a sentence gets 0.7rem
  minimum; smaller only for genuine one-or-two-word small-caps labels.
  Both Home and Services independently shipped ~9px sentences from the
  same 0.56rem habit; the gate now enforces the floor.
- **Media derivatives** — phones get 768-wide same-framing downscales
  via a narrow-screen `<source>` placed FIRST (browsers take the first
  match), and the `<video>` must carry no `src` attribute or every
  `<source>` child is ignored. Contact/Services portrait recuts are art
  direction; Home downscales are pure weight.
- **The viewport truth** — a 1440x900 screen is a ~790px viewport after
  browser chrome. The site's height-gate convention is 761px; treat any
  taller gate as a bug that excludes real laptops (the foundation
  chapter was dead on every MacBook because of a 901px gate).

## The buried material, by lane

### Work orphans = the M4 raw material (Services lane)

`/work` deliberately redirects to `/services#proof`; the old Work page's
parts were orphaned by that fold. Nine M4 board items are unchecked, and
these map onto them almost one-to-one — **build M4 from these, not from
scratch**, checking each still meets the copy standard before rewiring:

| Orphan | Lines | Likely M4 item |
|---|---|---|
| `Work/WorkOpening` | 335 | Restore the root-system opening |
| `Work/SystemFlagship` | 351 | Flagship system assembly |
| `Work/TatvaLab` | 415 | Service constellation |
| `Work/WorkIndex` | 290 | Case index |
| `Work/DecisionMap` + `DecisionEvidenceGallery` | 406 | Causal case-study spine / decision evidence |
| `Work/SignatureProject`, `WorkProofStrip`, `Authorship` | 365 | Proof metrics with unit, timeframe, source |
| `Work/CapabilityMap`, `MarketingEcosystem`, `ProjectStoryWall`, `WorkArchive`, `MobileSystemEvidenceBoard` | 831 | Supporting material |

Also in the Services lane: `DecisionClearing` (271), `ImagineYourBrand`
(268), `DeliverablesReveal` (191), `MobilePerceptionClimb` (208), the
two `*CinematicBackdrop`s, `CyclingStatement`, `ClearingMist`,
`StrategySessionPreview`.

### Insights lane

`Insights/TopicClusters` (109), `Insights/ArticleSearch` (67).

### Home orphans — mostly retired by V4, keep two ideas alive

The V4 rebuild superseded most of these (`ClarityCTA`, `StudioTriptych`,
`ThreePathsSection`, `TatvaMechanism`, `HomeInsightsPreview`,
`ProcessChapterIntro`, `HomeSceneBridge`, `HomeAutoJourney`,
`HomeOpeningSignal`, `HomeChapterDirector`, `FrameworkJourneyNudge`,
`HomeV4TatvaLens/Tempo`, `HomeV4RecognitionTempo` — the two Tempos were
measured changing no DOM attribute over 4s before removal). Treat as
retired; deletion is Suman's call, not any session's.

Worth a second look before retiring: `ChapterLadder` (415) — a real
navigation affordance; if ever remounted, its `min-height: 820px` gate
in `home-cinematic-finish.css` hides it on real laptops and must drop to
the 761px convention first. `HomeFilmConstellation` (391) — unassessed.

### Deliberately dead — do not revive

`AboutSignalField3D` (746 lines of WebGL) — full 3D scenes were built
and rejected twice on this site ("cartoonish and disconnected"); the
history is codified in CLAUDE.md. Same for `LazyAmbientShader` /
`AmbientElementShader`. `HomeV4SeamDirector` — strict subset of
ScrollCamera's property writes; mounting both creates a two-writer race.

### Small utilities orphaned in `src/components`

`ParallaxVideoBackdrop`, `ParallaxDrift`, `NotebookClose`, `SkyLife`,
`KineticMarquee`, `PullQuote`, `SectionHeading`, `HoverGlyph`,
`PrecisionMark`, `DeferredCursor`, `ElementAccentButton`,
`AccessibleVisualizer`, `VisualizerPlayback`, `AnnotatedVisual`,
`DesignRationaleGrid`, `AuditInvite`. Mostly superseded by newer
equivalents; `AuditInvite` was the sitewide lead-magnet signpost and its
job now lives in per-page links — confirm no page lost its audit route
before retiring it.

## Verification recipes that hold on this machine

- Dev server: reliable only for the FIRST load after
  `rm -rf .next` + restart; no curl warm-up — let the harness be the
  first request, and always assert
  `document.documentElement.classList.contains("home-v4-mounted")`
  before measuring anything client-side.
- Build artifacts: build in an isolated `git worktree` (symlink
  `node_modules`, copy `.env.local`) and assert against
  `.next/server/app/index.html` — the shared tree's `.next` gets
  rewritten mid-build by concurrent dev servers.
- Measure both translate axes and let animations settle; a keyframed
  property overrides its base declaration for as long as the animation
  runs.
