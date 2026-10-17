/**
 * Preloader
 * Plays a short, deterministic loading sequence, then lifts the curtain while
 * the hero intro starts underneath. The page is scroll-locked until exit.
 */
import { gsap } from 'gsap';
import { lockScroll, unlockScroll, prefersReducedMotion } from './utils.js';

export function initPreloader({ lenis }) {
  const preloader = document.querySelector('[data-preloader]');
  if (!preloader) return Promise.resolve();

  // Reduced motion: remove instantly, no waiting, no animation.
  if (prefersReducedMotion()) {
    preloader.remove();
    return Promise.resolve();
  }

  const countEl = preloader.querySelector('[data-preloader-count]');
  const fill = preloader.querySelector('[data-preloader-fill]');
  const paw = preloader.querySelector('[data-preloader-paw]');
  const inner = preloader.querySelector('.preloader__center');
  const foot = preloader.querySelector('.preloader__foot');

  const progress = { value: 0 };
  const renderCount = () => {
    if (!countEl) return;
    countEl.textContent = String(Math.round(progress.value)).padStart(2, '0');
  };

  lockScroll(lenis);
  gsap.set(fill, { scaleX: 0 });

  // Keep the page behind the loader out of the tab order until we exit.
  const pageRegions = [
    document.querySelector('.skip-link'),
    document.querySelector('[data-nav]'),
    document.querySelector('main'),
    document.querySelector('footer'),
  ].filter(Boolean);
  pageRegions.forEach((region) => region.setAttribute('inert', ''));

  // Idle animation keeps the wait feeling alive.
  if (paw) {
    gsap.to(paw, {
      y: -9,
      duration: 0.85,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // Fill most of the bar while assets settle.
  gsap.to(progress, {
    value: 88,
    duration: 1.25,
    ease: 'power1.out',
    onUpdate: renderCount,
  });
  if (fill) {
    gsap.to(fill, { scaleX: 0.88, duration: 1.25, ease: 'power1.out' });
  }

  // One shared "assets ready" promise with a failsafe so a slow third-party
  // asset can never hold the site hostage.
  const assetsReady = new Promise((done) => {
    if (document.readyState === 'complete') {
      window.setTimeout(done, 450);
      return;
    }
    window.addEventListener('load', () => window.setTimeout(done, 300), { once: true });
    window.setTimeout(done, 2400);
  });

  return new Promise((resolve) => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      if (paw) gsap.killTweensOf(paw);

      const timeline = gsap.timeline({
        onStart: () => {
          // Let the hero start animating as the curtain lifts.
          document.documentElement.classList.add('is-ready');
          pageRegions.forEach((region) => region.removeAttribute('inert'));
          unlockScroll(lenis);
          resolve();
        },
        onComplete: () => {
          preloader.remove();
        },
      });

      timeline
        .to(progress, { value: 100, duration: 0.35, ease: 'power1.inOut', onUpdate: renderCount }, 0)
        .to(fill, { scaleX: 1, duration: 0.35, ease: 'power1.inOut' }, 0)
        .to(inner, { yPercent: -7, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.2)
        .to(foot, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 0.2)
        .to(preloader, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 0.38);
    };

    // Guarantee a brief minimum show time so the sequence feels intentional.
    const minimum = new Promise((done) => window.setTimeout(done, 1450));
    Promise.all([minimum, assetsReady]).then(finish);
  });
}
