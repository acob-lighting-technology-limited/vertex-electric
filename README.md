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

## Environment

- **`.env`** is committed and holds only public, non-secret defaults: the WhatsApp, phone and contact email.
- **`.env.local` and host settings** hold secrets and per-environment values. See `.env.example`.
- **Lead forms** deliver by email once `RESEND_API_KEY`, `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` are set. Until then they tell the visitor that online enquiries aren't live yet.

## Media pipelines

| Script | What it does |
|---|---|
| `scripts/inventory/process-photos.py <dir> VX-000N` | Processes real stock photos into `public/inventory/<stock>/`: blurs plates (automatic for green NEV plates, plus the manual boxes in `manual-redactions.json`), strips EXIF and writes WebP plus `manifest.json`. **Review the debug sheet before publishing.** |
| `scripts/higgsfield/gen-stills.sh` | Generates key-still takes for H1–H3 |
| `scripts/higgsfield/motion-test.sh` | Runs cheap Seedance Mini motion tests |
| `scripts/higgsfield/final-render.sh` | Renders the Seedance 2.5 finals |
| `scripts/media/encode-hero.sh` | Encodes the hero loops as AV1 + H.264 with posters, and exports the H3 frames for the scroll-scrub |

## Rules baked into the content model

- **Prices are never public.** `vehicle.internal.priceNgn` is staff-only. Public GROQ queries must use explicit projections that exclude `internal`.
- **The import-status tracker is off by default.** It shows only when both the Site settings master switch and the per-car toggle are on.
- **Stock photos must be real photos of that exact car.** Publishing is blocked until number plates are confirmed obscured.
- **Model-level imagery must be licensed.** A source is required, and third-party images also need a licence reference.
