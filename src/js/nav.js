/**
 * Navigation
 * - Adds a solid, bordered state after scrolling.
 * - Highlights the section currently in view.
 * - Runs the mobile menu as an accessible, scroll-locked overlay.
 */
import { lockScroll, unlockScroll } from './utils.js';

export function initNav({ lenis }) {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const toggle = nav.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const main = document.getElementById('main-content');
  const footer = document.getElementById('footer');
  const brand = nav.querySelector('.brand');
  const inner = nav.querySelector('.site-nav__inner');

  /* --- Backdrop tone ----------------------------------------------------
     The glass pill is transparent, so its tint and type colour flip based on
     whether a dark or light section sits behind it (see [data-nav-tone]). */
  const toneNodes = [...document.querySelectorAll('[data-nav-tone]')];

  const updateTone = () => {
    if (!inner) return;

    // The mobile overlay paints its own (butter) backdrop behind the nav.
    if (menu?.classList.contains('is-open')) {
      nav.dataset.tone = 'light';
      return;
    }

    const rect = inner.getBoundingClientRect();
    const probeY = rect.top + rect.height / 2;
    let tone = 'light';

    for (const node of toneNodes) {
      const bounds = node.getBoundingClientRect();
      if (bounds.top <= probeY && bounds.bottom >= probeY) {
        tone = node.dataset.navTone || 'light';
        break;
      }
    }

    nav.dataset.tone = tone;
  };

  // rAF-throttle so the per-frame hit test never blocks scrolling.
  let toneFrame = 0;
  const scheduleTone = () => {
    if (toneFrame) return;
    toneFrame = window.requestAnimationFrame(() => {
      toneFrame = 0;
      updateTone();
    });
  };

  /* --- Scrolled state ---------------------------------------------------- */
  const updateScrollState = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 26);
    scheduleTone();
  };
  updateScrollState();
  updateTone();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', scheduleTone, { passive: true });

  /* --- Active section ---------------------------------------------------- */
  const navLinks = [...nav.querySelectorAll('[data-nav-link]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const visible = new Map();

    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });

        let bestId = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestId = id;
            bestRatio = ratio;
          }
        });

        if (bestId) setCurrent(bestId);
      },
      {
        // A slim reading line just below the middle of the viewport.
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.05, 0.25, 0.5, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* --- Mobile menu ------------------------------------------------------- */
  if (!toggle || !menu) return;

  const menuLinks = [...menu.querySelectorAll('a')];
  let isOpen = false;

  const getFocusable = () => [toggle, ...menuLinks];

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;

    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    menu.scrollTop = 0;

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');

    // Keep the page behind the overlay out of the tab order.
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    brand?.setAttribute('inert', '');

    lockScroll(lenis);
    updateTone();

    window.setTimeout(() => {
      menuLinks[0]?.focus({ preventScroll: true });
    }, 160);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');

    main?.removeAttribute('inert');
    footer?.removeAttribute('inert');
    brand?.removeAttribute('inert');

    unlockScroll(lenis);
    updateTone();

    if (restoreFocus) {
      window.setTimeout(() => toggle.focus({ preventScroll: true }), 20);
    }
  };

  toggle.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    // Simple focus trap: the overlay behaves like a modal dialog.
    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Close the overlay if the viewport grows back to desktop size.
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu({ restoreFocus: false });
  });
}
