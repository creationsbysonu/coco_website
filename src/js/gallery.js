/**
 * Gallery lightbox + hover previews.
 * Uses the native <dialog> element for top-layer rendering and built-in focus
 * trapping, with Lenis paused while the dialog is open.
 */
import { lockScroll, unlockScroll, prefersReducedMotion, pad2 } from './utils.js';

export function initGallery({ lenis }) {
  const dialog = document.querySelector('[data-lightbox]');
  const items = [...document.querySelectorAll('[data-gallery-item]')];
  if (!dialog || !items.length) return;

  const image = dialog.querySelector('[data-lightbox-img]');
  const video = dialog.querySelector('[data-lightbox-video]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const meta = dialog.querySelector('[data-lightbox-meta]');
  const counter = dialog.querySelector('[data-lightbox-count]');
  const closeButton = dialog.querySelector('[data-lightbox-close]');
  const prevButton = dialog.querySelector('[data-lightbox-prev]');
  const nextButton = dialog.querySelector('[data-lightbox-next]');

  let index = 0;
  let isOpen = false;
  let lastTrigger = null;
  let customCursorWasActive = false;

  const resetVideo = () => {
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    video.poster = '';
    video.load();
    video.hidden = true;
  };

  const render = () => {
    const item = items[index];
    if (!item) return;

    const sourceImage = item.querySelector('img');
    caption.textContent = item.dataset.caption || 'Coco the Orange';
    meta.textContent = item.dataset.type || 'Gallery';
    counter.textContent = `${pad2(index + 1)} / ${pad2(items.length)}`;

    // Reels play inline; photos use the hi-res data-full still.
    if (item.dataset.video && video) {
      image.hidden = true;
      video.hidden = false;
      video.poster = item.dataset.full || '';
      video.src = item.dataset.video;
      video.currentTime = 0;
      video.play?.().catch(() => {});
      return;
    }

    resetVideo();
    image.hidden = false;
    image.src = item.dataset.full || sourceImage?.src || '';
    image.alt = sourceImage?.alt || item.dataset.caption || '';
  };

  const open = (itemIndex, trigger) => {
    index = itemIndex;
    lastTrigger = trigger;
    render();
    dialog.showModal();
    isOpen = true;

    // The custom paw lives below the dialog's top layer. Restore the native
    // cursor while the lightbox is open so pointer feedback never disappears.
    if (document.documentElement.classList.contains('has-custom-cursor')) {
      customCursorWasActive = true;
      document.documentElement.classList.remove('has-custom-cursor');
    }

    lockScroll(lenis);
    // Move focus predictably inside the dialog.
    window.setTimeout(() => closeButton?.focus({ preventScroll: true }), 30);
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const step = (direction) => {
    index = (index + direction + items.length) % items.length;
    render();
  };

  items.forEach((item, itemIndex) => {
    item.addEventListener('click', () => open(itemIndex, item));

    // A subtle extra: play the reel on hover once a real source is added.
    const video = item.querySelector('[data-gallery-video]');
    if (video && !prefersReducedMotion()) {
      item.addEventListener('pointerenter', () => {
        const attempt = video.play?.();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      });
      item.addEventListener('pointerleave', () => video.pause());
    }
  });

  closeButton?.addEventListener('click', close);
  prevButton?.addEventListener('click', () => step(-1));
  nextButton?.addEventListener('click', () => step(1));

  // Clicking the backdrop (the dialog itself, outside its inner content) closes.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  });

  dialog.addEventListener('close', () => {
    if (!isOpen) return;
    isOpen = false;
    resetVideo();
    unlockScroll(lenis);

    if (customCursorWasActive) {
      document.documentElement.classList.add('has-custom-cursor');
      customCursorWasActive = false;
    }

    // Return focus to the card that opened the dialog.
    if (lastTrigger) {
      lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    }
  });
}
