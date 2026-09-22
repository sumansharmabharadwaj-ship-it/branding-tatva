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

The closing consultation agenda now has three native disclosure buttons. Each reveals a practical preparation question in the same row; selecting another step closes the previous question. A second activation restores the original description. The row reserves room for both readings so switching does not change its natural height. Pointer activation uses a small vertical transition and arrow rotation; keyboard activation and motion pause settle the reading and highlight immediately. Visible keyboard focus scrolls into the reading viewport when necessary. Explicit selections receive a polite screen-reader announcement. Scrolling resumes the decorative progress highlight without replacing the visitor's chosen question. The booking and project-proof links retain their destinations.

## Verification completed

- TypeScript and changed-component ESLint passed.
- The production build passed for all 105 routes against main source 8de5563d plus the saved homepage changes.
- The generated homepage HTML contains exactly one next-step link in each of the six answers. The first answer is open; the remaining five are aria-hidden and inert.
- The #process and #evidence destinations are unique and have tabindex=-1. The built Contact page contains #call. The Services source contains #offerings and #audit.
- The earlier decision-trail preview, source 5fd22b95, was browser-checked at desktop and 320px phone widths. All six stage advances updated the reading, and the desktop frame stayed 936px high. Keyboard previous retained focus at stage zero. End selected the last tab, and revisit returned to the first. Motion pause settled the trail and copy. The narrow frame had no horizontal overflow, with controls measuring 44px and approximately 59px high.
- The consultation update passed TypeScript, changed-component ESLint, and the 105-route production build with main source af9406ac merged into the saved homepage branch.
- Generated HTML contains three uniquely identified native buttons, each linked to a hidden, named question region. Sizing copies are aria-hidden and inert. The announcement starts empty, the default booking destination remains /contact#call, and all six FAQ action links remain present.

## Remaining acceptance

The newly added FAQ actions and consultation choices have build and rendered-markup checks, not a hosted interaction pass. The final combined preview must still check the FAQ links, keyboard expansion and collapse, focus after fragment navigation, narrow and short viewports, reverse scrolling, and pause/resume. For the consultation, check opening, switching, and closing all three questions with pointer and keyboard; compare row and frame heights before and after each switch; confirm focus remains clear of the fixed dock; and pause an active transition. It must also retest the project trail with the newer media-controller fix from main. Physical iPhone/Safari checks remain outstanding.

## Publishing blocker

Vercel rejected release 512 trigger 5b187a65fa8a62cab94157bdec31045915cf3938 at 2026-09-22T11:23:55Z with: "Deployment rate limited — retry in 24 hours."

The latest checked main source a19811c3bf4b0a81a06440eadb8618db053ab8ac still reports the same failure at 2026-09-22T12:09:39Z. The 24-hour interval is the provider's retry guidance, not a guarantee that quota will then be available.

Save ordinary source commits while blocked. Leave vercel-preview-release.json and the controlled deployment configuration unchanged. Once builds are allowed, request one deliberate preview of the current combined branch, verify the exact ready deployment, then publish only the reviewed homepage files over the latest main source. Check the live /api/release response before reporting publication.
