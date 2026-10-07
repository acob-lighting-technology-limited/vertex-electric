# Vertex Electric Solutions — website

The public site for **Vertex Electric Solutions Limited** (RC 9872444), the ACOB Group e-mobility company that sources EVs from China and other markets and sells them in Nigeria.

- Plan and decisions: [PLAN.md](PLAN.md)
- Higgsfield shot prompts: [docs/higgsfield/prompt-cards.md](docs/higgsfield/prompt-cards.md)

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · motion · Sanity v6 (embedded Studio at `/studio`)

## Getting started

```bash
npm install
cp .env.example .env.local   # add the Sanity project ID once it exists
npm run dev
```

| Route | What it is |
|---|---|
| `/` | Phase 0 holding page. The cinematic hero replaces it in Phase 1. |
| `/brand` | Living brand system: logo variants, colour tokens, contrast, type and controls |
| `/studio` | Sanity Studio. Shows a setup notice until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set. |

## Layout

```
src/
  app/            routes — (site) group carries the header/footer; studio has no site chrome
  ui/             @vertex/ui — tokens, logo, theme, primitives. Shared with the future Vertex EV Hub site.
  sanity/         schemas (vehicle, carModel, siteSettings, photo/licensed-image types), Studio structure
public/brand/     SVG logo files (generated)
scripts/brand/    logo tracing + build pipeline
docs/higgsfield/  prompt cards for site visuals
```

## Logo

The SVG logo is traced from the supplied raster, so the client artwork stays the source of truth. To regenerate it:

```bash
python scripts/brand/trace-logo.py <client-logo.png> scripts/brand/logo-trace.json
python scripts/brand/build-logo.py
```

You need Python 3 with `opencv-python`, `pillow` and `potracer`. The build writes `public/brand/*.svg` and `src/ui/brand/logo-paths.ts`.

## Rules baked into the content model

- **Prices are never public.** `vehicle.internal.priceNgn` is staff-only. Public GROQ queries must use explicit projections that exclude `internal`.
- **The import-status tracker is off by default.** It shows only when both the Site settings master switch and the per-car toggle are on.
- **Stock photos must be real photos of that exact car.** Publishing is blocked until number plates are confirmed obscured.
- **Model-level imagery must be licensed.** A source is required, and third-party images also need a licence reference.
