#!/usr/bin/env bash
# Generate key-still takes for H1–H3 (docs/higgsfield/prompt-cards.md).
# Usage: bash scripts/higgsfield/gen-stills.sh [takes-per-shot]
set -uo pipefail
cd "$(dirname "$0")/../.."
TAKES="${1:-4}"

STYLE="night, deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE), cool chrome specular highlights, wet reflective surfaces, premium automotive film look, anamorphic 35mm, shallow depth of field, tack sharp vehicle, subtle film grain"

H1="A sleek unbadged electric fastback sedan in satin graphite, three-quarter front view, driving on a long modern cable-stayed bridge over a lagoon at night, Lagos city skyline softly out of focus behind, thin electric-blue LED light lines running along the bridge rail and reflecting on the car body, car placed on the right third of the frame, calm dark negative space on the left, low camera at wheel height. $STYLE"
H2="A sleek unbadged electric fastback sedan in satin graphite, front three-quarter view, on a modern cable-stayed bridge at night, cable stays rising into the dark sky above, Lagos skyline lights soft in the distance, thin electric-blue LED lines along the rail reflecting on the car, car in the lower half of a vertical frame, dark calm sky in the upper half for text. $STYLE"
H3="A sleek unbadged electric fastback sedan in satin graphite parked in an infinite black studio, front three-quarter view, a single thin electric-blue rim light tracing the roofline and shoulder line, glossy black floor with a soft mirror reflection, car centred with generous space around it, minimal, sculptural, product-film lighting. deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE), cool chrome specular highlights, premium automotive film look, 50mm, tack sharp vehicle"

gen() { # shot aspect prompt take
  local out="assets/higgsfield/$1/take-$4.png"
  [ -f "$out" ] && return 0
  local json url
  json=$(higgsfield generate create gpt_image_2_5 --aspect_ratio "$2" --resolution 2k --quality high --prompt "$3" --wait --json 2>&1)
  url=$(printf '%s' "$json" | grep -oE 'https://[^"]+\.(png|jpg|jpeg|webp)' | head -1)
  if [ -z "$url" ]; then echo "FAILED $1 take $4: $(printf '%s' "$json" | tail -c 400)"; return 1; fi
  curl -sSL "$url" -o "$out" && echo "ok $out"
}

mkdir -p assets/higgsfield/H1 assets/higgsfield/H2 assets/higgsfield/H3
for i in $(seq 1 "$TAKES"); do
  gen H1 16:9 "$H1" "$i" &
  gen H2 9:16 "$H2" "$i" &
  gen H3 16:9 "$H3" "$i" &
  wait
done
echo DONE
