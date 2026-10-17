/**
 * COCO THE ORANGE — application entry.
 * Modules are initialised in a deliberate order:
 *   1. Smooth scroll & ScrollTrigger sync
 *   2. Navigation & anchor handling (so the menu closes before scrolling)
 *   3. Content interactions (cursor, gallery, magnetic buttons)
 *   4. Entrance animation setup (hidden while the preloader covers the page)
 *   5. Preloader last, then the hero reveal.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initSmoothScroll, initAnchorNavigation } from './smooth-scroll.js';
import { initNav } from './nav.js';
import { initCursor } from './cursor.js';
import { initHero } from './hero.js';
import { initReveals } from './reveal.js';
import { initCounters } from './counters.js';
import { initGallery } from './gallery.js';
import { initMagnetic } from './magnetic.js';
import { initBackToTop } from './back-to-top.js';
import { initJourney } from './journey.js';
import { initScrollFx } from './scroll-fx.js';
import { initPreloader } from './preloader.js';

gsap.registerPlugin(ScrollTrigger);

// Avoid janky refreshes on mobile browsers when the URL bar collapses.
ScrollTrigger.config({ ignoreMobileResize: true });

const lenis = initSmoothScroll();

initNav({ lenis });
initAnchorNavigation(lenis);
initCursor();

// Establish the tall pinned section before reveal triggers measure the page.
initJourney();

const hero = initHero();
initReveals();
initCounters();
initGallery({ lenis });
initMagnetic();
initBackToTop({ lenis });
initScrollFx();

// The hero starts as the preloader curtain lifts.
initPreloader({ lenis }).then(() => {
  hero.play();
  ScrollTrigger.refresh();
});

// Keep trigger positions accurate once webfonts have swapped in.
if (document.fonts?.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

// Refresh after viewport changes, debounced to avoid layout thrash.
let resizeTimer;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
});
