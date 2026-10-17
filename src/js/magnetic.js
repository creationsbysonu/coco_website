/**
 * Magnetic buttons.
 * A gentle pull toward the pointer adds tactility without interfering with
 * clicks or keyboard focus. Desktop + fine pointer only.
 */
import { gsap } from 'gsap';
import { isFinePointer, prefersReducedMotion } from './utils.js';

export function initMagnetic() {
  if (!isFinePointer() || prefersReducedMotion()) return;

  const buttons = document.querySelectorAll('[data-magnetic]');

  buttons.forEach((button) => {
    const strength = 0.3;
    const moveX = gsap.quickTo(button, 'x', { duration: 0.5, ease: 'power3' });
    const moveY = gsap.quickTo(button, 'y', { duration: 0.5, ease: 'power3' });

    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * strength);
      moveY((event.clientY - rect.top - rect.height / 2) * strength);
    });

    button.addEventListener('pointerleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto',
      });
    });

    button.addEventListener('blur', () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
}
