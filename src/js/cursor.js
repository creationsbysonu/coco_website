/**
 * Custom paw cursor.
 * Uses GSAP quickTo for cheap, lag-free pointer following and only activates
 * on precise pointers. The native cursor is restored for reduced-motion users
 * and on touch devices.
 */
import { gsap } from 'gsap';
import { isFinePointer, prefersReducedMotion } from './utils.js';

export function initCursor() {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor || !isFinePointer() || prefersReducedMotion()) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  let visible = false;
  let positioned = false;

  const show = () => {
    if (visible) return;
    visible = true;
    // Hide the native cursor only once the paw is actually visible.
    document.documentElement.classList.add('has-custom-cursor');
    // "auto" restricts the overwrite to opacity/visibility so it cannot cancel
    // the x/y quickTo tweens that move the paw.
    gsap.to(cursor, { autoAlpha: 1, duration: 0.25, overwrite: 'auto' });
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    document.documentElement.classList.remove('has-custom-cursor');
    gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
        return;
      }

      if (!positioned) {
        // First movement: jump straight to the pointer instead of flying in
        // from the top-left corner.
        positioned = true;
        gsap.set(cursor, { x: event.clientX, y: event.clientY });
      } else {
        moveX(event.clientX);
        moveY(event.clientY);
      }

      show();
    },
    { passive: true }
  );

  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  window.addEventListener('blur', () => cursor.classList.remove('is-active', 'is-down'));
  document.documentElement.addEventListener('mouseleave', hide);

  // Highlight the paw over anything actionable.
  document.addEventListener(
    'pointerover',
    (event) => {
      const interactive = event.target.closest?.('a, button, [data-cursor-hover]');
      cursor.classList.toggle('is-active', Boolean(interactive));
    },
    { passive: true }
  );

  document.addEventListener(
    'pointerout',
    (event) => {
      const next = event.relatedTarget?.closest?.('a, button, [data-cursor-hover]');
      cursor.classList.toggle('is-active', Boolean(next));
    },
    { passive: true }
  );
}
