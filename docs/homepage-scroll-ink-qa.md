# Homepage scroll typography · release 303

## Release

- Source: `d7d18bb8f2c6d501cc48b43ff8e6a20216bcbd3f`
- Deployment trigger: `760742ee22db9defa246bdd4ca8cac8659a91d49`
- Preview: https://branding-tatva-a9wv8syhz-suman22.vercel.app/
- Deployment: `dpl_9HqRPDVPCsy7Tqiig5zBBbZzzgiF`, READY, preview only.
- Source to trigger diff: only the controlled Vercel deployment flag.
- Protected `/api/release` returned HTTP 200 and the exact trigger commit,
  `august-8-isolated` branch, and `preview` environment.

## Behavior

Twelve chapter headings now paint an opaque earth tone sweep and draw a short
accent stroke as they enter the reading zone. Native reverse scrolling retraces
both. The existing SceneRhythm director owns the signal; this adds no listener,
React render loop, word splitting, duplicate text, or layout translation.

Only visible headings receive paint updates. A short damped response settles at
rest. Site motion preference cleanup removes every ink attribute and property;
CSS also provides system reduced motion and forced color fallbacks. The grouped
reading column entrances from release 300 remain intact.

The approved opening and the diagnostic's live question keep their existing
text treatment. Recognition, hidden cost, cost stack, foundation, paths, process,
evidence, both Tatva sections, studio, questions and invitation receive the ink.

## Local and CI checks

- TypeScript, changed component ESLint, homepage source gate, typography gate,
  production build, and rendered homepage gate passed.
- Build: 86 routes, homepage 51 kB / 289 kB first load, 484,608 CSS bytes.
- All three release workflows passed: controlled preview `35000816213`, homepage
  contract `35000816314`, and Contact delivery regression `35000816237`.
- Three existing typography baseline references moved with concurrent Contact
  line changes. Each original and destination source line was compared for exact
  equality. The baseline still contains 239 entries; no exception was added.

## Live acceptance · 15 September 2026

| Check | Observed result |
| --- | --- |
| Desktop 1440 × 900 | All twelve headings received their intended clay or sand gradient and scroll progress. Document client and scroll widths both 1425 px. |
| Reversible desktop sweep | Recognition progress settled at 0.564, increased to 0.923 with a 160 px forward wheel gesture, then returned to 0.564 with the reverse gesture. Background position and accent stroke scale followed the same progress. |
| Stable desktop type | Recognition heading height remained 151.359 px through the sweep. Studio title to lede gap remained 14.391 px. Tatva gaps were 16 and 20 px; questions and invitation retained 24 px. |
| Keyboard | Studio ArrowRight moved focus and selection from Psychology to Literature, with the MyShopInEurope proof destination. The focused reading column's translate was `none`. |
| Mobile 390 × 844 | Client and scroll widths both 375 px. Studio uses natural flow. Reverse then forward scrolling changed the ink from 1 to 0.668 to 0.989. Title to lede gap remained 20.797 px. |
| Site motion pause | All ink targets were removed. Text fill returned to its solid sand color, background became `none`, and stroke content became `none`. Heading height stayed 192.625 px and its lede gap stayed 20.797 px. |
| Controls while paused | Literature selected normally and showed its matching MyShopInEurope proof. Full motion was restored afterward. |
| Narrow 320 × 720 | Client and scroll widths both 305 px. Studio remains in flow with its sand ink, 20.797 px title gap, and no links or buttons outside the viewport. |

Live checks used the deployed homepage and its existing responsive QA route.
The browser's top document read bridge intermittently timed out, while native
screenshots, controls and the responsive iframe read bridge worked. The same
release was verified through that iframe. No frontend change was made for the
browser transport issue. System reduced motion and forced colors are covered by
CSS fallbacks; the site pause control was exercised directly in the browser.

## Release 305 follow-up

A later computed text-fill check found that Recognition's legacy solid fill
covered its active gradient. The release 303 coverage table confirmed background
and progress signals but missed that paint override. Release 305 removes the
conflicting declaration. Live verification confirms transparent text fill over
the clipped gradient during motion, and the original solid clay fill when
motion is paused. See `homepage-comparison-motion-qa.md` for the exact release
and acceptance evidence.
