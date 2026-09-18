# Homepage connected decision trail

18 September 2026. Final preview verification recorded below.

## Change

The three service paths now explain how their scope fits together. Each
existing decision has one short supporting sentence. An ordered list keeps
that sequence readable, with numbered markers and a connected vertical line.
The main offer descriptions and package destinations still come from the
existing service data.

The two decorative line segments draw in sequence when the trail first comes
into view or its path changes. The trail has its own visibility observation,
so arriving at the chapter heading does not consume the animation before the
list appears. Each segment takes 0.5 seconds, with the second starting after
0.28 seconds. All text remains opaque throughout. There is no looping animation
or timer that changes the selected path.

Keyboard focus settles the copy, scope and connector immediately. Arrow-key
selection keeps the text still. Pause cancels the animation and restores the
complete line; resuming the same path does not restart its entrance. The
operating-system reduced-motion CSS also forces a complete, static connector.

Invisible, inert readings reserve the height of every path at the current
width and font size. Main decision labels use 16 px text, with 15 px supporting
sentences. Chapter spacing and the question size were adjusted to accommodate
the clearer reading. The existing content-fit check still decides whether a
desktop viewport can hold the chapter; smaller or shorter layouts use natural
document flow.

## Baseline

The shared release 408 showed three short scope labels separated by rules.
At 1363 × 936 its sticky chapter had a 1872 px runway and a 936 px reading frame.
The scope was 482 × 336.828125 px. The earlier menu improvements were confirmed
on the shared alias before this work began.

## Validation

TypeScript, changed-file ESLint, homepage source, type floor, production build
and rendered homepage checks passed before release. The initial build generated
93 routes. A concurrent Insights linking release and hidden cost update arrived
before the push, so the non-force update was rejected safely. Those changes
were rebased into this work. Releases 409–411 belong to the concurrent
Insights, hidden cost and Services updates. This path change is release 412.
The final combined source passed all the checks above, generating 93 routes
and verifying 526,631 CSS bytes. Only the controlled deployment flag changed
between that tested parent and the final source parent; the latest false flag
was preserved when creating the non-force source commit.

Source: `8b5875ef9db993e278b82c7454d543673faf6eca`.

Trigger: `f78f5af66beb71e6cc8fc577413c63c4ff1a561c`.
READY deployment: `dpl_GEdjBi9baGhvajFTeVxjae5uD1WN`.
The source to trigger comparison contains only vercel.json. All three workflows
passed: homepage `35356846069`, contact delivery `35356845654`, and controlled
preview `35356845574`.

## Desktop layout

On the exact deployed preview at 1363 × 936, the chapter retains its held mode,
1872 px runway and 936 px frame. The scope is 482 × 383.515625 px, with its
bottom at y 767.953125. The footer occupies y 792.28125–853.28125, keeping the
existing bottom clearance. The settled screenshot was reviewed; the numbered
trail, all supporting sentences, offer action and footer are visible.

Desktop ArrowRight selected Reposition with the focused tab preserved, fully
opaque copy and settled connector transforms. Native forward scrolling selected
Ongoing, and reverse scrolling restored Beginning. At the settled reverse
position the chapter top was -215.578125 px, the reading panel occupied
y 384.015625–767.53125 and the trail occupied y 550.484375–747.34375. A second,
settled screenshot confirmed the complete panel and footer after the browser's
first capture briefly returned a partial paint.

## Narrow layout and keyboard

The exact preview's responsive QA frame used a 320 × 720 viewport, with 305 px
of content width after the scrollbar. The chapter used natural flow, with
zero horizontal overflow. Its reading panel remained 902.78125 px high across
Beginning, Reposition and Ongoing. The scope was 257 × 549.265625 px. Native
scrolling exposed the complete decision trail and its supporting sentences;
the final row and footer remained reachable.

End selected Ongoing and updated its action to
`/services#package-brand-partnership`. ArrowLeft selected Reposition. Copy,
scope and both connector transforms stayed settled during keyboard selection.
Tab moved to the panel, and PageDown preserved Reposition while reading.
Pausing page motion set the page motion state to reduced and left both
connector segments complete. Resume was exercised before the later keyboard
checks.

## Verification limits and shared link

Repeated browser pointer dispatch timeouts prevented capturing the connector's
subsecond draw progression. Its sequential timing and first-visibility guard
were reviewed in source; its settled state, keyboard behavior and pause state
were verified in the deployed browser. No claim is made that the intermediate
animation frames were visually certified. The browser also restricts
`/api/release`, so release identity uses deployment metadata and the source to
trigger comparison above.

The shared branch alias was rechecked after release 412 became READY. It still
resolves to release 408, deployment `dpl_H6MVbfzSVsrshPLpcMMwx8RjKEYW`. The
connected deployment tools cannot assign aliases. `preview-link-repair.md`
contains the command for attaching the existing shared link to release 412
without promoting production.
