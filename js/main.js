/**
 * Open Softwares — Main JavaScript (Shared)
 * Handles: Mobile Navigation, Sticky Header, Focus Trap, Scroll Reveal Animations
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Mobile Slide-in Drawer Navigation & Focus Trap
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  let previouslyFocusedElement = null;

  function openMobileNav() {
    if (!mobileDrawer || !navToggle) return;
    previouslyFocusedElement = document.activeElement;

    mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus on close button or first interactive link
    setTimeout(() => {
      if (drawerCloseBtn) {
        drawerCloseBtn.focus();
      } else {
        const firstFocusable = mobileDrawer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
      }
    }, 100);
  }

  function closeMobileNav() {
    if (!mobileDrawer || !navToggle) return;

    mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close when clicking any menu link inside drawer
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Esc key & trap focus
  document.addEventListener('keydown', function (e) {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeMobileNav();
      }

      if (e.key === 'Tab') {
        const focusables = mobileDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }
  });

  // -------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  function handleScrollHeader() {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // -------------------------------------------------------------------------
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // -------------------------------------------------------------------------
  // 4. Smooth Anchor Scrolling with Header Offset
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });
})();
