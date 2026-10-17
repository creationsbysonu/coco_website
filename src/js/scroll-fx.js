/**
 * COCO THE ORANGE — SCROLL FX
 *
 * A bundle of scroll-linked graphic effects layered on top of the core
 * reveals:
 *   1. A fixed progress "paw trail" rail with a live percentage.
 *   2. Parallax doodles that drift and rotate at their own speeds.
 *   3. Self-drawing squiggles (SVG stroke grows with scroll).
 *   4. Slow orbit rings that spin as their section passes.
 *   5. Ticker groups that shear with scroll velocity.
 *
 * Everything is transform / opacity (or stroke-dashoffset) only, scrubbed to
 * scroll, and skipped entirely for reduced-motion visitors.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollFx() {
  if (prefersReducedMotion()) return null;

  const context = gsap.context(() => {
    initProgressRail();
    initFloats();
    initDrawPaths();
    initOrbits();
    initVelocityMarquee();
  });

  return context;
}

/* --- 1. Progress rail -------------------------------------------------- */
function initProgressRail() {
  const rail = document.querySelector('[data-scroll-progress]');
  if (!rail) return;

  const railTrack = rail.querySelector('.scroll-progress__rail');
  const fill = rail.querySelector('[data-scroll-progress-fill]');
  const paw = rail.querySelector('.scroll-progress__paw');
  const value = rail.querySelector('[data-scroll-progress-value]');
  if (!railTrack || !fill || !paw) return;

  // How far the paw can travel before it meets the end of the rail.
  let travel = 0;
  const measure = () => {
    travel = Math.max(0, railTrack.offsetHeight - paw.offsetHeight);
  };
  measure();

  rail.classList.add('is-ready');

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onRefresh: measure,
    onUpdate: (self) => {
      const p = gsap.utils.clamp(0, 1, self.progress);
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      paw.style.transform = `translate(-50%, ${(p * travel).toFixed(1)}px)`;
      if (value) value.textContent = String(Math.round(p * 100));
    },
  });
}

/* --- 2. Parallax doodles ----------------------------------------------- */
function initFloats() {
  gsap.utils.toArray('[data-scroll-float]').forEach((element) => {
    const speed = Number(element.dataset.scrollFloat) || 0.25;
    const rotate = Number(element.dataset.scrollRotate) || 0;
    const section = element.closest('section, .site-footer') || element;

    gsap.fromTo(
      element,
      { yPercent: -speed * 55, rotate: -rotate / 2 },
      {
        yPercent: speed * 55,
        rotate: rotate / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

/* --- 3. Self-drawing squiggles ----------------------------------------- */
function initDrawPaths() {
  gsap.utils.toArray('[data-scroll-draw]').forEach((svg) => {
    const shapes = gsap.utils.toArray(
      svg.querySelectorAll('path, line, circle, ellipse, polyline, polygon')
    );
    if (!shapes.length) return;

    shapes.forEach((shape) => {
      let length = 0;
      try {
        length = shape.getTotalLength?.() || 0;
      } catch {
        length = 0;
      }
      if (!length) return;
      shape.style.strokeDasharray = `${length}`;
      shape.dataset.drawLength = `${length}`;
    });

    const section = svg.closest('section, .site-footer') || svg;

    gsap.fromTo(
      shapes,
      { strokeDashoffset: (i, target) => Number(target.dataset.drawLength) || 0 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          end: 'bottom 58%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

/* --- 4. Orbit rings ----------------------------------------------------- */
function initOrbits() {
  gsap.utils.toArray('[data-scroll-rotate]').forEach((element) => {
    // Elements that also drift are handled by initFloats (which owns rotate).
    if (element.hasAttribute('data-scroll-float')) return;

    const turns = Number(element.dataset.scrollRotate) || 360;
    const section = element.closest('section, .site-footer') || element;

    gsap.fromTo(
      element,
      { rotate: 0 },
      {
        rotate: turns,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

/* --- 5. Velocity-reactive ticker ---------------------------------------- */
function initVelocityMarquee() {
  const groups = gsap.utils.toArray('.marquee__group');
  if (!groups.length) return;

  let target = 0;
  let skew = 0;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      target = gsap.utils.clamp(-9, 9, self.getVelocity() / 130);
    },
  });

  gsap.ticker.add(() => {
    target *= 0.9;
    skew += (target - skew) * 0.12;
    if (Math.abs(skew) < 0.005 && Math.abs(target) < 0.005) return;
    gsap.set(groups, { skewX: skew });
  });
}
