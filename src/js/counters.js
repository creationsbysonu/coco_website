/**
 * Number counters.
 * The accessible label lives on the <p> in the markup, so the rapidly changing
 * visual value is hidden from screen readers. Numbers animate once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || prefersReducedMotion()) return;

  const format = (element) => {
    const end = Number(element.dataset.count) || 0;
    const decimals = Number(element.dataset.decimals) || 0;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';

    return (value) =>
      `${prefix}${decimals ? value.toFixed(decimals) : Math.round(value)}${suffix}`;
  };

  counters.forEach((element) => {
    const toText = format(element);

    // Start from zero; the preloader hides this initial state on first paint.
    element.textContent = toText(0);

    const target = Number(element.dataset.count) || 0;
    const proxy = { value: 0 };

    ScrollTrigger.create({
      trigger: element.closest('.stat') || element,
      start: 'top 86%',
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          value: target,
          duration: 1.9,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = toText(proxy.value);
          },
        });
      },
    });
  });
}
