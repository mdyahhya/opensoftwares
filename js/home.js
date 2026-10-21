/**
 * OpenSoftwares — Home Page JavaScript (js/home.js)
 * Implements:
 * 1. Top Image Slider (5 slides, touch swipe, dots below, hover pause)
 * 2. Interactive Android App Phone Mockup: 5 tabs with animated sliding indicator,
 *    smooth screen transitions, auto-demo with 10s pause on user click, synced feature labels.
 * 3. Schoolmate ERP Mockup: sidebar / mobile horizontal chip switcher, animated panels.
 * 4. Scroll-Triggered Animated Number Counters for Statistics.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Image Slider (5 Slides, Dots Below)
  // =========================================================================
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide-item');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  const sliderWrapper = document.getElementById('sliderWrapper');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;
  const AUTOPLAY_DELAY = 5000;

  let touchStartX = 0;
  let touchEndX = 0;

  function updateSlider() {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (sliderTrack && totalSlides > 0) {
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
      });
    }

    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopAutoplay);
      sliderWrapper.addEventListener('mouseleave', startAutoplay);

      sliderWrapper.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoplay();
        },
        { passive: true }
      );

      sliderWrapper.addEventListener(
        'touchend',
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (diff < -45) nextSlide();
          else if (diff > 45) prevSlide();
          startAutoplay();
        },
        { passive: true }
      );
    }

    startAutoplay();
  }

  // =========================================================================
  // 2. Interactive Android App Mockup (5 Tabs + Sliding Pill + Auto-Demo)
  // =========================================================================
  const phoneTabs = document.querySelectorAll('.phone-tab-btn');
  const phoneScreens = document.querySelectorAll('.phone-screen');
  const tabIndicator = document.getElementById('phoneTabIndicator');
  const appFeatureLabels = document.querySelectorAll('.app-label-item');

  let currentPhoneTabIndex = 0;
  const totalPhoneTabs = phoneTabs.length;
  let autoDemoTimer = null;
  let userInteractionTimeout = null;
  const AUTO_DEMO_INTERVAL = 4000;
  const USER_PAUSE_DELAY = 10000;

  function setPhoneTab(index, triggeredByUser = false) {
    if (index < 0 || index >= totalPhoneTabs) return;
    currentPhoneTabIndex = index;

    // 1. Move sliding pill indicator
    if (tabIndicator) {
      tabIndicator.style.transform = `translateX(${index * 100}%)`;
    }

    // 2. Update Tab buttons
    phoneTabs.forEach((tab, idx) => {
      if (idx === index) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // 3. Swap Screen inside phone
    phoneScreens.forEach((screen, idx) => {
      if (idx === index) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    // 4. Sync feature labels beside the phone
    appFeatureLabels.forEach((label) => {
      const targetIndex = parseInt(label.getAttribute('data-tab-index'), 10);
      if (targetIndex === index) {
        label.classList.add('active');
        label.setAttribute('aria-selected', 'true');
      } else {
        label.classList.remove('active');
        label.setAttribute('aria-selected', 'false');
      }
    });

    // 5. If triggered by user, pause auto-demo for 10 seconds
    if (triggeredByUser) {
      pauseAutoDemoFor10s();
    }
  }

  function nextPhoneTab() {
    const nextIdx = (currentPhoneTabIndex + 1) % totalPhoneTabs;
    setPhoneTab(nextIdx, false);
  }

  function startAutoDemo() {
    stopAutoDemo();
    autoDemoTimer = setInterval(nextPhoneTab, AUTO_DEMO_INTERVAL);
  }

  function stopAutoDemo() {
    if (autoDemoTimer) {
      clearInterval(autoDemoTimer);
      autoDemoTimer = null;
    }
  }

  function pauseAutoDemoFor10s() {
    stopAutoDemo();
    if (userInteractionTimeout) {
      clearTimeout(userInteractionTimeout);
    }
    userInteractionTimeout = setTimeout(() => {
      startAutoDemo();
    }, USER_PAUSE_DELAY);
  }

  // Click on phone bottom tabs
  phoneTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      setPhoneTab(idx, true);
    });
  });

  // Click on side feature labels
  appFeatureLabels.forEach((label) => {
    label.addEventListener('click', () => {
      const targetIndex = parseInt(label.getAttribute('data-tab-index'), 10);
      if (!isNaN(targetIndex)) {
        setPhoneTab(targetIndex, true);
      }
    });
  });

  if (phoneTabs.length > 0) {
    startAutoDemo();
  }

  // =========================================================================
  // 3. Schoolmate ERP Mockup: Modules Switcher
  // =========================================================================
  const erpModules = document.querySelectorAll('.erp-module-btn');
  const erpPanels = document.querySelectorAll('.erp-panel-view');

  if (erpModules.length > 0 && erpPanels.length > 0) {
    erpModules.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetPanelId = this.getAttribute('data-erp-panel');

        erpModules.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        erpPanels.forEach((p) => p.classList.remove('active'));

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const activePanel = document.getElementById(targetPanelId);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  // =========================================================================
  // 4. Stats Counter (Animated On Scroll)
  // =========================================================================
  const statElements = document.querySelectorAll('.stat-count');
  let statsCounted = false;

  function animateCounters() {
    if (statsCounted) return;
    statsCounted = true;

    statElements.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const easeOutQuad = (t) => t * (2 - t);

      const timer = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentVal = Math.round(target * progress);

        counter.textContent = currentVal.toLocaleString();

        if (frame >= totalFrames) {
          clearInterval(timer);
          counter.textContent = target.toLocaleString();
        }
      }, frameDuration);
    });
  }

  const statsSection = document.getElementById('statsSection');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsSection);
  } else if (statsSection) {
    animateCounters();
  }
})();
