/**
 * Lenis smooth scrolling, kept in sync with GSAP's ticker and ScrollTrigger.
 * Lenis is skipped entirely for visitors who prefer reduced motion.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // Keep ScrollTrigger perfectly aligned with Lenis' virtual scroll position.
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** Scroll to a section or element, using Lenis when it is available. */
export function scrollToTarget(target, lenis, options = {}) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  if (lenis) {
    lenis.scrollTo(element, {
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      ...options,
    });
    return;
  }

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}

/**
 * Delegated anchor handling so every in-page link shares one behaviour:
 * smooth scrolling, hash updates and proper focus for the skip link.
 */
export function initAnchorNavigation(lenis) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    let target;
    try {
      target = document.querySelector(hash);
    } catch {
      return;
    }
    if (!target) return;

    event.preventDefault();

    // The skip link should move focus, not just scroll.
    if (hash === '#main-content') {
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      return;
    }

    if (hash === '#top' || hash === '#hero') {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      history.replaceState(null, '', hash);
      return;
    }

    scrollToTarget(target, lenis);
    history.replaceState(null, '', hash);
  });
}
