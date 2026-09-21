# Contact route tab light acceptance

Verified 16 September 2026 on preview Release 323.

## Release

- Source: `e2ee68da3eb4ad9c1e06687bea026a27a3721479`.
- Git integration trigger: `ef601213089797f17553f3f9665fe5e53855fe64`.
- Vercel: `dpl_Bfz2htBzinZCZA9aAhEzcmqsTWyj`, READY.
- Host: `branding-tatva-d4y9fg8er-suman22.vercel.app`.
- Controlled workflow: `35065811141`, job `104695713356`, success.
- Branch returned to controlled mode in `059e8d32`.
- Production was unchanged. No real enquiry, call, message, or booking was made.

## Reproduced issue and change

On Release 322, selecting Write from Book moved the shared dark background
through an `overflow: hidden` tab. The incoming background was observed at
`translate3d(-225.814px, 0px, 0px)` while the former selected label still had
the pale `rgb(244, 239, 230)` transition color.

Each tab now owns a fixed warm paper and sage gradient, an animated ink line,
and its existing breathing icon. Labels remain dark throughout the transition.
The gradient only changes opacity; it never travels between clipping parents.
The selected state also retains its icon treatment, underline, and ARIA state.
Keyboard behavior, route content, panel sizing, and native scroll are unchanged.

A suspected stationary cursor label problem was checked first on Release 322:
after scrolling 465px away from the booking link, the label cleared and its
opacity reached zero. No cursor code was changed for that unconfirmed issue.

## Automated checks

- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec eslint src/components/ContactPathways.tsx`: passed.
- `node scripts/contact_cinematic_motion_gate.cjs`: passed.
- `pnpm build`: passed, 86 static pages; Contact 31.8 kB / 299 kB first load.
- `git diff --check`: passed.
- The controlled deployment workflow's mocked delivery check passed.

## Deployed browser checks

Desktop browser viewport: 1363 × 936; document width 1348px.

- Direct `#choose` arrival placed the tabs and selected gradient correctly.
- Book to Write, then rapid Book → Write → Speak clicks all selected the
  intended route and left a single present panel. Hidden panels retained inert.
- Before and after those pointer changes: scrollY 816px; card height
  693.53125px; panel height 568.40625px.
- All three tab rectangles stayed fixed. Every wash rectangle exactly matched
  its button, including the immediate transition sample, with transform `none`.
- Label color stayed `rgb(39, 34, 30)` in initial, changing, and settled samples.
- ArrowRight from Speak selected Write and transferred visible keyboard focus.
- Tab then reached the active route's Start the note link, bypassing hidden
  route actions. The link was focused without being activated.

Narrow responsive QA viewport: 320 × 720; document width 305px.

- Document scrollWidth equaled clientWidth: no horizontal overflow.
- Tabs were 69.28125px high and retained wrapped, readable labels.
- Rapid Write → Book → Speak clicks preserved scrollY 644px, card height
  626.265625px, and panel height 541.203125px.
- Wash bounds matched all three fixed tab targets and labels retained dark ink.
- Reduced motion selected Write immediately; the gradient and ink reached their
  final values in the action sample. Computed duration was the site's effective
  zero duration, `1e-05s`; selected icon animation was `none`.
- Home selected Book with a visible keyboard focus ring.
- Full motion was restored after the check.

Screenshots were inspected on both viewports. Both tabs had no application
errors; browser extension metadata errors were excluded. Narrow QA used the
browser's responsive iframe, not a physical touch device. Forced color styling
was added in CSS but was not emulated in this browser check.

## Preview alias limitation

The workflow confirmed at 06:55:57 UTC that permanent alias reassignment needs
the existing `VERCEL_TOKEN` repository secret, which is absent. The exact READY
deployment was opened and verified using the Vercel supplied temporary share
link. The permanent alias is not claimed to serve Release 323. The previously
blocked `/api/release` browser endpoint was not retried through another channel.
