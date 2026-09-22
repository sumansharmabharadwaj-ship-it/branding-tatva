# Homepage interaction release: 22 September 2026

## Saved implementation

The project journey has a reversible six-stage decision trail. Previous, next, and revisit controls update the selected tab, stage reading, and the explanation of what carries forward. The first previous control uses aria-disabled so returning to the first stage preserves keyboard focus. Keyboard activation and motion pause settle the trail immediately.

The homepage questions now link each answer to the relevant next step:

| Question | Destination |
| --- | --- |
| New business | /services#offerings |
| Existing identity | /services#audit |
| Implementation | #evidence |
| Cost | /services#offerings |
| Timing | #process |
| Remote work | /contact#call |

The links have hover feedback and a minimum 44px target height. Closed answers retain their inert boundary. Keyboard activation reveals the answer without entrance or height animation; focus removes the row's decorative scroll reveal. Pause settles the expanded height and decorative line. The process fragment destination is programmatically focusable. FAQ answer text and its structured-data source remain unchanged.

## Verification completed

- TypeScript and changed-component ESLint passed.
- The production build passed for all 105 routes against main source 8de5563d plus the saved homepage changes.
- The generated homepage HTML contains exactly one next-step link in each of the six answers. The first answer is open; the remaining five are aria-hidden and inert.
- The #process and #evidence destinations are unique and have tabindex=-1. The built Contact page contains #call. The Services source contains #offerings and #audit.
- The earlier decision-trail preview, source 5fd22b95, was browser-checked at desktop and 320px phone widths. All six stage advances updated the reading, and the desktop frame stayed 936px high. Keyboard previous retained focus at stage zero. End selected the last tab, and revisit returned to the first. Motion pause settled the trail and copy. The narrow frame had no horizontal overflow, with controls measuring 44px and approximately 59px high.

## Remaining acceptance

The newly added FAQ actions have build and rendered-markup checks, not a hosted interaction pass. The final combined preview must still check the FAQ links, keyboard expansion and collapse, focus after fragment navigation, narrow and short viewports, reverse scrolling, and pause/resume. It must also retest the project trail with the newer media-controller fix from main. Physical iPhone/Safari checks remain outstanding.

## Publishing blocker

Vercel rejected release 512 trigger 5b187a65fa8a62cab94157bdec31045915cf3938 at 2026-09-22T11:23:55Z with: "Deployment rate limited — retry in 24 hours."

The suggested retry window starts around 23 September at 16:54 IST. This is the provider's retry guidance, not a guarantee that quota will then be available. Main source 8de5563d also reports the build-rate-limit failure.

Save ordinary source commits while blocked. Leave vercel-preview-release.json and the controlled deployment configuration unchanged. Once builds are allowed, request one deliberate preview of the current combined branch, verify the exact ready deployment, then publish only the reviewed homepage files over the latest main source. Check the live /api/release response before reporting publication.
