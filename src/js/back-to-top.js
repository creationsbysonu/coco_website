/**
 * Back-to-top button.
 * Scrolls to the hero with Lenis and returns focus to the top of the page for
 * keyboard and screen-reader users.
 */
import { prefersReducedMotion } from './utils.js';

export function initBackToTop({ lenis }) {
  const button = document.querySelector('[data-back-to-top]');
  const main = document.getElementById('main-content');
  if (!button) return;

  button.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }

    window.setTimeout(() => {
      main?.focus({ preventScroll: true });
    }, 60);
  });
}
