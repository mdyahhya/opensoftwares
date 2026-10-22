/**
 * OpenSoftwares — Home Page JavaScript (js/home.js)
 * Implements:
 * 1. Image Slider (crossfade + Ken Burns, saffron progress bar, swipe, arrow keys)
 * 2. Parallax mouse-move on desktop hero slider
 * 3. Interactive Android App Phone Mockup (5 tabs, sliding saffron indicator, auto-demo)
 * 4. Schoolmate ERP Mockup (scaled to container, clickable modules, auto-cycle)
 * 5. Scroll-triggered animated number counters (Stats section)
 * 6. Hero underline SVG draw animation
 * 7. ERP mockup responsive scaling via ResizeObserver
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. Hero Underline SVG Draw
  // =========================================================================
  const underlinePath = document.querySelector('.hero-underline-path');
  if (underlinePath) {
    // Trigger draw after a brief delay
    setTimeout(() => {
      underlinePath.classList.add('draw');
    }, 600);
  }

  // =========================================================================
  // 2. Image Slider (crossfade, progress bar, Ken Burns, swipe, arrow keys)
  // =========================================================================
  function initSlider(wrapperSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const slides       = Array.from(wrapper.querySelectorAll('.slide-item'));
    const prevBtn      = wrapper.querySelector('.slider-arrow-prev');
    const nextBtn      = wrapper.querySelector('.slider-arrow-next');
    const progressWrap = wrapper.querySelector('.slider-progress-bar');
    const DELAY        = 5500;

    if (!slides.length) return;

    let current = 0;
    let timer   = null;
    let touchX  = 0;

    // Build progress segments
    if (progressWrap) {
      progressWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const seg = document.createElement('div');
        seg.className = 'slider-progress-segment';
        if (i === 0) seg.classList.add('filling');
        progressWrap.appendChild(seg);
      });
    }

    function getSegs() {
      return progressWrap ? Array.from(progressWrap.querySelectorAll('.slider-progress-segment')) : [];
    }

    function showSlide(idx) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        // Reset Ken Burns by cloning inner img/object
        if (i === idx) {
          const img = s.querySelector('img');
          if (img && !prefersReducedMotion) {
            img.style.animation = 'none';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => { img.style.animation = ''; });
            });
          }
        }
      });

      const segs = getSegs();
      segs.forEach((seg, i) => {
        seg.classList.remove('filling', 'done');
        if (i < idx)  seg.classList.add('done');
        if (i === idx) {
          // Force reflow to restart animation
          void seg.offsetWidth;
          seg.style.setProperty('--slide-duration', DELAY + 'ms');
          seg.classList.add('filling');
        }
      });

      current = idx;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    function startAuto() {
      if (prefersReducedMotion) return;
      stopAuto();
      timer = setInterval(nextSlide, DELAY);
    }

    function stopAuto() {
      clearInterval(timer);
      timer = null;
    }

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);

    // Touch swipe
    wrapper.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; stopAuto(); }, { passive: true });
    wrapper.addEventListener('touchend',   e => {
      const diff = e.changedTouches[0].screenX - touchX;
      if (diff < -45)  nextSlide();
      else if (diff > 45) prevSlide();
      startAuto();
    }, { passive: true });

    // Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });

    // Arrow keys (when focused in slider area)
    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { prevSlide(); startAuto(); }
      if (e.key === 'ArrowRight') { nextSlide(); startAuto(); }
    });

    showSlide(0);
    startAuto();
  }

  initSlider('.hero-slider-card');

  // =========================================================================
  // 3. Parallax on desktop hero slider (mouse move)
  // =========================================================================
  const desktopSliderWrap = document.querySelector('.hero-slider-col');
  if (desktopSliderWrap && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const slider = desktopSliderWrap.querySelector('.hero-slider-card');
      if (slider) {
        slider.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
      }
    });
  }

  // =========================================================================
  // 4. Interactive Android App Phone Mockup
  // =========================================================================
  const phoneTabs    = document.querySelectorAll('.phone-tab-btn');
  const phoneScreens = document.querySelectorAll('.phone-screen');
  const tabIndicator = document.querySelector('.tab-indicator');

  let currentTab    = 0;
  let autoDemoTimer = null;
  let pauseTimer    = null;
  const AUTO_INTERVAL = 4000;
  const PAUSE_AFTER   = 10000;

  function setTab(idx, byUser = false) {
    if (idx < 0 || idx >= phoneTabs.length) return;
    currentTab = idx;

    phoneTabs.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
      btn.setAttribute('aria-selected', String(i === idx));
    });

    phoneScreens.forEach((screen, i) => {
      screen.classList.toggle('active', i === idx);
    });

    if (tabIndicator) {
      tabIndicator.style.transform = `translateX(${idx * 100}%)`;
    }

    if (byUser) {
      stopAutoDemo();
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(startAutoDemo, PAUSE_AFTER);
    }
  }

  function startAutoDemo() {
    if (prefersReducedMotion) return;
    stopAutoDemo();
    autoDemoTimer = setInterval(() => {
      setTab((currentTab + 1) % phoneTabs.length);
    }, AUTO_INTERVAL);
  }

  function stopAutoDemo() {
    clearInterval(autoDemoTimer);
    autoDemoTimer = null;
  }

  phoneTabs.forEach((btn, idx) => {
    btn.addEventListener('click', () => setTab(idx, true));
  });

  if (phoneTabs.length > 0) {
    setTab(0);
    startAutoDemo();
  }

  // =========================================================================
  // 5. Schoolmate ERP Mockup — scaling + module switching + auto-cycle
  // =========================================================================
  const erpHost   = document.querySelector('.erp-mockup-host');
  const erpScaler = document.querySelector('.erp-mockup-scaler');
  const erpCanvas = document.querySelector('.erp-mockup-canvas');
  const erpModBtns = document.querySelectorAll('.erp-module-btn');
  const erpPanels  = document.querySelectorAll('.erp-panel-view');

  const DESIGN_WIDTH  = 1200;
  const DESIGN_HEIGHT = 760;

  function scaleErpMockup() {
    if (!erpScaler || !erpCanvas || !erpHost) return;
    const containerWidth = erpHost.getBoundingClientRect().width;
    const scale = containerWidth / DESIGN_WIDTH;
    erpCanvas.style.transform = `scale(${scale})`;
    erpScaler.style.height = (DESIGN_HEIGHT * scale) + 'px';
  }

  scaleErpMockup();

  if ('ResizeObserver' in window && erpHost) {
    const ro = new ResizeObserver(scaleErpMockup);
    ro.observe(erpHost);
  } else {
    window.addEventListener('resize', scaleErpMockup);
  }

  // Module switching
  let currentErpModule = 0;
  let erpAutoTimer = null;

  function setErpModule(idx, byUser = false) {
    const btns   = Array.from(erpModBtns);
    const panels = Array.from(erpPanels);
    if (idx < 0 || idx >= btns.length) return;
    currentErpModule = idx;

    btns.forEach((b, i) => {
      b.classList.toggle('active', i === idx);
      b.setAttribute('aria-selected', String(i === idx));
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    // Animate chart line if dashboard
    const chartLine = document.querySelector('.erp-panel-view.active .erp-chart-line');
    if (chartLine) {
      chartLine.classList.remove('draw');
      void chartLine.offsetWidth;
      chartLine.classList.add('draw');
    }

    if (byUser) {
      stopErpAuto();
    }
  }

  function startErpAuto() {
    if (prefersReducedMotion) return;
    stopErpAuto();
    erpAutoTimer = setInterval(() => {
      setErpModule((currentErpModule + 1) % erpModBtns.length);
    }, 4000);
  }

  function stopErpAuto() {
    clearInterval(erpAutoTimer);
    erpAutoTimer = null;
  }

  erpModBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => setErpModule(idx, true));
  });

  if (erpModBtns.length > 0) {
    setErpModule(0);
    // Start auto-cycle when ERP section is visible
    if ('IntersectionObserver' in window && erpHost) {
      const erpObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startErpAuto();
            } else {
              stopErpAuto();
            }
          });
        },
        { threshold: 0.3 }
      );
      erpObserver.observe(erpHost);
    }
  }

  // =========================================================================
  // 6. Animated Number Counters (Stats section)
  // =========================================================================
  const statEls = document.querySelectorAll('[data-target]');
  let counted   = false;

  function animateCounters() {
    if (counted) return;
    counted = true;
    statEls.forEach(el => {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 2000;
      const frames   = Math.round(duration / (1000 / 60));
      let frame = 0;

      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const tick = setInterval(() => {
        frame++;
        const progress = easeOut(frame / frames);
        const val      = Math.round(target * progress);
        el.textContent = val.toLocaleString() + suffix;
        if (frame >= frames) {
          clearInterval(tick);
          el.textContent = target.toLocaleString() + suffix;
        }
      }, 1000 / 60);
    });
  }

  const statsSection = document.getElementById('statsSection');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { animateCounters(); statsObs.unobserve(e.target); }
        });
      },
      { threshold: 0.3 }
    );
    statsObs.observe(statsSection);
  } else if (statsSection) {
    animateCounters();
  }

  // =========================================================================
  // 7. ERP chart draw on panel activation
  // =========================================================================
  // Triggered on initial ERP section visibility
  const erpSection = document.querySelector('.erp-section');
  if (erpSection && 'IntersectionObserver' in window) {
    const erpVisObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const chartLine = document.querySelector('.erp-chart-line');
            if (chartLine) {
              chartLine.classList.remove('draw');
              void chartLine.offsetWidth;
              chartLine.classList.add('draw');
            }
            erpVisObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    erpVisObs.observe(erpSection);
  }

})();
