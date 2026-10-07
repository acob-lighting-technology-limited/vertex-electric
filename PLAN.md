# Vertex Electric Solutions — Website Plan

**Entity:** Vertex Electric Solutions Limited · RC 9872444 · incorporated 18 Sep 2026 (CAC, Abuja)
**Role in group:** E-Mobility subsidiary under the ACOB Group hybrid holding model (per *ACOB Group Expansion & Digital Infrastructure Strategy 2026*)
**Primary domain (per strategy §2.2):** `vertexevsolutions.com` · alts `vertexelectricsolutions.com`, `vertexevmotors.com`
**Stack (per strategy §6):** Next.js + Sanity CMS + Vercel + GitHub, DNS/SSL on Cloudflare, mail on Zoho
**Prepared:** 5 Oct 2026

---

## 1. What we're actually building

Vertex sources EVs from China and other markets and sells them in Nigeria. It works two ways: **cars held in stock** in a **physical showroom**, and **cars ordered on request**.

Current units:

| # | Vehicle | Media |
|---|---|---|
| 1 | **Xiaomi SU7**, grey, ~10,792 km | `Downloads/md/car 1`: 10 photos, 2 videos |
| 2 | Black boxy SUV, cream interior (**model to confirm**) | WhatsApp only: 2:00 video + 10 photos. Not yet in `car 2`. |
| 3 | Black sport sedan, cream interior (**model to confirm**) | WhatsApp only: 4+ photos. Not yet in `car 3`. |

So this is not a brochure site. It's a **premium EV dealership storefront**. It has to do three jobs:

1. **Sell the idea.** EVs in Nigeria are new, and buyers need confidence about range, charging, power supply and after-sales.
2. **Sell specific cars.** Each car needs a detailed listing with real photos. **Prices are not public.** Every listing ends in "Request price", which is a lead form.
3. **Capture leads where Nigerians actually buy.** That means WhatsApp first, then phone, then the quote form, then showroom visits.

### Decisions locked (5 Oct 2026)

| Topic | Decision |
|---|---|
| Business model | Stock cars **and** order-on-request |
| Sourcing | China plus other markets |
| Pricing | **Hidden.** "Request price" form on every car. |
| Import-status tracker | **Built but switched off** behind a CMS toggle. Turn it on later per car. |
| Range planner ("Will an EV work for me?") | **Yes**, phase 3 |
| Charging | Vertex EV Hub is a **separate site, built later**. This site links to it and shares design components with it. |
| Showroom | **Yes.** Map, opening hours, "Book a viewing". |
| Logo | **Redraw as SVG** (Phase 0) |
| Higgsfield | **Site visuals**, both video and stills: hero, section backgrounds, transitions, mood. **Not** the inventory photos. |

## 2. Brand & theming (taken from the logo)

| Token | Value | Source |
|---|---|---|
| `--vx-ink` | `#020202` | Logo letterforms (glossy black) |
| `--vx-blue-600` | `#0050FD` | Logo "V"/"X" blade, deep end |
| `--vx-blue-400` | `#0072FE` | Logo blade, bright end |
| Blade gradient | `linear-gradient(135deg, #0050FD, #0072FE)` | The V and X strokes |
| `--vx-paper` | `#FEFEFE` | Logo ground |
| Chrome bevel | 1px light inner stroke on dark shapes | Logo letter edges |

**Design language:**
- **Default to dark.** The ground is near-black graphite, the blade-blue is the only accent, and the bright parts come from the cars' own reflections. A light theme also ships, because the logo is designed on white and it gets used on documents.
- **The angled blade becomes the motif.** It shows up as section dividers, button hover sweeps, the progress bar and the image-mask reveals. The logo's 135° slash is the signature.
- **Type:** a wide, squared display face that echoes the wordmark. Candidates: *Michroma*/*Orbitron* are too sci-fi; I'd go with **Unbounded** or **Space Grotesk** for headings and **Inter** for body, then confirm against the wordmark.
- **Contrast:** `#0050FD` on `#020202` comes out around 3.3:1. That works for large headings and icons but **fails AA for body text**. Body links on dark use the lighter `#4D8DFF`, and blue-on-black never carries small text.

**Logo work needed first.** The supplied logo is a 2138×735 raster on a white background. It needs redrawing as an **SVG** in three versions: full colour on light, reversed on dark, and a mono blade mark for the favicon, app icon and watermark. Every later step depends on this.

## 3. What we reuse from the existing repos

| From | Reuse | Adapt |
|---|---|---|
| **ACOB-Website** | Sanity Studio setup, `seo.ts` schema, `structured-data.tsx`, `next-sitemap`, Resend contact flow, `/api/chat` (Groq "ACOBot") pattern, `lightbox`, `carousel`, `animated-counter`, `section-header`, `skip-navigation`, `FadeIn`/`MaskText`/`StaggerChildren`, AI field generators (`generate-product-fields.ts`), husky + commitlint + prettier config | `product.ts` schema → **`vehicle`** schema (Section 5). The chatbot gets an EV knowledge base instead of a solar one. |
| **acob-ecosystem** | Tailwind v4 token architecture (`globals.css` light/dark variables + `@custom-variant dark`), `theme-toggle`, `theme-provider`, `social-dock`, `motion` (v13) usage, Next 16.3 baseline | `neon-mesh.tsx` canvas → a **blue "charge-field" background** for the hero fallback/loading state |
| **ACOB-Signature-Creator (Matrix)** | Email-signature generator → **Vertex staff signatures** with the new brand. Upstash rate limiting for the lead and chat APIs. The `qrcode` lib for printable car window stickers that link to the listing. `ui:audit` script pattern. | Its fleet module (`api/fleet`) is internal booking. Don't couple to it. Leads can feed Matrix later if management wants one CRM. |

**Pushback on reuse:** don't fork ACOB-Website wholesale. It carries solar-specific taxonomy, SharePoint integration, four-language i18n and a lot of legacy code. Start with a **clean Next 16 app** and copy the specific files listed above.

There's a second reason. Strategy §2.2 also lists **Vertex EV Hub Limited** (`vertexevhub.com`, charging). Put the Vertex tokens and components in a small shared package (`@vertex/ui`, as a folder inside the repo for now) so the EV Hub site can use them later without a second rebuild.

## 4. Site map

```
/                      Hero film → "Why EV in Nigeria" → featured inventory → charging & solar → trust → CTA
/inventory             In-stock cars: filterable grid (make, model, year, body type, range, "in showroom" / "arriving")
/inventory/[slug]      Vehicle detail page (VDP) — the money page; CTA = Request price
/models/[model]        Evergreen model pages (e.g. Xiaomi SU7) — SEO landing, licensed 360/studio media, spec sheet
/order                 "Order on request" — buyer picks model/spec/colour/budget band, Vertex replies with a quote
/showroom              Address, map, hours, Book a viewing / test drive
/charging              Home charging (ACOB Lighting solar tie-in) + teaser/link to Vertex EV Hub (separate site, later)
/ownership             Warranty, servicing, parts, battery health reports, financing partners
/about                 Vertex, ACOB Group parentage, CAC RC 9872444, team
/contact               WhatsApp, phone, showroom map, form
/journal               Sanity blog: EV guides, Nigerian EV policy, delivery stories
```

## 5. Core features: making it better than the reference sites

### 5.1 Vehicle detail page (VDP)
- **Gallery** of real photos with a lightbox, in fixed sections: exterior, interior, cabin tech, then details and defects.
- **Battery & range card:** a state-of-health % from an actual battery report, rated range and an honest estimate for real Nigerian driving.
- **Import-status timeline:** *Sourced → Inspected → Shipped → At Lagos port → Cleared → In showroom → Delivered*. It's built and editable in Sanity, but **switched off by default** with a `showImportStatus` toggle, both site-wide and per car. Nothing appears until management turns it on.
- **No public price.** The main CTA is **Request price**, which opens a short form: name, phone or WhatsApp, city, preferred contact method, plus optional trade-in and financing questions. The form is pre-tagged with the car's stock number. Prices stay in the CMS for staff reference only and are **never sent to the browser**.
- **WhatsApp CTA** that sends a prefilled message (`"Hi Vertex, please send me the price of the Xiaomi SU7 (VX-0001)"`), plus **Book a showroom viewing / test drive**.
- **Status badges:** *In showroom* · *Arriving soon* · *Reserved* · *Sold*. Sold cars stay visible for 30 days as social proof.
- **Downloadable spec sheet PDF** and a **QR window sticker**, both reusing the Matrix PDF and QR code.

### 5.2 "Will an EV work for me?" range planner
Pick your city and your usual trips, for example Abuja → Kaduna (~190 km) or Lagos → Ibadan (~130 km). It shows how often you'd charge and your **running cost per km** against petrol at the current pump price. Both the pump price and the electricity tariff are CMS-editable. This compares running costs only, never car prices, so it's consistent with hidden pricing. It ends with "Which Vertex EV fits?", which suggests models and links to Request price.

### 5.3 Charging: home now, EV Hub later
- **Now:** home charging with a **solar charging bundle installed by ACOB Lighting**. No standalone dealer can offer this, and it's the strongest reason for Vertex to sit inside ACOB Group.
- **Later:** **Vertex EV Hub** (`vertexevhub.com`) is the public charging network and gets its own site. For now this site shows a "Coming soon — Vertex EV Hub" panel with a notify-me form. Once the Hub site exists, the panel links to it.
- Both sites use the same shared `@vertex/ui` components and design tokens, so they look like one brand family.

### 5.4 360° and studio imagery: where to get it legally
The phone photos aren't good enough, so the plan uses **two layers**:

| Layer | Purpose | Source |
|---|---|---|
| **Model-level** (`/models/[model]`, homepage cards) | Studio stills and 360° spins of the *model*, so buyers see what an SU7 looks like at its best | **Licensed** vehicle imagery providers: **Evox Images** (studio stills, 360 spins, interior panoramas; the industry standard for dealers and OEM-quality API), **Chrome Data / JD Power**-style catalogues, or the **OEM's media/press kit** where its licence permits dealer use. Check coverage for Chinese models (Xiaomi, Zeekr, BYD, Jetour, etc.) before choosing a provider. |
| **Unit-level** (`/inventory/[slug]`) | The actual car the buyer will receive | **Real photos of that car.** Improve them with dealer tools like **Spyne** (virtual studio: replaces the background of real photos, auto-crops, and builds a 360 spin from a phone walk-around) or **Impel (ex-SpinCar)**. The car itself is real; only the backdrop changes. Label these as "Studio background applied". |

**Do not** download or scrape 360 viewers or images from OEM websites (e.g. Xiaomi's configurator), car-review sites or other dealers. They're copyrighted, and using them is a takedown or lawsuit waiting to happen. The same applies to Sketchfab or TurboSquid 3D models unless the licence explicitly allows commercial use **and** the car brand's trademark use is cleared.

The viewer component works with any of these sources: drag-to-rotate, interior panorama and hotspots, all on canvas.


### 5.5 Compare, save and alerts
Compare up to 3 cars side by side on specs only, without prices. Saving a car needs no account (localStorage). "Notify me when an SU7 arrives" goes to a WhatsApp or email list.

### 5.6 Vertex Assistant (chat)
Reuse the ACOBot route pattern: Groq, rate-limited with Upstash. Its knowledge comes from Sanity inventory plus FAQs. **It never gives prices.** Price questions go to the Request price form or WhatsApp.

### 5.7 Order on request
`/order` is a guided form: body type → preferred models (from the catalogue) → colour and trim → budget band (ranges, not prices) → timeline → contact details. Each request becomes a lead tagged `order-request`. When the import tracker is switched on, an ordered car can later get its own private tracking link.

## 6. Higgsfield: the visual layer of the site (video + stills)

**Scope:** Higgsfield produces the site's **UI visuals**: hero films, section backgrounds, transitions, mood stills and motion accents. It does **not** produce the inventory photos. Those come from the real cars plus licensed studio imagery (§5.4).

### 6.1 Shot list (I'll turn each into a full prompt card)

| # | Placement | Type | Brief |
|---|---|---|---|
| H1 | **Homepage hero** | Video, 8–10s seamless loop | A dark graphite world. An EV glides through a Lagos/Abuja night scene (Third Mainland Bridge, Eko Atlantic, Maitama). Brand-blue light trails trace the logo's 135° blade. The camera tracks low and slow. |
| H2 | Hero (mobile) | Video, 9:16 | Vertical version of H1. Mobile is most of the traffic. |
| H3 | "Why EV" section | Video → ~90-frame **scroll-scrub** sequence | A slow orbit around a car silhouette in a black studio, with blue rim light sweeping across the body. Scrolling drives the camera. |
| H4 | Range planner background | Video loop, subtle | Abstract aerial of Nigerian highways at dusk, with routes lighting up in blue |
| H5 | Charging section | Stills ×3 + 1 short loop | A home in Abuja with solar panels at golden hour and a car charging in the driveway. Ties in ACOB Lighting. |
| H6 | Showroom page | Stills ×2 | Showroom mood: glossy floor, blade-blue light lines. This is a concept until real showroom photos exist. |
| H7 | Order-on-request page | Video loop | Cars in transit: a container ship at dawn, then a port, then a car rolling out. It tells the sourcing story. |
| H8 | Section transitions | 1–2s clips | Abstract blue "blade" light sweeps, used between sections and on page transitions |
| H9 | Loading / 404 / empty states | Short loops | A charging-pulse motif and a blade wipe |
| H10 | Social / OG | Stills | 1200×630 brand stills for link previews |

### 6.2 Guardrails
- **Vehicles in brand visuals are generic or our own models, never a specific stock car.** Don't show OEM logos or wordmarks on generated cars. Generate debadged cars, or cars at an angle where the badge isn't legible. Vertex names the models it sells as plain fact, but its brand footage must not look like an OEM advert.
- **No real-looking people, staff or customers** unless they're real, consenting people.
- **QA every frame.** Video models invent wheels, door handles, mirror shapes and badges. Reject anything enthusiasts would mock.
- **Lock the palette** in every prompt: graphite or black ground, `#0050FD`/`#0072FE` as the only accent light, and cool chrome highlights. Consistency is what makes it feel premium.

### 6.3 Pipeline
1. I write the prompt cards: subject, camera and lens, motion, lighting, palette, aspect ratios, duration, loop point and a negative list.
2. You generate them in Higgsfield, pick the best takes, and drop them into `vertex-electric-solutions/assets/higgsfield/H1/` and so on.
3. I process them:
   - **Video:** encode to AV1 + H.264 fallback, with 720p mobile and 1080p desktop variants.
   - **Loops and stills:** stitch the loop point, extract a poster frame for each video, and export the frame sequence for H3.
   - **Accessibility:** every motion piece gets a pause control and a `prefers-reduced-motion` still.

## 7. Photo pipeline for real inventory

**Collect first:** drop the WhatsApp media for cars 2 and 3 into `Downloads/md/car 2` and `car 3`, the same as car 1. Better still, get the **original files** from the sourcing agent. WhatsApp throws away most of the image detail.

For every car:
1. **Blur the plates.** Car 1's 粤C plate is readable in 4 shots.
2. **Real photos → studio background** with a dealer tool (Spyne or similar), labelled "Studio background applied". The car pixels stay real.
3. **Use the walk-around video** to build a spin. Car 2's 2-minute video is ideal for this.
4. **Model-level licensed imagery** fills the gaps (§5.4).
5. **Do a showroom shoot when the car arrives.** That means a fixed 24-shot checklist (I'll provide it) plus a 36-frame turntable spin.

## 8. Industry-standard engineering baseline

- **Stack:** Next.js 16 App Router + RSC, TypeScript strict, Tailwind v4, `motion`, shadcn/Radix primitives, Sanity v5 (embedded Studio at `/studio`), `next-sanity` live preview, ISR with on-demand revalidation via Sanity webhook.
- **Performance budget (Nigerian 4G, mid-range Android):** LCP < 2.5s, INP < 200ms, CLS < 0.1, JS < 170 KB gz on the homepage.
  - The hero video never blocks LCP. The poster image is the LCP element, and the video loads after idle.
  - Respect `Save-Data` and `prefers-reduced-motion`, which swap the video and scroll-scrub for stills.
  - Images use Sanity CDN with AVIF/WebP via `next/image`.
- **SEO:** `Car` JSON-LD on every VDP **without `Offer.price`**, because prices are hidden. Add `AutoDealer` + `Organization` (`parentOrganization` = ACOB Group) plus showroom `LocalBusiness` with the address and hours. Also model landing pages, a sitemap and per-car OG images.
- **Price privacy:** Sanity's `price` field is excluded from every public GROQ projection. A test asserts that no page payload contains it.
- **Accessibility:** WCAG 2.2 AA, keyboard-operable gallery and spin viewer, captions and pause control on all motion.
- **Quality gates:** ESLint, Prettier, `tsc`, Playwright smoke tests on the VDP and lead forms, Lighthouse CI on PRs. Husky and commitlint come from ACOB-Website.
- **Ops:** Vercel (preview per PR), Cloudflare DNS, Vercel Analytics + Speed Insights, Sentry. Leads go to Resend email plus Zoho CRM.
- **Security:** rate limiting on `/api/lead` and `/api/chat` (Upstash), Turnstile on forms, zod validation on the server, no secrets in the client.

## 9. Phased delivery

| Phase | Scope | Exit criteria |
|---|---|---|
| **0. Foundations** (wk 1) ✅ *built 7 Oct* | SVG logo redraw, tokens, type pairing, repo scaffold with a shared `@vertex/ui` folder, Sanity schemas (`vehicle`, `carModel`, `siteSettings`). Leads are **not** stored in Sanity (personal data). They go to email + CRM in Phase 2. | Logo signed off by you. Sanity project created (your account). `/brand` token page live. |
| **1. Look & feel** (wk 1–2) | Higgsfield prompt cards → you generate → I integrate H1–H3. Homepage hero, blade motion system, dark and light themes | Hero approved by MD on desktop and a real mid-range Android |
| **2. Sell cars** (wk 2–3) | Inventory, VDP, Request price + WhatsApp + Book viewing, showroom page, order-on-request form, import tracker (built, **off**), listings for cars 1–3 | Three live listings. Leads arrive in email and CRM. No price leaks. |
| **3. Differentiate** (wk 4) | Range planner, home solar-charging page plus EV Hub teaser, compare, alerts, Vertex Assistant, spin viewer, licensed model imagery | Tools working with CMS-editable rates |
| **4. Launch** (wk 5) | Content, SEO, a11y audit, Lighthouse CI green, staff email signatures via Matrix, Zoho mail DNS | Go-live on `vertexevsolutions.com` |
| **5. Later** | Switch on the import tracker, financing partner calculator, **Vertex EV Hub site** on `@vertex/ui` | — |

## 10. Still open

1. **Domain:** register `vertexevsolutions.com` (the strategy's pick) plus `vertexelectricsolutions.com` as a redirect? This is an external purchase, so you or management action it.
2. **Models of cars 2 and 3:** what are they? I can't confirm them from WhatsApp thumbnails.
3. **Showroom details:** address, opening hours and phone/WhatsApp line.
4. **Imagery budget:** a licensed provider (e.g. Evox) and a dealer photo tool (e.g. Spyne) are paid subscriptions. Get quotes before Phase 3.
5. **Lead routing:** who receives Request price leads? One sales inbox or WhatsApp Business number, or round-robin across sales staff?

## 11. Next step

Phase 0 can start now. I'll scaffold `vertex-electric-solutions/` locally, redraw the logo as SVG, set up the tokens, and write the Higgsfield prompt cards for H1–H3. Nothing gets pushed to GitHub or connected to Vercel, Sanity or Cloudflare without your explicit go-ahead.
