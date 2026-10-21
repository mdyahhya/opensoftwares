/**
 * Open Softwares — Home Page JavaScript (js/home.js)
 * Implements:
 * 1. Touch-enabled Auto-playing Slider with Arrows, Dots, and Hover-Pause
 * 2. Animated Android App Mockup cycling with synced label highlights & click-to-view
 * 3. Desktop ERP Interactive Dashboard Tab Switcher & Animated Charts
 * 4. Scroll-Triggered Animated Number Counters for Maharashtra Statistics
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Image Slider (Directly below Hero)
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

  // Touch variables
  let touchStartX = 0;
  let touchEndX = 0;

  function updateSlider() {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
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
    // Generate dots
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

    // Pause on hover
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopAutoplay);
      sliderWrapper.addEventListener('mouseleave', startAutoplay);

      // Touch events for mobile swiping
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
          handleSwipe();
          startAutoplay();
        },
        { passive: true }
      );
    }

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      const threshold = 50;
      if (swipeDistance < -threshold) {
        nextSlide();
      } else if (swipeDistance > threshold) {
        prevSlide();
      }
    }

    startAutoplay();
  }

  // =========================================================================
  // 2. Android App Showcase: Cyclic Screen Switcher & Label Highlights
  // =========================================================================
  const appScreens = document.querySelectorAll('.phone-screen');
  const appLabels = document.querySelectorAll('.app-label-item');
  let currentAppIndex = 0;
  const totalAppScreens = appScreens.length;
  let appCycleTimer = null;
  const APP_CYCLE_DELAY = 4200;

  function setAppScreen(index) {
    if (index < 0 || index >= totalAppScreens) return;
    currentAppIndex = index;

    appScreens.forEach((screen, idx) => {
      if (idx === index) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    appLabels.forEach((label, idx) => {
      if (idx === index) {
        label.classList.add('active');
        label.setAttribute('aria-selected', 'true');
      } else {
        label.classList.remove('active');
        label.setAttribute('aria-selected', 'false');
      }
    });
  }

  function nextAppScreen() {
    const nextIdx = (currentAppIndex + 1) % totalAppScreens;
    setAppScreen(nextIdx);
  }

  function startAppLoop() {
    stopAppLoop();
    appCycleTimer = setInterval(nextAppScreen, APP_CYCLE_DELAY);
  }

  function stopAppLoop() {
    if (appCycleTimer) {
      clearInterval(appCycleTimer);
      appCycleTimer = null;
    }
  }

  if (appScreens.length > 0 && appLabels.length > 0) {
    appLabels.forEach((label, idx) => {
      label.addEventListener('click', () => {
        setAppScreen(idx);
        startAppLoop(); // reset timer
      });
    });

    const phoneMockup = document.querySelector('.phone-mockup-wrapper');
    if (phoneMockup) {
      phoneMockup.addEventListener('mouseenter', stopAppLoop);
      phoneMockup.addEventListener('mouseleave', startAppLoop);
    }

    startAppLoop();
  }

  // =========================================================================
  // 3. Desktop ERP Showcase: Tab Switcher
  // =========================================================================
  const erpTabs = document.querySelectorAll('.erp-tab-btn');
  const erpScreens = document.querySelectorAll('.erp-screen-view');

  if (erpTabs.length > 0 && erpScreens.length > 0) {
    erpTabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        const targetScreenId = this.getAttribute('data-target');

        erpTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        erpScreens.forEach((s) => s.classList.remove('active'));

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const activeScreen = document.getElementById(targetScreenId);
        if (activeScreen) {
          activeScreen.classList.add('active');
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
      const duration = 2200; // ms
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
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  } else if (statsSection) {
    animateCounters();
  }
})();
