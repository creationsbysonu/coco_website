# Coco the Orange — Influencer Portfolio

A single-page, high-end portfolio for Coco the Orange, the internet's favorite orange cat.
Built as a static site with **Vite, GSAP and Lenis**, with a playful editorial design system,
custom paw cursor, preloader, scroll-driven animation and an accessible media gallery.

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

- Lenis smooth scrolling, synced to GSAP's ticker and ScrollTrigger.
- A custom preloader with progress, a curtain exit and a hero intro that starts underneath it.
- GSAP scroll reveals: masked headline lines, staggered cards/facts/gallery items and a footer wordmark.
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

**Performance**

- No layout shift caused by media: every image/video has reserved aspect ratio or intrinsic dimensions.
- Below-the-fold images are lazy-loaded and decoded asynchronously.
- Animations use transform/opacity only; ScrollTrigger is refreshed after fonts load.
- Lenis and GSAP are bundled locally (no third-party script CDNs).
- The hero video is capped with `preload="metadata"` and left muted/looping.

---

## Project structure

```
.
├── index.html                  # All page content, SEO, media placeholders
├── public/
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
│   │   └── responsive.css      # Tablet, mobile and short-viewport refinements
│   └── js/
│       ├── main.js             # App entry and module orchestration
│       ├── smooth-scroll.js    # Lenis + ScrollTrigger sync, anchor navigation
│       ├── preloader.js        # Loading sequence and curtain exit
│       ├── cursor.js           # Custom paw cursor
│       ├── nav.js              # Sticky nav state, active section, mobile menu
│       ├── hero.js             # Hero entrance timeline
│       ├── reveal.js           # Scroll reveals, line masks, parallax, wordmark
│       ├── counters.js         # Animated stats
│       ├── gallery.js          # Masonry lightbox and hover video previews
│       ├── magnetic.js         # Magnetic button effect
│       ├── back-to-top.js      # Footer scroll-to-top control
│       └── utils.js            # Reduced motion, pointer type, scroll locks
├── vite.config.js
└── package.json
```

---

## Replacing the media

Every image and video is a **dimension-labelled placeholder** from
[placehold.co](https://placehold.co) wrapped in a clear comment:

```html
<!-- MANUALLY INSERT COCO MEDIA HERE — GALLERY 01 — 900 × 1200 -->
<img src="…" alt="…" width="900" height="1200" loading="lazy" decoding="async" />
<!-- END MANUALLY INSERT COCO MEDIA HERE -->
```

Search `index.html` for `MANUALLY INSERT COCO MEDIA HERE` to find every slot.

| Slot | Placeholder size | Where / notes |
| --- | --- | --- |
| Hero background | 1920 × 1080 | `<video>` — uncomment/add a `<source>`; keep the poster |
| Hero poster | 1920 × 1080 | Keep the `<link rel="preload">` in sync |
| Open Graph share image | 1200 × 630 | Head meta, Twitter card and social sharing |
| Story portrait | 900 × 1125 | About section, main image |
| Story detail | 800 × 800 | About section, overlapping photo |
| Gallery 01 | 900 × 1200 | Portrait |
| Gallery 02 | 900 × 900 | Square |
| Gallery 03 | 1200 × 800 | Reel/video — add a `<source>` to the `<video>` |
| Gallery 04 | 900 × 1100 | Portrait |
| Gallery 05 | 900 × 700 | Landscape |
| Gallery 06 | 900 × 1200 | Portrait |
| Gallery 07 | 1200 × 900 | Campaign/landscape |
| Gallery 08 | 900 × 900 | Square |
| Lightbox | — | Loads each item's `data-full`; replace those URLs with hi-res versions |

### Images

1. Put files in `public/media/` (served at `/media/...`) or use a CDN.
2. Replace the `src` and `data-full` URLs. Keep the existing `width` and `height` attributes so the
   layout reserves the correct space.
3. If you change an item's aspect ratio, update both the wrapper's `--ratio` custom property and the
   `width`/`height` attributes. The masonry grid relies on those values.
4. Prefer `AVIF`/`WebP` with JPG fallbacks. Add `srcset`/`sizes` if you export multiple widths.
5. Update `alt` text with a real description of Coco's photo.

### Videos

**Hero:** add a source inside the hero `<video>`:

```html
<source src="/media/coco-hero.mp4" type="video/mp4" />
<source src="/media/coco-hero.webm" type="video/webm" />
```

Keep it muted, looped, `playsinline`, and ideally under ~8 MB. The poster is what most visitors will
see first; make it a strong frame.

**Gallery reel:** add a `<source>` to the gallery video. It is set to play on hover on precise
pointers, and always shows the poster otherwise. Clicking the card opens the lightbox with the
`data-full` image (the poster). If you want full video playback inside the lightbox, extend
`src/js/gallery.js` to render a `<video>` element when `data-type="Reel"`.

### Audio & transcripts

Background media is decorative and muted. If the reel contains speech, add captions and a
transcript when you publish the real asset.

---

## Content to update before launch

Search these and replace:

- **Contact email** — `hello@cocotheorange.com` appears in the menu, collaboration CTAs, footer and
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
- **Breakpoints:** 1180, 1080, 900, 720, 560, 400px, plus short-laptop and short-phone height queries.

---

## Quality checks performed

- Production build passes (`npm run build`).
- Interaction checks in headless Chrome: preloader, anchors, counters, lightbox open/next/Escape,
  focus return, back-to-top, mobile menu, scroll locking and reduced-motion mode.
- axe-core WCAG 2 A/AA scan: **0 violations** on the page, the open mobile menu and the open lightbox.
- Layout verified at 1440×1000, 1366×768, 1440×700, 768×900, 390×844, 390×667 and 320×640.
- Measured CLS on the local production preview: **~0.026** (well below the 0.1 “good” threshold).
  Re-check with real media and your production host.

> Placeholder images depend on the placehold.co service. Replace them before launch so the site does
> not rely on a third-party generator.

---

## Deployment

`npm run build` outputs a static site to `dist/`. Upload it to Netlify, Vercel, Cloudflare Pages,
GitHub Pages or any static host. `vite.config.js` uses `base: './'`, so the build also works when
served from a subfolder.

No server, database or build-time environment variables are required.
# coco_website
