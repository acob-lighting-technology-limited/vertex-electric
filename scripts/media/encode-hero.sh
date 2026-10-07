#!/usr/bin/env bash
# Encode approved Higgsfield finals for the web (requires ffmpeg with libsvtav1 + libx264).
#   H1 desktop loop  -> public/media/hero/h1-1080.{av1,h264}.mp4 + poster from frame 0
#   H2 mobile loop   -> public/media/hero/h2-720.{av1,h264}.mp4  + poster from frame 0
#   H3 orbit         -> public/media/h3/{1280,720}/f-NNN.webp frame sequence for the scroll scrub
# Usage: bash scripts/media/encode-hero.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
IN=assets/higgsfield
OUT=public/media
mkdir -p "$OUT/hero" "$OUT/h3/1280" "$OUT/h3/720"

loop() { # src dst-base scale-filter
  ffmpeg -v error -y -i "$1" -an -vf "$3" -c:v libsvtav1 -crf 44 -preset 6 -g 240 -pix_fmt yuv420p -movflags +faststart "$2.av1.mp4"
  ffmpeg -v error -y -i "$1" -an -vf "$3" -c:v libx264 -crf 28 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart "$2.h264.mp4"
}

if [ -f "$IN/H1/final.mp4" ]; then
  loop "$IN/H1/final.mp4" "$OUT/hero/h1-1080" "scale=1920:-2"
  ffmpeg -v error -y -i "$IN/H1/final.mp4" -frames:v 1 -vf "scale=2400:-2" -c:v libwebp -quality 78 "$OUT/hero/h1-2400.webp"
fi
seamless() { # src dst fade-seconds: crossfade the tail into the head so the last frame flows into the first
  local len main
  len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  main=$(python -c "print(round($len - $3, 3))")
  ffmpeg -v error -y -i "$1" -an -filter_complex \
    "[0]split[a][b];[a]trim=start=$3,setpts=PTS-STARTPTS[main];[b]trim=0:$3,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=$3:offset=$(python -c "print(round($main - $3, 3))")" \
    -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p "$2"
}

if [ -f "$IN/H2/final.mp4" ]; then
  # H2's end frame drifts from its start (seam ≈3× a normal frame step), so crossfade the loop point.
  seamless "$IN/H2/final.mp4" "$IN/H2/final-loop.mp4" 0.8
  loop "$IN/H2/final-loop.mp4" "$OUT/hero/h2-720" "scale=720:-2"
  ffmpeg -v error -y -i "$IN/H2/final.mp4" -frames:v 1 -vf "scale=1080:-2" -c:v libwebp -quality 78 "$OUT/hero/h2-1080.webp"
fi
if [ -f "$IN/H3/final.mp4" ]; then
  rm -f "$OUT"/h3/1280/*.webp "$OUT"/h3/720/*.webp
  ffmpeg -v error -y -i "$IN/H3/final.mp4" -vf "fps=12,scale=1280:-2" -c:v libwebp -quality 70 "$OUT/h3/1280/f-%03d.webp"
  ffmpeg -v error -y -i "$IN/H3/final.mp4" -vf "fps=12,scale=720:-2" -c:v libwebp -quality 68 "$OUT/h3/720/f-%03d.webp"
fi

ls -la "$OUT/hero"
echo "h3 frames: $(ls "$OUT/h3/1280" | wc -l)"
du -sh "$OUT/h3/1280" "$OUT/h3/720" 2>/dev/null || true
