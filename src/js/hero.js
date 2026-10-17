/**
 * Hero intro
 * Hides the headline and supporting copy immediately (welcome screen covers
 * the flash), then plays a cinematic reveal once the preloader starts exiting.
 */
import { gsap } from 'gsap';
import { prefersReducedMotion } from './utils.js';

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return { play: () => {} };

  const reduced = prefersReducedMotion();
  const lines = hero.querySelectorAll('.hero__title .line-inner');
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const badge = hero.querySelector('[data-hero-badge]');
  const video = hero.querySelector('[data-hero-video]');

  // Respect reduced motion: poster only, no entrance animation.
  if (reduced) {
    video?.pause();
    return { play: () => {} };
  }

  gsap.set(lines, { yPercent: 115 });
  gsap.set(fades, { y: 22, autoAlpha: 0 });
  if (badge) gsap.set(badge, { scale: 0.6, rotate: -18, autoAlpha: 0 });

  let hasPlayed = false;

  const play = () => {
    if (hasPlayed) return;
    hasPlayed = true;

    const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

    timeline
      .to(
        lines,
        { yPercent: 0, duration: 1.25, stagger: 0.085, ease: 'power4.out' },
        0.05
      )
      .to(fades, { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.08 }, 0.45);

    if (badge) {
      timeline.to(
        badge,
        { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.6)' },
        0.6
      );
    }

    if (video) {
      timeline.fromTo(
        video,
        { scale: 1.08 },
        { scale: 1, duration: 2.2, ease: 'expo.out' },
        0
      );

      // Works once a real source is added; harmless with a poster-only video.
      video.play?.().catch(() => {});
    }
  };

  return { play };
}
