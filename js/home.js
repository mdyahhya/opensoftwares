/**
 * OpenSoftwares — Home & Products Page JavaScript (js/home.js)
 * High-performance, lean animations:
 * 1. Underline SVG Draw Animations (Hero + Schoolmate Section, unobserves after draw)
 * 2. Hero Phone & Laptop Looping Animation (SVG dashboard + realistic phone loop)
 * 3. 3-Slide Image Slider (crossfade, progress bar, IntersectionObserver paused)
 * 4. Interactive Android App Phone Mockup (5 tabs, sliding saffron indicator, auto-demo)
 * 5. Schoolmate ERP Mockup (auto-scaling, simulated PC cursor tour, module switching)
 * 6. Stats Number Counters (runs once on scroll)
 * 7. Tab & Page Visibility Lifecycle (pauses on visibilitychange and tab switch)
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isDocVisible = !document.hidden;
  let isEducationActive = true; // On products.html, reflects whether education panel is active

  // Track visibility states
  let isHeroInView = false;
  let isSliderInView = false;
  let isPhoneInView = false;
  let isErpInView = false;

  // =========================================================================
  // Footnote Variable
  // =========================================================================
  window.OPENSOFTWARES_CONFIG = window.OPENSOFTWARES_CONFIG || {};
  window.OPENSOFTWARES_CONFIG.freeWebsiteFootnote = "Terms and conditions apply.";
  const offerFootnoteEl = document.getElementById('offerFootnoteText');
  if (offerFootnoteEl) {
    offerFootnoteEl.textContent = window.OPENSOFTWARES_CONFIG.freeWebsiteFootnote;
  }

  // =========================================================================
  // 1. Underline SVG Draw Animations (Hero + Schoolmate Section)
  // =========================================================================
  const heroUnderline = document.querySelector('.hero-underline-path');
  if (heroUnderline) {
    setTimeout(() => {
      heroUnderline.classList.add('draw');
    }, 350);
  }

  const smUnderlines = document.querySelectorAll('.sm-underline-path');
  smUnderlines.forEach(path => {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('draw');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      obs.observe(path);
    } else {
      path.classList.add('draw');
    }
  });

  // =========================================================================
  // 2. Hero Devices (Laptop & Phone Looping Animation)
  // =========================================================================
  const heroSvg = document.getElementById('heroDevicesSvg');
  let startHeroLoops = () => {};
  let stopHeroLoops = () => {};

  if (heroSvg) {
    const lapPanels = [
      document.getElementById('lapPanelAnalytics'),
      document.getElementById('lapPanelFees'),
      document.getElementById('lapPanelAttendance'),
      document.getElementById('lapPanelPayroll')
    ].filter(Boolean);

    const lapModules = [
      document.getElementById('modAnalytics'),
      document.getElementById('modFees'),
      document.getElementById('modAttendance'),
      document.getElementById('modPayroll')
    ].filter(Boolean);

    const lapCursor = document.getElementById('heroLapCursor');
    let currentLapIndex = 0;
    let lapTimer = null;

    function setHeroLapPanel(idx) {
      if (!lapPanels.length) return;
      currentLapIndex = idx % lapPanels.length;
      lapPanels.forEach((p, i) => {
        p.classList.toggle('active', i === currentLapIndex);
      });
      lapModules.forEach((m, i) => {
        const bg = m.querySelector('rect');
        const txt = m.querySelector('text');
        if (i === currentLapIndex) {
          if (bg) bg.setAttribute('fill', '#FFF8EC');
          if (txt) { txt.setAttribute('fill', '#0E0E10'); txt.setAttribute('font-weight', '600'); }
        } else {
          if (bg) bg.setAttribute('fill', 'transparent');
          if (txt) { txt.setAttribute('fill', '#64748B'); txt.setAttribute('font-weight', '500'); }
        }
      });
      if (lapCursor) {
        const yPos = 160 + currentLapIndex * 32;
        lapCursor.style.transform = `translate(380px, ${yPos}px)`;
      }
    }

    const phScenes = [
      document.getElementById('phSceneLogin'),
      document.getElementById('phSceneSuccess'),
      document.getElementById('phSceneFeed'),
      document.getElementById('phScenePlayer')
    ].filter(Boolean);

    let currentPhIndex = 0;
    let phTimer = null;
    const phDurations = [3500, 2000, 3200, 3600];

    function setHeroPhScene(idx) {
      if (!phScenes.length) return;
      currentPhIndex = idx % phScenes.length;
      phScenes.forEach((s, i) => {
        s.classList.toggle('active', i === currentPhIndex);
      });
    }

    function runHeroPhLoop() {
      if (prefersReducedMotion || !isDocVisible || !isHeroInView) return;
      clearTimeout(phTimer);
      const nextIdx = (currentPhIndex + 1) % phScenes.length;
      phTimer = setTimeout(() => {
        setHeroPhScene(nextIdx);
        runHeroPhLoop();
      }, phDurations[currentPhIndex] || 3000);
    }

    startHeroLoops = function () {
      if (prefersReducedMotion || !isDocVisible || !isHeroInView) return;
      clearInterval(lapTimer);
      clearTimeout(phTimer);
      lapTimer = setInterval(() => {
        setHeroLapPanel(currentLapIndex + 1);
      }, 4000);
      runHeroPhLoop();
    };

    stopHeroLoops = function () {
      clearInterval(lapTimer);
      clearTimeout(phTimer);
      lapTimer = null;
      phTimer = null;
    };

    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          isHeroInView = e.isIntersecting;
          if (isHeroInView && isDocVisible) {
            startHeroLoops();
          } else {
            stopHeroLoops();
          }
        });
      }, { threshold: 0.1 });
      heroObs.observe(heroSvg);
    } else {
      isHeroInView = true;
      startHeroLoops();
    }

    setHeroLapPanel(0);
    setHeroPhScene(0);
  }

  // =========================================================================
  // 3. Image Slider (crossfade, progress bar, IntersectionObserver paused)
  // =========================================================================
  let startSliderAuto = () => {};
  let stopSliderAuto = () => {};

  function initSlider(wrapperSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const slides       = Array.from(wrapper.querySelectorAll('.slide-item'));
    const prevBtn      = wrapper.querySelector('.slider-arrow-prev');
    const nextBtn      = wrapper.querySelector('.slider-arrow-next');
    const progressWrap = wrapper.querySelector('.slider-progress-bar');
    const DELAY        = 3200;

    if (!slides.length) return;

    let current = 0;
    let timer   = null;
    let touchX  = 0;

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
        if (i < idx) seg.classList.add('done');
        if (i === idx) {
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

    startSliderAuto = function () {
      if (prefersReducedMotion || !isDocVisible || !isSliderInView || !isEducationActive) return;
      stopSliderAuto();
      timer = setInterval(nextSlide, DELAY);
    };

    stopSliderAuto = function () {
      clearInterval(timer);
      timer = null;
    };

    wrapper.addEventListener('mouseenter', stopSliderAuto);
    wrapper.addEventListener('mouseleave', () => {
      if (isSliderInView && isDocVisible && isEducationActive) startSliderAuto();
    });

    wrapper.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; stopSliderAuto(); }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - touchX;
      if (diff < -45) nextSlide();
      else if (diff > 45) prevSlide();
      if (isSliderInView && isDocVisible && isEducationActive) startSliderAuto();
    }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); if (isSliderInView) startSliderAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); if (isSliderInView) startSliderAuto(); });

    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { prevSlide(); if (isSliderInView) startSliderAuto(); }
      if (e.key === 'ArrowRight') { nextSlide(); if (isSliderInView) startSliderAuto(); }
    });

    showSlide(0);

    if ('IntersectionObserver' in window) {
      const sliderObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          isSliderInView = e.isIntersecting;
          if (isSliderInView && isDocVisible && isEducationActive) {
            startSliderAuto();
          } else {
            stopSliderAuto();
          }
        });
      }, { threshold: 0.15 });
      sliderObs.observe(wrapper);
    } else {
      isSliderInView = true;
      startSliderAuto();
    }
  }

  initSlider('.hero-slider-card');

  // =========================================================================
  // 4. Interactive Android App Phone Mockup (Dashboard -> Attendance -> Videos -> Bus -> Notices)
  // =========================================================================
  const phoneDevice = document.querySelector('.phone-device');
  const phoneTabs = document.querySelectorAll('.phone-tab-btn');
  const phoneScreens = document.querySelectorAll('.phone-screen');
  const tabIndicator = document.querySelector('.tab-indicator');

  const tabSequence = [1, 2, 3, 4]; // Attendance (1) -> Videos (2) -> Bus (3) -> Notices (4)
  let seqIndex = 0;
  let currentTab = 1;
  let autoDemoTimer = null;
  let pauseTimer = null;
  const AUTO_INTERVAL = 2800;
  const PAUSE_AFTER = 8000;

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

    const foundIdx = tabSequence.indexOf(idx);
    if (foundIdx !== -1) {
      seqIndex = foundIdx;
    }

    if (byUser) {
      stopAutoDemo();
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        if (isPhoneInView && isDocVisible && isEducationActive) {
          startAutoDemo();
        }
      }, PAUSE_AFTER);
    }
  }

  function startAutoDemo() {
    if (prefersReducedMotion || !isDocVisible || !isPhoneInView || !isEducationActive) return;
    stopAutoDemo();
    autoDemoTimer = setInterval(() => {
      seqIndex = (seqIndex + 1) % tabSequence.length;
      setTab(tabSequence[seqIndex]);
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
    setTab(1); // Default to Attendance
    if ('IntersectionObserver' in window && phoneDevice) {
      const phoneObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          isPhoneInView = e.isIntersecting;
          if (isPhoneInView && isDocVisible && isEducationActive) {
            startAutoDemo();
          } else {
            stopAutoDemo();
          }
        });
      }, { threshold: 0.2 });
      phoneObs.observe(phoneDevice);
    } else {
      isPhoneInView = true;
      startAutoDemo();
    }
  }

  // =========================================================================
  // 5. Schoolmate ERP Mockup — PC Desktop Screen Cursor Animation & Modules
  // =========================================================================
  const erpHost = document.querySelector('.erp-mockup-host');
  const erpScaler = document.querySelector('.erp-mockup-scaler');
  const erpCanvas = document.querySelector('.erp-mockup-canvas');
  const erpModBtns = document.querySelectorAll('.erp-module-btn');
  const erpPanels = document.querySelectorAll('.erp-panel-view');
  const pcCursor = document.getElementById('erpPcCursor');

  const DESIGN_WIDTH = 1200;
  const DESIGN_HEIGHT = 760;

  function scaleErpMockup() {
    if (!erpScaler || !erpCanvas || !erpHost) return;
    const containerWidth = erpHost.getBoundingClientRect().width;
    if (containerWidth <= 0) return;
    const scale = containerWidth / DESIGN_WIDTH;
    erpCanvas.style.transform = `scale(${scale})`;
    erpScaler.style.height = (DESIGN_HEIGHT * scale) + 'px';
  }

  scaleErpMockup();

  if ('ResizeObserver' in window && erpHost) {
    const ro = new ResizeObserver(scaleErpMockup);
    ro.observe(erpHost);
  } else {
    window.addEventListener('resize', scaleErpMockup, { passive: true });
  }

  // Waypoints for PC Cursor simulation
  const pcTour = [
    { modIdx: 0, clickX: 105, clickY: 96,  hoverX: 520, hoverY: 170 }, // Dashboard
    { modIdx: 1, clickX: 105, clickY: 136, hoverX: 490, hoverY: 260 }, // Students
    { modIdx: 6, clickX: 105, clickY: 336, hoverX: 620, hoverY: 260 }, // Fees & Accounts
    { modIdx: 4, clickX: 105, clickY: 256, hoverX: 540, hoverY: 220 }, // Timetable
    { modIdx: 5, clickX: 105, clickY: 296, hoverX: 500, hoverY: 230 }  // Exams
  ];

  let currentTourStep = 0;
  let erpTourTimer = null;
  let isUserOperating = false;

  function setCursorPosition(x, y, onFinish) {
    if (!pcCursor) {
      if (onFinish) onFinish();
      return;
    }
    pcCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (onFinish) setTimeout(onFinish, 600);
  }

  function simulateClick(done) {
    if (!pcCursor) {
      if (done) done();
      return;
    }
    pcCursor.classList.add('clicking');
    setTimeout(() => {
      pcCursor.classList.remove('clicking');
      if (done) done();
    }, 250);
  }

  function setErpModule(idx, byUser = false) {
    const btns = Array.from(erpModBtns);
    const panels = Array.from(erpPanels);
    if (idx < 0 || idx >= btns.length) return;

    btns.forEach((b, i) => {
      b.classList.toggle('active', i === idx);
      b.setAttribute('aria-selected', String(i === idx));
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    const activeChart = document.querySelector('.erp-panel-view.active .erp-chart-line');
    if (activeChart) {
      activeChart.classList.remove('draw');
      void activeChart.offsetWidth;
      activeChart.classList.add('draw');
    }

    if (byUser) {
      isUserOperating = true;
      if (pcCursor) pcCursor.style.opacity = '0';
      clearTimeout(erpTourTimer);
    }
  }

  function playPcStep() {
    if (prefersReducedMotion || isUserOperating || !isDocVisible || !isErpInView || !isEducationActive) return;
    const step = pcTour[currentTourStep];
    if (!step) return;

    setCursorPosition(step.clickX, step.clickY, () => {
      simulateClick(() => {
        setErpModule(step.modIdx, false);
        setTimeout(() => {
          if (isUserOperating || !isDocVisible || !isErpInView || !isEducationActive) return;
          setCursorPosition(step.hoverX, step.hoverY, () => {
            erpTourTimer = setTimeout(() => {
              currentTourStep = (currentTourStep + 1) % pcTour.length;
              playPcStep();
            }, 3000);
          });
        }, 400);
      });
    });
  }

  function startErpAuto() {
    if (prefersReducedMotion || isUserOperating || !isDocVisible || !isErpInView || !isEducationActive) return;
    clearTimeout(erpTourTimer);
    if (pcCursor) pcCursor.style.opacity = '1';
    playPcStep();
  }

  function stopErpAuto() {
    clearTimeout(erpTourTimer);
    erpTourTimer = null;
  }

  if (erpHost) {
    erpHost.addEventListener('mouseenter', () => {
      isUserOperating = true;
      if (pcCursor) pcCursor.style.opacity = '0';
      stopErpAuto();
    });
    erpHost.addEventListener('mouseleave', () => {
      isUserOperating = false;
      setTimeout(() => {
        if (!isUserOperating && isErpInView && isDocVisible && isEducationActive) {
          if (pcCursor) pcCursor.style.opacity = '1';
          startErpAuto();
        }
      }, 1000);
    });
  }

  erpModBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => setErpModule(idx, true));
  });

  if (erpModBtns.length > 0) {
    setErpModule(0);
    if ('IntersectionObserver' in window && erpHost) {
      const erpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isErpInView = entry.isIntersecting;
          if (isErpInView && isDocVisible && isEducationActive) {
            startErpAuto();
          } else {
            stopErpAuto();
          }
        });
      }, { threshold: 0.2 });
      erpObserver.observe(erpHost);
    } else {
      isErpInView = true;
      startErpAuto();
    }
  }

  // =========================================================================
  // 6. Animated Number Counters (Stats section)
  // =========================================================================
  const statEls = document.querySelectorAll('[data-target]');
  let counted = false;

  function animateCounters() {
    if (counted) return;
    counted = true;
    statEls.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const frames = Math.round(duration / (1000 / 60));
      let frame = 0;
      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const tick = setInterval(() => {
        frame++;
        const progress = easeOut(frame / frames);
        const val = Math.round(target * progress);
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
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounters();
          statsObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    statsObs.observe(statsSection);
  } else if (statsSection) {
    animateCounters();
  }

  // =========================================================================
  // 7. Global Lifecycle: Tab Switch & Document Visibility Listeners
  // =========================================================================
  // Visibility Change: stop all loops when tab hidden, resume visible ones when shown
  document.addEventListener('visibilitychange', () => {
    isDocVisible = !document.hidden;
    if (!isDocVisible) {
      stopHeroLoops();
      stopSliderAuto();
      stopAutoDemo();
      stopErpAuto();
    } else {
      if (isHeroInView) startHeroLoops();
      if (isEducationActive) {
        if (isSliderInView) startSliderAuto();
        if (isPhoneInView) startAutoDemo();
        if (isErpInView) startErpAuto();
      }
    }
  });

  // Listen to Products Page tab changes
  window.addEventListener('industryTabChange', (e) => {
    const tab = e.detail && e.detail.tab;
    isEducationActive = (tab === 'education');
    if (!isEducationActive) {
      stopSliderAuto();
      stopAutoDemo();
      stopErpAuto();
    } else {
      scaleErpMockup();
      if (isDocVisible) {
        if (isSliderInView) startSliderAuto();
        if (isPhoneInView) startAutoDemo();
        if (isErpInView) startErpAuto();
      }
    }
  });

})();
