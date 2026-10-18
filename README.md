# Coco the Orange — Influencer Portfolio

A single-page, high-end portfolio for Coco the Orange, the internet's favorite orange cat.
Built as a static site with **Vite, GSAP and Lenis**, with a playful editorial design system,
custom paw cursor, preloader, scroll-driven animation, a pinned 120-frame scrollytelling
sequence and an accessible media gallery.

---

## Quick start

```bash
npm install
npm run dev      # local development — http://localhost:5173
npm run build    # production build in /dist
npm run preview  # preview the production build — http://localhost:4173
```

Node 20.19+ is recommended (Vite 8 requirement).

---

## What's included

**Motion & interaction**

- Lenis inertial scrolling (`lerp: 0.09`), synced to GSAP's ticker and ScrollTrigger.
- A custom preloader with progress, a curtain exit and a hero intro that starts underneath it.
- **Horizontal scroll journey** — a pinned “A day with Coco.” stage. Vertical scrolling slides
  five day-in-the-life cards sideways (Apple-style), with the active card lifting as it reaches
  centre and a progress HUD tracking the five stops.
- GSAP scroll reveals: masked headline lines, staggered cards/facts/gallery items and a footer wordmark.
- **Scroll FX layers** — a fixed progress "paw trail" rail with a live percentage, parallax doodles
  that drift and rotate across sections, self-drawing SVG squiggles, slow orbit rings and
  velocity-reactive ticker shearing.
- Parallax cartoon doodles (fish, yarn, paws, sparkles) on the hero.
- Rotating follower badge and an infinite ticker.
- Scroll-triggered stat counters.
- Masonry gallery with premium hover states, hover-to-play video support and a native `<dialog>` lightbox.
- Custom cartoon paw cursor that reacts to links and buttons, plus magnetic CTAs on desktop.
- Animated back-to-top control in the footer.
- Fully responsive mobile menu with focus management, scroll lock and Escape support.

**SEO**

- Semantic HTML5 landmarks, one `<h1>`, descriptive page title and meta description.
- Open Graph and Twitter/X cards.
- Person JSON-LD structured data.
- Canonical URL, `robots.txt` and `sitemap.xml`.
- SVG favicon and 180 × 180 Apple touch icon.

**Accessibility**

- Skip link, visible keyboard focus, readable contrast (WCAG AA verified with axe).
- Mobile menu uses `inert`, `aria-expanded`, focus trapping and focus restoration.
- Lightbox uses the native `<dialog>` element, Escape/arrow-key navigation and returns focus to the card.
- Decorative artwork and duplicate ticker copy are hidden from assistive technology.
- Counter values expose their final values through accessible labels.
- Full `prefers-reduced-motion` support: no preloader, no parallax, no custom cursor, no smooth
  scroll, no videos playing automatically and instant reveal states.
- The scroll journey becomes a normal card grid for reduced motion: no pinning, no sideways scrub,
  all five stops visible. It also degrades to this layout with JS off.
- The journey HUD exposes progress through an ARIA progressbar with stop-based `aria-valuetext`.

**Performance**

- No layout shift caused by media: every image/video has reserved aspect ratio or intrinsic dimensions.
- Below-the-fold images are lazy-loaded and decoded asynchronously.
- Animations use transform/opacity only; ScrollTrigger is refreshed after fonts load.
- The horizontal journey animates a single `translateX` on the track (transform-only, GPU-friendly)
  and needs zero media — the whole section is markup and CSS.
- Lenis and GSAP are bundled locally (no third-party script CDNs).
- The hero video is capped with `preload="metadata"` and left muted/looping.

---

## Project structure

```
.
├── index.html                  # All page content, SEO and real media
├── media/                      # Original source photos/videos (not served)
├── public/
│   ├── media/                  # Optimised assets served at /media/...
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── styles/
│   │   ├── main.css            # CSS entry (imports the layers below)
│   │   ├── base.css            # Tokens, reset, typography, a11y, utilities
│   │   ├── components.css      # Buttons, nav, cursor, preloader, cards, gallery, lightbox
│   │   ├── layout.css          # Hero, sections and footer composition
│   │   ├── scroll-fx.css       # Progress rail + scroll-linked decorative graphics
│   │   └── responsive.css      # Tablet, mobile and short-viewport refinements
│   └── js/
│       ├── main.js             # App entry and module orchestration
│       ├── smooth-scroll.js    # Lenis + ScrollTrigger sync, anchor navigation
│       ├── preloader.js        # Loading sequence and curtain exit
│       ├── cursor.js           # Custom paw cursor
│       ├── nav.js              # Sticky nav state, active section, mobile menu
│       ├── hero.js             # Hero entrance timeline
│       ├── reveal.js           # Scroll reveals, line masks, parallax, wordmark
│       ├── scroll-fx.js        # Progress rail, parallax doodles, drawing SVGs, marquee velocity
│       ├── counters.js         # Animated stats
│       ├── journey.js          # Pinned horizontal scroller (sideways card track)
│       ├── gallery.js          # Masonry lightbox and hover video previews
│       ├── magnetic.js         # Magnetic button effect
│       ├── back-to-top.js      # Footer scroll-to-top control
│       └── utils.js            # Reduced motion, pointer type, scroll locks
├── vite.config.js
└── package.json
```

---

## Replacing the media

Real Coco media lives in `public/media/` and is wired into `index.html` (served at
`/media/...`). The table below documents every slot and the file that fills it.

| Slot | Size | File |
| --- | --- | --- |
| Hero poster (preloaded) | 1920 × 1080 | `coco-hero-poster.jpg` |
| Hero background video | 1920 × 1080 | `coco-hero.mp4` (real reel, blurred fill) |
| Open Graph / Twitter image | 1200 × 630 | `coco-og.jpg` |
| Story portrait | 900 × 1125 | `coco-story-portrait.jpg` |
| Story detail | 800 × 800 | `coco-story-detail.jpg` |
| Gallery 01, 04, 07, 10 | 900 × 1200 / 1350 (3:4, 2:3) | `gallery-0*.jpg` / `gallery-*-full.jpg` |
| Gallery 02, 08 | 900 × 900 (1:1) | `gallery-0*.jpg` / `gallery-*-full.jpg` |
| Gallery 05, 11 | 900 × 1125 (4:5) | `gallery-1*.jpg` / `gallery-*-full.jpg` |
| Gallery 12 | 900 × 1350 (2:3) | `gallery-12.jpg` / `gallery-12-full.jpg` |
| Gallery reels (x6) | 720 × 1280 (9:16) | `reel-*.mp4` / `reel-*.jpg` |
| Lightbox | — | each item's `data-full` (hi-res still); reels use `data-video` |

Every source photo is portrait, so gallery ratios are portrait/square: **3:4**, **4:5**, **2:3**,
**1:1** and **9:16** for the vertical reels. When swapping an item, update the wrapper's `--ratio`,
the `width`/`height` attributes and the `data-full` URL together so the masonry reserves the right space.

**Reels in the gallery:** `reel-viral`, `reel-sunbeam`, `reel-anxiety`, `reel-10m`,
`reel-airplane`, `reel-face` — each plays on hover (precise pointers) and in the lightbox.

### Horizontal scroll journey

The “A day with Coco.” section is a pinned horizontal scroller: while the section is pinned,
vertical scrolling translates the card track sideways (`.journey__track`), scrubbed with GSAP
ScrollTrigger and synced to Lenis. The active card lifts slightly as it reaches the centre, and the
HUD tracks stop `01 / 05` with an ARIA progressbar.

- Cards are plain markup — add or reorder `<article class="journey-card">` elements inside
  `.journey__track`; the section height and travel distance are measured automatically in JS.
- Reduced-motion visitors (and JS-off visitors) get the cards as a normal responsive grid — no
  pinning, no sideways motion.
- Styling lives in `layout.css` (`.journey` rules); breakpoint tweaks live in `responsive.css`.

### Scroll FX layers

`src/js/scroll-fx.js` drives a set of graphic effects on top of the core reveals. All of them are
transform/opacity-only, scrubbed to scroll, and disabled under `prefers-reduced-motion`:

- **Progress rail** — a fixed paw (`data-scroll-progress`) travels down a rail with a live percentage.
- **Parallax doodles** — any element with `data-scroll-float="<speed>"` drifts vertically and, with
  `data-scroll-rotate="<deg>"`, rotates as its section passes. Add them in a `.fx-layer` inside any
  `position: relative` section; the layer clips overflow and stays behind the content.
- **Self-drawing squiggles** — an SVG with `data-scroll-draw` grows its strokes as the section scrolls
  (`stroke-dasharray`/`stroke-dashoffset` are measured per shape).
- **Orbit rings** — `data-scroll-rotate="<deg>"` on an element without `data-scroll-float` spins it.
- **Velocity shearing** — the marquee groups shear subtly with scroll velocity.

To add a doodle, drop a `<span class="fx-float">` (holding an inline SVG) into a section's `.fx-layer`
and position it in `scroll-fx.css`. Reusable icons come from the SVG sprite at the top of `index.html`
(`#paw`, `#sparkle`, `#fish`, `#yarn`).

### Images

1. Files live in `public/media/` (served at `/media/...`).
2. Each item keeps its `width` and `height` attributes so the layout reserves the correct space.
3. The wrapper's `--ratio` custom property and the `width`/`height` attributes must match the asset's
   real aspect ratio — the masonry grid relies on them.
4. `data-full` points at the hi-res still used by the lightbox.
5. `alt` text describes the actual photo.

### Videos

**Hero:** a muted, looped real reel centred over a blurred, darkened fill (`coco-hero.mp4`, ~2.5 MB).
The poster (`coco-hero-poster.jpg`) is preloaded for LCP.

**Gallery reels:** six vertical reels (`reel-*`) play on hover on precise pointers and open in the
lightbox, where `gallery.js` swaps the poster for the actual `<video>` (using each card's
`data-video`).

### Audio & transcripts

Background media is decorative and muted. If the reel contains speech, add captions and a
transcript when you publish the real asset.

---

## Content to update before launch

Search these and replace:

- **Contact email** — `cocotheorange99@gmail.com` appears in the menu, collaboration CTAs, footer and
  mail links. Replace all instances.
- **Domain** — canonical, Open Graph URL, JSON-LD `url`, `public/robots.txt` and
  `public/sitemap.xml` currently use `https://cocotheorange.com/`.
- **Socials** — Instagram (`https://www.instagram.com/cocotheorange/`) and the provided Facebook
  search URL are already wired up. If a direct Facebook page URL becomes available, replace it in
  the menu, footer and JSON-LD.
- **Stats** — 145K+ Facebook and 25K+ Instagram are wired into the counters. The **3.4M monthly
  reach** and **12.4% engagement** values are illustrative placeholders; replace them with Coco's
  actual metrics and update the accessible `aria-label` values on the corresponding `<p>` elements.
  The “170K+ combined” audience in the collaboration card assumes 145K + 25K.
- **Review date** — the stats footnote says October 2026. Update as needed.
- **Partner strip** — the categories are deliberately generic. Replace them with real partner
  logos/names only after permissions are confirmed.
- **Alt text and captions** — update alongside the real photos.
- **Open Graph/Twitter image** — replace with a real 1200 × 630 photo of Coco.

---

## Design notes

- **Palette:** warm cream paper, ink, tangerine, butter yellow, pink and mint.
- **Type:** Bricolage Grotesque for display, Shrikhand for playful accents, DM Sans for body copy.
  Fonts load from Google Fonts; self-host them if you prefer to avoid third-party requests.
- **Grid:** 1320px max content width, fluid gutters, asymmetrical editorial sections.
- **Styling:** CSS custom properties live in `src/styles/base.css`. Change the palette and radii there
  to re-theme the entire site.
- **Navigation:** a transparent frosted-glass pill (`backdrop-filter`) whose tint and type colour
  adapt to the section behind it — light type over dark artwork (hero, gallery), ink type over light
  sections. Set `data-nav-tone="dark|light"` on a section and `src/js/nav.js` flips the header as it
  scrolls past.
- **Breakpoints:** 1180, 1080, 900, 720, 560, 400px, plus short-laptop and short-phone height queries.

---

## Quality checks performed

- Production build passes (`npm run build`).
- Interaction checks in headless Chrome: preloader, anchors, counters, lightbox open/next/Escape,
  focus return, back-to-top, mobile menu, scroll locking and reduced-motion mode.
- Sequence checks at 25 / 50 / 75 / 100% scroll progress: sticky stage stays pinned, frame counter
  advances 001 → 120, chapter cards crossfade, progressbar `aria-valuenow` tracks the scrub and the
  **Sequence** nav item becomes current. Real-frame mode was verified with a 24-frame local test set
  (all requests completed, loader hid, total and counter updated).
- Reduced-motion and JS-off layouts were checked: the section is unpinned, all three chapters are
  visible and the static illustration is drawn. No horizontal overflow at 1440×1000, 900×1000,
  390×844 or 320×640.
- axe-core WCAG 2 A/AA scan: **0 violations** on the page in normal motion and reduced motion,
  including the open mobile menu and lightbox checks from the base build.
- Measured CLS on the local production preview after load and a full scroll pass: **~0.027**
  (well below the 0.1 “good” threshold). Re-check with real media and your production host.
- Tested in Chrome only; Safari, Firefox and physical devices still need a pass.

> All media is now self-hosted in `public/media/` — the site no longer depends on
> placehold.co. Re-run the checks above with the real assets before launch.

---

## Deployment

`npm run build` outputs a static site to `dist/`. Upload it to Netlify, Vercel, Cloudflare Pages,
GitHub Pages or any static host. `vite.config.js` uses `base: './'`, so the build also works when
served from a subfolder.

No server, database or build-time environment variables are required.
# coco_website
