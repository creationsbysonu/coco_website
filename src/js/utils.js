/**
 * Small shared helpers used across modules.
 */

/** True when the visitor asked the OS to reduce motion. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for mouse / trackpad / stylus devices, false for most touch screens. */
export function isFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Reference-counted scroll lock.
 * Multiple overlays (preloader, mobile menu, lightbox) can request a lock
 * without one of them accidentally unlocking the page for another.
 */
let scrollLocks = 0;

export function lockScroll(lenis) {
  scrollLocks += 1;
  document.documentElement.classList.add('is-locked');
  lenis?.stop();
}

export function unlockScroll(lenis) {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) {
    document.documentElement.classList.remove('is-locked');
    lenis?.start();
  }
}

/** Pad a number for UI counters (1 -> "01"). */
export function pad2(value) {
  return String(value).padStart(2, '0');
}
