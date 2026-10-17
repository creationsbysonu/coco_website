/**
 * Scroll-driven animation system.
 * Every effect only touches transform / opacity, is triggered once (except
 * parallax) and is skipped entirely for reduced-motion visitors.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initReveals() {
  if (prefersReducedMotion()) return null;

  const context = gsap.context(() => {
    /* --- Individual fade-up reveals ------------------------------------- */
    gsap.utils.toArray('[data-reveal]').forEach((element) => {
      const delay = Number(element.dataset.revealDelay || 0);

      gsap.from(element, {
        y: 34,
        autoAlpha: 0,
        duration: 1.05,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      });
    });

    /* --- Staggered groups (cards, facts, gallery) ----------------------- */
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      const children = group.querySelectorAll('[data-reveal-child]');
      if (!children.length) return;

      gsap.from(children, {
        y: 42,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          once: true,
        },
      });
    });

    /* --- Masked headline lines ------------------------------------------ */
    gsap.utils.toArray('[data-lines]').forEach((title) => {
      const lines = title.querySelectorAll('.line-inner');
      if (!lines.length) return;

      gsap.from(lines, {
        yPercent: 112,
        duration: 1.15,
        stagger: 0.09,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 87%',
          once: true,
        },
      });
    });

    /* --- Slow parallax on hero doodles ---------------------------------- */
    gsap.matchMedia().add('(min-width: 768px)', () => {
      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        const speed = Number(element.dataset.parallax) || 0.1;

        gsap.to(element, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: element.closest('section') || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    /* --- Bouncy footer wordmark ----------------------------------------- */
    const footerLetters = gsap.utils.toArray('.wordmark__letter');
    if (footerLetters.length) {
      gsap.from(footerLetters, {
        yPercent: 112,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.wordmark',
          start: 'top 94%',
          once: true,
        },
      });
    }
  });

  return context;
}
