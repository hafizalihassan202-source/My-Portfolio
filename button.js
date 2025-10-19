// ...new file...
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // create back-to-top button if not present
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.title = 'Back to top';
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      document.body.appendChild(btn);
    }

    const SHOW_OFFSET = 300;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // toggle visibility
    const toggle = () => btn.classList.toggle('show', window.pageYOffset > SHOW_OFFSET);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });

    // click -> smooth scroll to top (respect reduced motion)
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (prefersReduced) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
})();