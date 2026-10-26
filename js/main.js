/**
 * OpenSoftwares — Main JavaScript (js/main.js)
 * Handles: Floating Pill Nav, Mobile Overlay Menu, Scroll Reveal (IntersectionObserver)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Floating Header — shrink on scroll
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');

  if (siteHeader) {
    function handleHeaderScroll() {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // =========================================================================
  // 2. Mobile Full-Screen Overlay Menu
  // =========================================================================
  const navToggle   = document.getElementById('navToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const overlayClose  = document.getElementById('overlayClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  let overlayOpen = false;
  let prevFocused = null;

  function openOverlay() {
    if (!mobileOverlay || overlayOpen) return;
    overlayOpen = true;
    prevFocused = document.activeElement;

    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');

    // Focus trap — focus first link
    const firstFocusable = mobileOverlay.querySelector('a, button');
    setTimeout(() => { if (firstFocusable) firstFocusable.focus(); }, 100);
  }

  function closeOverlay() {
    if (!mobileOverlay || !overlayOpen) return;
    overlayOpen = false;

    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';

    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

    if (prevFocused && typeof prevFocused.focus === 'function') {
      prevFocused.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (overlayOpen) closeOverlay(); else openOverlay();
    });
  }

  if (overlayClose) {
    overlayClose.addEventListener('click', closeOverlay);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeOverlay);
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
  });

  // Focus trap inside overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        mobileOverlay.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.disabled);
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  // =========================================================================
  // 3. Scroll Reveal Animations via IntersectionObserver
  // =========================================================================
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // =========================================================================
  // 4. Smooth anchor scroll with header offset
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 5. Live clock in phone status bar
  // =========================================================================
  function updatePhoneClock() {
    const clockEls = document.querySelectorAll('.phone-status-time');
    if (!clockEls.length) return;
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = ((h % 12) || 12);
    const timeStr = `${h12}:${m} ${ampm}`;
    clockEls.forEach(el => { el.textContent = timeStr; });
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);

  // =========================================================================
  // 6. Loading Splash Screen (First visit per session)
  // =========================================================================
  const siteSplash = document.getElementById('siteSplash');
  if (siteSplash) {
    const SPLASH_KEY = 'opensoftwares_splash_shown';
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem(SPLASH_KEY)) {
      siteSplash.remove();
    } else {
      document.body.classList.add('splash-locked');
      let splashDismissed = false;

      function dismissSplash() {
        if (splashDismissed) return;
        splashDismissed = true;
        try { sessionStorage.setItem(SPLASH_KEY, 'true'); } catch (e) {}

        siteSplash.classList.add('splash-dismissed');
        document.body.classList.remove('splash-locked');

        setTimeout(() => {
          if (siteSplash.parentNode) siteSplash.parentNode.removeChild(siteSplash);
        }, 850);
      }

      siteSplash.addEventListener('click', dismissSplash);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          dismissSplash();
        }
      });

      const minAnimationTime = isReducedMotion ? 400 : 1700;
      const startTime = Date.now();

      function scheduleDismiss() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minAnimationTime - elapsed);
        setTimeout(dismissSplash, remaining);
      }

      if (document.readyState === 'complete') {
        scheduleDismiss();
      } else {
        window.addEventListener('load', scheduleDismiss);
        setTimeout(dismissSplash, 2000);
      }
    }
  }

  // =========================================================================
  // 7. Prefetch internal pages on hover / touchstart
  // =========================================================================
  if ('IntersectionObserver' in window) {
    const prefetched = new Set();
    function prefetchHref(href) {
      if (!href || prefetched.has(href)) return;
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        prefetched.add(href);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = 'document';
        document.head.appendChild(link);
      } catch (e) {}
    }

    document.querySelectorAll('a[href]').forEach(a => {
      const onPrefetch = () => prefetchHref(a.getAttribute('href'));
      a.addEventListener('mouseenter', onPrefetch, { once: true, passive: true });
      a.addEventListener('touchstart', onPrefetch, { once: true, passive: true });
    });
  }

  // Speculation Rules for instant navigation
  if (!document.querySelector('script[type="speculationrules"]')) {
    try {
      const sr = document.createElement('script');
      sr.type = 'speculationrules';
      sr.textContent = JSON.stringify({
        prefetch: [{ source: 'list', urls: ['index.html', 'products.html', 'about.html', 'contact.html', 'schoolmate.html'] }]
      });
      document.head.appendChild(sr);
    } catch (e) {}
  }

})();

