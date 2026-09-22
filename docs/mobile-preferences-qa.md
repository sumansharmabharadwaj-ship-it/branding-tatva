# Mobile preferences and form checks — 22 September 2026

## Baseline

On release 507, the Contact form in the 320 × 720 responsive frame has no horizontal overflow. Required and optional fields measure 16px text and 48px height. The notice hides while a required input owns focus, and optional context opens and closes.

The shared preferences panel did not own scrolling: a native wheel gesture on its backdrop changed document scrollTop from 5258 to 4788 while the panel stayed open. Background content was not inert. The panel also lacked the native-scroll exception required by Lenis on utility pages. Saving a choice removed the panel without restoring focus.

## Changes

- Preferences share the scroll provider, pause it while open, and retain native scrolling inside the bounded panel.
- Background siblings become inert while the panel is open. Existing inert state, root scroll styles, and Lenis pause state are restored on close.
- Close and save both restore focus without scrolling. When a saved choice removes the original notice, focus returns to the main reading surface.
- Panel edges account for phone safe areas. Descriptions are 14px, and actions stack at narrow widths.
- The shared header now also respects horizontal safe areas at landscape-phone widths.

## Local verification

TypeScript, changed-component ESLint, homepage source checks, cursor input checks and the 106-route production build passed. No contact enquiry was submitted.

Physical iPhone/Safari and native touch input remain outside the cloud browser's available input surface. The narrow iframe checks establish responsive layout and mouse/keyboard behavior only.

## Deployed check

The original release 509 preview was canceled as stale when concurrent homepage release 510 arrived. Its source `5fd22b95fadc255bf9a834348abfbaf189e101bb` includes the preferences changes unchanged and reached READY.

On that deployed 320 × 720 frame, the panel has zero horizontal overflow, document overflow is hidden, background content is inert and the native-scroll exception is present. Repeating the 470px backdrop gesture leaves the document at scrollTop 5258. The panel is 281 × 647px with both vertical edges inside the frame.

Release 511 uses the standard CSS property reader for scrollbar gutter state so a missing browser-specific property cannot interrupt modal setup. TypeScript, ESLint and the 106-route build passed again for this correction.
