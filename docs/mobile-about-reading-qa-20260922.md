# About mobile reading follow-up — 22 September 2026

## Observed issue

The READY release 510 source preview (`5fd22b95fadc255bf9a834348abfbaf189e101bb`) was inspected in the 320 × 720 responsive frame using native browser navigation and the site's motion toggle.

In reduced-motion mode, the brand-system chapter inherited its desktop two-column card layout. Each card was only 135.7px wide; its icon left 64–88px for the text. Body text was 11.2px, individual cards overflowed by up to 24px, and the chapter clipped the right edge. The normal-motion mobile panel used 12.16px body text and 9.6px tab labels.

The same inspection found 12.16px reading paragraphs in the synthesis chapter, 12.8px case evidence, and 9.28px evidence links. The glossary index had no horizontal overflow at this width and was left unchanged.

## Changes

- The reduced-motion brand-system cards use one column at phone widths, with icons above their copy on small phones. The mobile rules take precedence over the desktop reduced-motion styles.
- Both versions of the brand-system chapter use 16px body text. Tab labels and supporting labels are 12px; tab text can wrap instead of being truncated.
- The synthesis, evidence and closing chapters use 16px reading paragraphs, larger supporting text and 14px links with 44px minimum height.
- Reduced-motion evidence cards retain their spacing, and narrow grid children can shrink within the available width.

Only four lower About CSS modules changed. The opening scene and cursor implementation are unchanged.

## Verification and limits

- TypeScript, the production build with 106 routes, the About resolution source gate, the cursor input gate and whitespace checks passed.
- The About journey source gate stops at a pre-existing stale assertion. It expects the old Contact-only hash-recovery guard and `behavior: "auto"`; the unchanged scroll provider now also excludes Home and uses `behavior: "instant"`. Both the gate and provider are identical to the parent revision. This pass does not change that gate or claim it passed.
- The existing cursor check simulates touch, pen, hybrid mouse, gesture cancellation and motion preferences. It is not a physical-device test.
- The controlled-preview statuses for releases 512 and 513 report Vercel's build-rate limit. These CSS changes are saved for review without requesting another deployment. Post-change browser checks, physical iPhone/Safari and native-touch acceptance remain pending.
- The browser measurements above describe the deployed baseline, not a visual verification of the new CSS. The permanent review alias is still not verified against this change.
