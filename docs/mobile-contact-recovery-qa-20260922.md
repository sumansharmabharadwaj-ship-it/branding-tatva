# Mobile enquiry readability and validation

## Baseline observed

The production responsive QA frame at `/qa/homepage-responsive?preset=narrow&path=%2Fcontact%23write` rendered Contact at 320 × 720. The form panel measured about 256px wide. Its note caption was 9.6px, completion count 10.4px, and three field navigation labels 10.88px.

Selecting Send enquiry with all required fields empty exercised client validation. The 215px recovery panel kept the warning icon, sentence, and review button in one row. The sentence received only 31.64px of width and wrapped to 136.5px tall, beside a 109.36px button. No completed enquiry was sent.

## Changes

- Give the validation sentence and review action separate rows below 768px, with a flexible text column that can shrink safely.
- Raise phone form labels, hints, field errors and recovery actions to 14px. Use normal sentence casing for error explanations.
- Raise progress labels, completion count, form eyebrow and draft status to 12px. Let the progress caption wrap onto another row when necessary.
- Preserve the field associations, focus handlers, delivery logic, motion alternatives and 44px recovery tap targets.

## Validation and release boundary

TypeScript, targeted ESLint, the full Contact contract/delivery/media/motion/copy gates, sun cursor input checks, typography gate and production build passed (106 routes). The typography gate still reports existing baseline debt elsewhere; this pass introduces no new violations.

The browser evidence above is the production baseline, not post-change acceptance. The new styles remain pending a fresh preview, including narrow phones, enlarged text, long optional-field errors and physical iPhone/Safari keyboard checks.

Current shared deployment controls preserve Vercel's rejection at 2026-09-22T12:23:50Z and its instruction to retry in 24 hours. The next permitted check is after 2026-09-23T12:23:50Z (17:53:50 IST), subject to any newer provider rejection. This timestamp does not guarantee quota availability. No deployment retry, plan upgrade, deployment deletion or production promotion was requested by this pass.
