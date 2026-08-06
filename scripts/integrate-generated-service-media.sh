#!/usr/bin/env bash
set -euo pipefail

command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
mkdir -p public/images/generated

stems=(
  bt-services-hero-root-system
  bt-services-strategy-topography
  bt-services-health-reflection
)

for stem in "${stems[@]}"; do
  input="public/videos/generated/${stem}.mp4"
  desktop_tmp="public/videos/generated/${stem}-desktop.tmp.mp4"
  mobile="public/videos/generated/${stem}-mobile.mp4"
  poster="public/images/generated/${stem}-poster.jpg"

  test -s "$input"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -an \
    -vf "fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset medium -crf 22 -profile:v high -level 4.1 \
    -pix_fmt yuv420p -g 48 -keyint_min 48 -sc_threshold 0 \
    -movflags +faststart \
    "$desktop_tmp"
  mv "$desktop_tmp" "$input"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -an \
    -vf "fps=24,scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset medium -crf 25 -profile:v main -level 3.1 \
    -pix_fmt yuv420p -g 48 -keyint_min 48 -sc_threshold 0 \
    -movflags +faststart \
    "$mobile"

  ffmpeg -hide_banner -loglevel error -y \
    -ss 1 -i "$input" -frames:v 1 -q:v 2 "$poster"

  duration="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input")"
  python -c 'import sys; d=float(sys.argv[1]); assert 4.0 <= d <= 7.0, f"Unexpected loop duration: {d:.3f}s"' "$duration"
done

sha256sum public/videos/generated/*.mp4 > public/videos/generated/SHA256SUMS.txt
python scripts/integrate-generated-service-media.py

ls -lh public/videos/generated public/images/generated
