/**
 * COCO THE ORANGE — SCROLL JOURNEY
 *
 * A pinned, Apple-style horizontal scroller: the section locks in place while
 * vertical scrolling slides a row of five "day in the life" cards sideways.
 * Everything is transform-only (translateX on the track), scrubbed with GSAP
 * ScrollTrigger and synced to Lenis.
 *
 * Static baseline (no JS / reduced motion): the cards render as a normal
 * responsive grid and the HUD stays hidden — no pin, no scrub.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, pad2 } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initJourney() {
  const section = document.querySelector('[data-journey]');
  if (!section) return null;

  const track = section.querySelector('[data-journey-track]');
  const cards = track ? [...track.querySelectorAll('[data-journey-card]')] : [];
  const barEl = section.querySelector('[data-journey-bar]');
  const progressbar = section.querySelector('[data-journey-progressbar]');
  const indexEl = section.querySelector('[data-journey-index]');
  const totalEl = section.querySelector('[data-journey-total]');

  if (!track || !cards.length) return null;
  if (totalEl) totalEl.textContent = pad2(cards.length);

  if (prefersReducedMotion()) return null;

  section.classList.add('is-enhanced');

  /* --- Horizontal distance the track must travel ------------------------ */
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  // The section needs enough scroll runway for the full sideways trip.
  // refreshInit runs before ScrollTrigger measures, so end positions stay true.
  const setHeight = () => {
    section.style.height = `${distance() + window.innerHeight}px`;
  };
  setHeight();
  ScrollTrigger.addEventListener('refreshInit', setHeight);

  /* --- Active-card + HUD updates ---------------------------------------- */
  let activeIndex = -1;

  const update = (progress) => {
    const p = gsap.utils.clamp(0, 1, progress);

    if (barEl) barEl.style.transform = `scaleX(${p.toFixed(5)})`;

    const index = Math.min(cards.length - 1, Math.floor(p * cards.length));
    if (index !== activeIndex) {
      activeIndex = index;
      cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
      if (indexEl) indexEl.textContent = pad2(index + 1);
    }

    if (progressbar) {
      progressbar.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      progressbar.setAttribute(
        'aria-valuetext',
        `Stop ${index + 1} of ${cards.length}: ${cards[index].dataset.journeyLabel || ''}`
      );
    }
  };

  /* --- Scrub ------------------------------------------------------------ */
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: setHeight,
      onUpdate: (self) => update(self.progress),
    },
  });

  update(0);

  return {
    destroy() {
      ScrollTrigger.removeEventListener('refreshInit', setHeight);
      tween.scrollTrigger?.kill();
      tween.kill();
      section.style.height = '';
      section.classList.remove('is-enhanced');
    },
  };
}
