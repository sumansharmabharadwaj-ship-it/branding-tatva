# Session handoff (Aug 2026)

## Where the code lives

macOS is blocking access to `~/Documents`, so the original working copy
is unreadable by the assistant. Work happens in a fresh clone at
`~/branding-tatva-claude`. The original folder is untouched and safe.

To restore direct access: System Settings, Privacy and Security, Files
and Folders, enable Documents for Claude. Not required while the clone
exists.

## Branches

| Branch | Owner | State |
| --- | --- | --- |
| `claude/final-design` | this assistant | 4 commits today, all pushed |
| `reimagine-project-moves` | ChatGPT | 34 commits ahead of the merge base |
| `final-completion` | previous session | the state `claude/final-design` grew from |
| `main` | neither | behind both, on a separate line |

## The merge, attempted and deliberately aborted

`claude/final-design` and `reimagine-project-moves` diverge by 9 and 34
commits across 25 files. A trial merge produced exactly **4 conflicts**:
`src/app/layout.tsx`, `src/sections/FAQ/index.tsx`,
`src/sections/Home/EvidenceWall.tsx`, `src/sections/Process/RootSystem.tsx`.

Small in count, large in meaning: those are the same four files both
sides rewrote. ChatGPT's side changes RootSystem by roughly 1,500 lines,
EvidenceWall by 314, FAQ by 201. Resolving them is choosing whose
rebuild survives, not reconciling whitespace. It needs a session with
room to merge, build, and scroll through RootSystem and the FAQ
afterwards.

The merge was aborted cleanly. Both branches are intact.

**To reduce future conflicts:** split ownership by page. One line takes
Home and the scenes, the other takes Services, Work and Insights.

## Deploys

Vercel free plan hit its cap of 100 deployments per day
(`api-deployments-free-per-day`), which resets 24 hours after it was
hit. Both lines of work share that quota. Latest Ready preview:
`https://branding-tatva-cc24vfxny-suman22.vercel.app` (carries the Home
pacing work, and not the commits after it).

Deployment protection stays enabled by decision. Review through a
Protection Bypass link from the Vercel dashboard.

## Landed on `claude/final-design` today

- Home pacing: 21.5 to 19.8 viewports. Earth scene 320vh to 240vh, root
  system 460vh to 370vh. Both verified to still complete: four
  foundation layers with closing statement and three connectors, six of
  six root segments.
- FAQ answers now render in the HTML. They previously mounted only on
  open, so the server sent eleven questions with no answers while the
  FAQPage schema promised text that existed nowhere in the markup.
- Brand studies in the `/work` ItemList now carry their own URLs. Every
  one of the five previously claimed the `/work` index.
- Descriptive alt text on Home's real project imagery.

## Open, in priority order

1. Consent layer completion: Accept all, Reject non-essential, Manage
   preferences, separate necessary/analytics/marketing with nothing on
   by default, a persistent withdraw path, and policy text that matches.
   Current state is functionally gated and incomplete. See
   docs/EMAIL_AUTOMATION.md.
2. SEO, AEO and GEO: ten gaps remain from a verified audit. Highest
   value: `/services` carries no structured data at all despite three
   real packages with a real price book; there is no `WebSite` node and
   no `@id` cross-references; glossary and Insights render titles as
   paragraphs so answer engines cannot chunk them; `llms.txt` links a
   redirect and omits the glossary entirely.
3. Six new reference sites to study: heyparker.ai, rectangles.fm,
   horeca-social.com, santionispirits.com, zero.university,
   simonholm.studio.
4. Nine footage selections still awaiting per file approval.
5. The five element slider decision, judged against the whole narrative
   now that the Earth scene exists.

## Standing rule worth repeating

Only verified numbers from real project data ever appear as proof. This
matters most wherever charts or diagrams get added, since a chart invites
invented figures. If a visual needs data that does not exist, the visual
changes; the data is never fabricated.

## Next creative brief: make it play like a film

Suman, restating a direction she has given several times: every section
should read as a film rather than as a page, typography included.

This is already diagnosed. Two named gaps deliver most of it, and both
exist in the codebase rather than needing invention.

**1. Transition grammar, currently on one page out of six.**
`SceneVeil` and `SceneHandoff` live in `src/sections/Services/` and are
used nineteen times on `/services` and zero times anywhere else. Home
cuts hard between chapters: the FAQ chapter sits on a near cream wash
and hands straight into a night sea video whose overlay bottoms out near
black, a full luminance inversion at a single boundary. `ClarityCTA`
butts against `EvidenceWall` with no dissolve.

The fix is promotion, not new work: move both components to
`src/components/`, then apply them at Home's six boundaries and on Work
and About, exactly as `services/page.tsx` already does, passing the
previous section's ground colour in and its own out. The cinematic media
doc already specifies the rule this satisfies: each boundary shifts at
most 10 to 15 percent of the palette, at similar luminance.

**2. Typography that performs.**
`SplitReveal` (GSAP SplitText, word and char variants) already exists and
is deliberately reserved for real headline moments. Extending it is a
judgement call rather than a sweep: applying it everywhere would make
the restraint meaningless. The candidates are the section headings that
open a chapter, never body copy or labels.

**Do NOT solve this by adding more pinned scenes.** The pinning budget is
one immersive held sequence per key page and the page is already at it.
A film reads as a film because of how its cuts work, not because every
shot is long.

Related, still open from the same audit: the three second breath between
major sections (mist, wind, minimal type, zero information) exists in the
spec and nowhere in the code.
