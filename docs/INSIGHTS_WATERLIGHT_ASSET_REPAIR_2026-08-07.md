# Insights waterlight poster repair

- Date: 7 August 2026
- Status: restored from existing approved repository media
- Public path: `/images/cinematic-waterlight-poster.jpg`
- Repository target: `public/images/cinematic-waterlight-poster.jpg`
- Approved source reused: `public/images/cinematic-ridge-poster.jpg`
- MIME: `image/jpeg`
- Bytes: `23557`
- Target SHA-256: `28f8e6d57d9266aa1364e0e172c847d63686a26f544eedc74c9be4abf48cb0c9`
- Source SHA-256: `28f8e6d57d9266aa1364e0e172c847d63686a26f544eedc74c9be4abf48cb0c9`

## Source references

```text
.github/workflows/certify-insights-waterlight-release-v2.yml:39:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/certify-insights-waterlight-release-v2.yml:52:              if grep -q 'public/images/cinematic-waterlight-poster.jpg' "$workflow"; then
.github/workflows/certify-insights-waterlight-release.yml:39:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/certify-insights-waterlight-release.yml:46:            media_filters="$(grep -l 'public/images/cinematic-waterlight-poster.jpg' \
.github/workflows/finalize-insights-waterlight-repair-v2.yml:34:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/finalize-insights-waterlight-repair-v2.yml:61:          const mediaPath = '      - public/images/cinematic-waterlight-poster.jpg';
.github/workflows/finalize-insights-waterlight-repair-v2.yml:65:            if (!content.includes('public/images/cinematic-waterlight-poster.jpg')) {
.github/workflows/finalize-insights-waterlight-repair.yml:34:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/finalize-insights-waterlight-repair.yml:48:          const mediaPath = '      - public/images/cinematic-waterlight-poster.jpg';
.github/workflows/insights-final-certification.yml:23:      - public/images/cinematic-waterlight-poster.jpg
.github/workflows/insights-final-certification.yml:72:          test -s public/images/cinematic-waterlight-poster.jpg
.github/workflows/insights-final-certification.yml:74:            -of csv=s=x:p=0 public/images/cinematic-waterlight-poster.jpg \
.github/workflows/repair-insights-final-macos-validation.yml:41:          test -s public/images/cinematic-waterlight-poster.jpg
.github/workflows/repair-insights-final-macos-validation.yml:43:            -of csv=s=x:p=0 public/images/cinematic-waterlight-poster.jpg \\
.github/workflows/repair-insights-final-macos-validation.yml:48:          test -s public/images/cinematic-waterlight-poster.jpg
.github/workflows/repair-insights-final-macos-validation.yml:49:          file public/images/cinematic-waterlight-poster.jpg | grep -Eqi 'JPEG|image data'
.github/workflows/repair-insights-final-macos-validation.yml:50:          width="$(sips -g pixelWidth public/images/cinematic-waterlight-poster.jpg | awk '/pixelWidth/ {print $2}')"
.github/workflows/repair-insights-final-macos-validation.yml:51:          height="$(sips -g pixelHeight public/images/cinematic-waterlight-poster.jpg | awk '/pixelHeight/ {print $2}')"
.github/workflows/repair-insights-final-macos-validation.yml:56:              if 'sips -g pixelWidth public/images/cinematic-waterlight-poster.jpg' in content:
.github/workflows/repair-insights-waterlight-poster-v2.yml:33:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/repair-insights-waterlight-poster-v2.yml:85:          references="$(git grep -n -F '/images/cinematic-waterlight-poster.jpg' -- ':!docs/INSIGHTS_WATERLIGHT_ASSET_REPAIR_2026-08-07.md' || true)"
.github/workflows/repair-insights-waterlight-poster-v2.yml:95:            echo '- Public path: `/images/cinematic-waterlight-poster.jpg`'
.github/workflows/repair-insights-waterlight-poster.yml:41:          target="public/images/cinematic-waterlight-poster.jpg"
.github/workflows/repair-insights-waterlight-poster.yml:133:            echo "Could not restore a valid poster for /images/cinematic-waterlight-poster.jpg" >&2
.github/workflows/repair-insights-waterlight-poster.yml:147:          git add public/images/cinematic-waterlight-poster.jpg
.github/workflows/seal-insights-final-source.yml:46:            if [ -s public/images/cinematic-waterlight-poster.jpg ] && \
.github/workflows/seal-insights-final-source.yml:48:                -of csv=s=x:p=0 public/images/cinematic-waterlight-poster.jpg | grep -Eq '^[0-9]+x[0-9]+$'; then
.github/workflows/seal-insights-final-source.yml:52:            if grep -q 'sips -g pixelWidth public/images/cinematic-waterlight-poster.jpg' \
.github/workflows/seal-insights-final-source.yml:79:            poster: "/images/cinematic-waterlight-poster.jpg",
.github/workflows/trigger-insights-gates-after-poster.yml:43:            if [ -s public/images/cinematic-waterlight-poster.jpg ] && \
.github/workflows/trigger-insights-gates-after-poster.yml:45:                -of csv=s=x:p=0 public/images/cinematic-waterlight-poster.jpg | grep -Eq '^[0-9]+x[0-9]+$'; then
.github/workflows/trigger-insights-gates-after-poster.yml:61:          // includes a valid /images/cinematic-waterlight-poster.jpg asset.
.github/workflows/trigger-insights-gates-after-poster.yml:65:            poster: "/images/cinematic-waterlight-poster.jpg",
```

No new external stock file was introduced. The repaired path reuses an image already approved and committed in this repository.
