#!/usr/bin/env bash
# Final Seedance 2.5 renders for H1–H3 from the approved stills (≈312 credits).
# Usage: bash scripts/higgsfield/final-render.sh
set -uo pipefail
cd "$(dirname "$0")/../.."

run() { # shot still aspect duration loop(yes/no) prompt
  local out="assets/higgsfield/$1/final.mp4" end=()
  [ -f "$out" ] && { echo "skip $out"; return 0; }
  [ "$5" = yes ] && end=(--end-image "$2")
  local json url
  json=$(higgsfield generate create seedance_2_5 --mode omni_reference --start-image "$2" "${end[@]}" \
    --aspect_ratio "$3" --duration "$4" --resolution 1080p --generate_audio false --bitrate_mode high \
    --prompt "$6" --wait --wait-timeout 40m --json 2>&1)
  url=$(printf '%s' "$json" | grep -oE 'https://[^"]+\.mp4' | head -1)
  if [ -z "$url" ]; then echo "FAILED $1: $(printf '%s' "$json" | tail -c 600)"; return 1; fi
  curl -sSL "$url" -o "$out" && echo "ok $out"
}

run H1 assets/higgsfield/H1/take-2.png 16:9 10 yes "Smooth tracking shot moving alongside the car at constant speed; the car stays locked in the same position in frame while the bridge, blue rail lights and city lights stream past behind it; electric-blue light trails streak along the rail; gentle reflections slide across the car body; steady, no camera shake, continuous seamless motion" &
run H2 assets/higgsfield/H2/take-2.png 9:16 10 yes "Smooth tracking shot moving with the car; the car stays locked in place in frame while bridge cables and blue rail lights stream past; light trails streak along the rail; steady, continuous seamless motion" &
run H3 assets/higgsfield/H3/take-1.png 16:9 6 no "The camera orbits slowly and smoothly around the stationary car from the front three-quarter view to the side profile and on to the rear three-quarter view, constant angular speed, the blue rim light sweeps across the body panels as the angle changes, floor reflection stays consistent, no cuts" &
wait
echo DONE
