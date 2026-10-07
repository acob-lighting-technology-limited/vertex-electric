# Higgsfield prompt cards — H1 to H3

These are the first three site visuals from PLAN.md §6.1. Each card works in two stages:

1. **Key still.** Generate it with `gpt_image_2_5` (≈0.25 credits each). Make 4–6 takes, pick the best, and check it against the QA list.
2. **Motion.** Use `seedance_2_5` image-to-video to turn the approved still into the clip (≈120 credits per 10s at 1080p).

Approving stills first keeps the expensive video renders for frames we already like.

> **Credits:** the account is currently on the free plan with 10 credits, which covers stills only. Upgrade before generating video.

## Shared style key (paste into every prompt)

```
night, deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE),
cool chrome specular highlights, wet reflective surfaces, premium automotive film look,
anamorphic 35mm, shallow depth of field, tack sharp vehicle, subtle film grain
```

## QA checklist (reject a take if any fail)

- [ ] **Car must be unbadged.** No logo, wordmark, number plate or readable text anywhere on it.
- [ ] **Wheels and hardware must be coherent.** That means round wheels with a consistent spoke count, plus mirrors, door handles and lights that are symmetrical and physically plausible.
- [ ] **Blue is the only saturated colour.** No orange or green casts. A neutral warm streetlight far in the background is acceptable.
- [ ] **No people, or only small and unrecognisable figures.**
- [ ] **Leave negative space for headline text.** H1 needs the left 40% calm.
- [ ] **Looping clips only:** the first and last frames match, with no visible pop at the loop point.

## H1 — Homepage hero (desktop), 16:9, 10s loop

**Purpose:** first impression and brand statement. The headline sits on the left and the car on the right third.

### Stage 1 — key still

```bash
higgsfield generate create gpt_image_2_5 --aspect_ratio 16:9 --resolution 2k --wait --prompt "A sleek unbadged electric fastback sedan in satin graphite, three-quarter front view, driving on a long modern cable-stayed bridge over a lagoon at night, Lagos city skyline softly out of focus behind, thin electric-blue LED light lines running along the bridge rail and reflecting on the car body, car placed on the right third of the frame, calm dark negative space on the left, low camera at wheel height. night, deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE), cool chrome specular highlights, wet reflective surfaces, premium automotive film look, anamorphic 35mm, shallow depth of field, tack sharp vehicle, subtle film grain"
```

Save the chosen take as `assets/higgsfield/H1/still.png`.

### Stage 2 — motion (seamless loop)

Use the same image as the start and end frame. The camera tracks with the car, so the car stays in place while the bridge and city stream past. That gives a clean loop.

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image assets/higgsfield/H1/still.png --end-image assets/higgsfield/H1/still.png --duration 10 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --bitrate_mode high --wait --prompt "Smooth tracking shot moving alongside the car at constant speed; the car stays locked in the same position in frame while the bridge, blue rail lights and city lights stream past behind it; electric-blue light trails streak along the rail; gentle reflections slide across the car body; steady, no camera shake, continuous seamless motion"
```

## H2 — Homepage hero (mobile), 9:16, 10s loop

This is the same scene, recomposed vertically. The car sits in the lower half, leaving room for the headline at the top.

### Stage 1 — key still

```bash
higgsfield generate create gpt_image_2_5 --aspect_ratio 9:16 --resolution 2k --wait --prompt "A sleek unbadged electric fastback sedan in satin graphite, front three-quarter view, on a modern cable-stayed bridge at night, cable stays rising into the dark sky above, Lagos skyline lights soft in the distance, thin electric-blue LED lines along the rail reflecting on the car, car in the lower half of a vertical frame, dark calm sky in the upper half for text. night, deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE), cool chrome specular highlights, wet reflective surfaces, premium automotive film look, anamorphic 35mm, shallow depth of field, tack sharp vehicle, subtle film grain"
```

### Stage 2 — motion

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image assets/higgsfield/H2/still.png --end-image assets/higgsfield/H2/still.png --duration 10 --resolution 1080p --aspect_ratio 9:16 --generate_audio false --bitrate_mode high --wait --prompt "Smooth tracking shot moving with the car; the car stays locked in place in frame while bridge cables and blue rail lights stream past; light trails streak along the rail; steady, continuous seamless motion"
```

**Fallback if the vertical render drifts:** use the `reframe` workflow on the approved H1 clip instead (see the higgsfield-generate skill's `references/workflows.md`).

## H3 — "Why EV" scroll-scrub orbit, 16:9, 6s

**Purpose:** a slow camera orbit that the user scrubs by scrolling. It is **not** a loop. I'll extract about 90 frames from it for the canvas sequence.

### Stage 1 — key still

```bash
higgsfield generate create gpt_image_2_5 --aspect_ratio 16:9 --resolution 2k --wait --prompt "A sleek unbadged electric fastback sedan in satin graphite parked in an infinite black studio, front three-quarter view, a single thin electric-blue rim light tracing the roofline and shoulder line, glossy black floor with a soft mirror reflection, car centred with generous space around it, minimal, sculptural, product-film lighting. deep graphite and black palette, the only accent light is electric blue (#0050FD to #0072FE), cool chrome specular highlights, premium automotive film look, 50mm, tack sharp vehicle"
```

### Stage 2 — motion

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image assets/higgsfield/H3/still.png --duration 6 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --bitrate_mode high --wait --prompt "The camera orbits slowly and smoothly around the stationary car from the front three-quarter view to the side profile and on to the rear three-quarter view, constant angular speed, the blue rim light sweeps across the body panels as the angle changes, floor reflection stays consistent, no cuts"
```

**Extra QA for H3:** the car's proportions must not morph during the orbit. Check the wheelbase, roofline and lights frame by frame.

## Handoff

Put the approved files at these paths:

```
assets/higgsfield/H1/still.png  H1/clip.mp4
assets/higgsfield/H2/still.png  H2/clip.mp4
assets/higgsfield/H3/still.png  H3/clip.mp4
```

I then do the following:

- **Encode:** AV1 + H.264 fallback, with 720p mobile and 1080p desktop variants.
- **Posters:** extract AVIF poster frames. The poster is the LCP element, and video loads after idle.
- **H3 sequence:** export H3 as a WebP frame sequence for the scroll scrub.
- **Wire up:** connect everything to `prefers-reduced-motion` and `Save-Data` fallbacks.
