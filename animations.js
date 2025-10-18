// ...existing code...
(function () {
  'use strict';

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    // Still enable smooth native scrolling fallback for anchors
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }

  // load external script helper
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Load libraries (GSAP core + ScrollTrigger, SmoothScroll)
  Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'),
    loadScript('https://cdn.jsdelivr.net/npm/smooth-scroll@16/dist/smooth-scroll.polyfills.min.js')
  ]).then(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Smooth anchor scrolling (takes existing anchors with href="#id")
    try {
      const smooth = new window.SmoothScroll('a[href^="#"]', {
        speed: 600,
        offset: function (anchor, toggle) {
          // try to account for fixed navbar height if present
          const nav = document.querySelector('.navbar');
          return nav ? nav.getBoundingClientRect().height + 8 : 20;
        },
        updateURL: false
      });
    } catch (e) {
      // ignore if SmoothScroll fails
    }

    // Utility: reveal single elements with fade-up
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.fromTo(el,
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // Utility: reveal container children with stagger (class .reveal)
    gsap.utils.toArray('.reveal').forEach((container) => {
      const children = gsap.utils.toArray(container.children);
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 14, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.52, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: container, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // Cards: subtle entrance animation
    gsap.utils.toArray('.card').forEach((card) => {
      gsap.fromTo(card,
        { y: 12, opacity: 0, scale: 0.995 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
        }
      );
    });

    // Progress bars: animate width from 0 -> data-progress or inline style percent when visible
    gsap.utils.toArray('.progress .progress-bar').forEach((bar) => {
      const initial = bar.style.width || bar.getAttribute('aria-valuenow') || bar.dataset.progress || '0%';
      const target = (bar.dataset.progress) ? bar.dataset.progress : initial;
      // normalize percent
      const p = String(target).trim();
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: p, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: bar, start: 'top 95%', toggleActions: 'play none none none' }
        }
      );
    });

    // Simple nav scroll-spy using ScrollTrigger: toggle .active on .nav-link
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      ScrollTrigger.create({
        trigger: target,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        },
        onEnterBack: () => {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Optional: subtle hover micro-interaction for svg icons (increase transform on hover handled by CSS too)
    // (Left intentionally minimal; CSS handles the bulk of hover transitions)

    // Clean up ScrollTrigger on hot-reload (dev) if needed
    if (module && module.hot && module.hot.dispose) {
      module.hot.dispose(() => {
        ScrollTrigger.getAll().forEach(st => st.kill());
      });
    }

  }).catch((err) => {
    // If libraries fail to load, enable native smooth scroll fallback
    document.documentElement.style.scrollBehavior = 'smooth';
    console.error('Animation libraries failed to load:', err);
  });

})();