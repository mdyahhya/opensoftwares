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
  // Configurable Footnote Variable (Section E)
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
  const underlinePath = document.querySelector('.hero-underline-path');
  if (underlinePath) {
    setTimeout(() => {
      underlinePath.classList.add('draw');
    }, 500);
  }

  const smUnderlinePath = document.querySelector('.sm-underline-path');
  if (smUnderlinePath && 'IntersectionObserver' in window) {
    const smUnderlineObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          smUnderlinePath.classList.add('draw');
          smUnderlineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    smUnderlineObs.observe(smUnderlinePath);
  } else if (smUnderlinePath) {
    smUnderlinePath.classList.add('draw');
  }

  // =========================================================================
  // 1B. Hero Phone & Laptop Continuous Looping Animations
  // =========================================================================
  const heroSvg = document.getElementById('heroDevicesSvg');
  if (heroSvg) {
    // Laptop screen: cycle between 4 modules every 4s with smooth transition
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
          if (bg) bg.setAttribute('fill', 'rgba(255,255,255,0.08)');
          if (txt) { txt.setAttribute('fill', '#FFFFFF'); txt.setAttribute('font-weight', '600'); }
        } else {
          if (bg) bg.setAttribute('fill', 'transparent');
          if (txt) { txt.setAttribute('fill', '#94A3B8'); txt.setAttribute('font-weight', '500'); }
        }
      });
      if (lapCursor) {
        const yPos = 160 + currentLapIndex * 34;
        lapCursor.style.transform = `translate(380px, ${yPos}px)`;
      }
    }

    // Phone screen: Login -> Success -> Feed -> Video Player -> Loop
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
      if (prefersReducedMotion) return;
      clearTimeout(phTimer);
      const nextIdx = (currentPhIndex + 1) % phScenes.length;
      phTimer = setTimeout(() => {
        setHeroPhScene(nextIdx);
        runHeroPhLoop();
      }, phDurations[currentPhIndex] || 3000);
    }

    function startHeroLoops() {
      if (prefersReducedMotion) return;
      clearInterval(lapTimer);
      clearTimeout(phTimer);
      lapTimer = setInterval(() => {
        setHeroLapPanel(currentLapIndex + 1);
      }, 4000);
      runHeroPhLoop();
    }

    function stopHeroLoops() {
      clearInterval(lapTimer);
      clearTimeout(phTimer);
      lapTimer = null;
      phTimer = null;
    }

    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            startHeroLoops();
          } else {
            stopHeroLoops();
          }
        });
      }, { threshold: 0.1 });
      heroObs.observe(heroSvg);
    } else {
      startHeroLoops();
    }

    // Initial state
    setHeroLapPanel(0);
    setHeroPhScene(0);
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
    const DELAY        = 3000;

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
  // 4. Interactive Android App Phone Mockup (Attendance -> Videos -> Bus -> Notices)
  // =========================================================================
  const phoneTabs    = document.querySelectorAll('.phone-tab-btn');
  const phoneScreens = document.querySelectorAll('.phone-screen');
  const tabIndicator = document.querySelector('.tab-indicator');

  const tabSequence = [1, 2, 3, 4]; // Attendance (1) -> Videos (2) -> Bus (3) -> Notices (4)
  let seqIndex = 0; // index inside tabSequence, starts at tab 1 (Attendance)
  let currentTab = 1;
  let autoDemoTimer = null;
  let pauseTimer    = null;
  const AUTO_INTERVAL = 2800;
  const PAUSE_AFTER   = 8000;

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
      pauseTimer = setTimeout(startAutoDemo, PAUSE_AFTER);
    }
  }

  function startAutoDemo() {
    if (prefersReducedMotion) return;
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
    startAutoDemo();
  }

  // Scroll trigger: When user scrolls into Section B (#appShowcase), reset to Attendance (tab 1)
  const appSection = document.getElementById('appShowcase');
  if (appSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          seqIndex = 0;
          setTab(1);
          startAutoDemo();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(appSection);
  }

  // =========================================================================
  // 5. Schoolmate ERP Mockup — PC Desktop Screen Cursor Animation & Module Switching
  // =========================================================================
  const erpHost    = document.querySelector('.erp-mockup-host');
  const erpScaler  = document.querySelector('.erp-mockup-scaler');
  const erpCanvas  = document.querySelector('.erp-mockup-canvas');
  const erpModBtns = document.querySelectorAll('.erp-module-btn');
  const erpPanels  = document.querySelectorAll('.erp-panel-view');
  const pcCursor   = document.getElementById('erpPcCursor');

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

  // Waypoints for PC Cursor simulation (targets relative to 1200x760 PC screen)
  // Modules: 0: Dashboard, 1: Students, 2: Staff, 3: Payroll, 4: Timetable, 5: Exams, 6: Fees
  const pcTour = [
    { modIdx: 0, clickX: 105, clickY: 96,  hoverX: 520, hoverY: 170 }, // Dashboard -> Total Students KPI
    { modIdx: 1, clickX: 105, clickY: 136, hoverX: 490, hoverY: 260 }, // Students -> Table Row
    { modIdx: 6, clickX: 105, clickY: 336, hoverX: 620, hoverY: 260 }, // Fees & Accounts -> Collection chart
    { modIdx: 4, clickX: 105, clickY: 256, hoverX: 540, hoverY: 220 }, // Timetable -> Monday Maths
    { modIdx: 5, clickX: 105, clickY: 296, hoverX: 500, hoverY: 230 }  // Exams -> Results
  ];

  let currentTourStep = 0;
  let erpTourTimer = null;
  let isUserOperating = false;

  function setCursorPosition(x, y, onFinish) {
    if (!pcCursor) {
      if (onFinish) onFinish();
      return;
    }
    pcCursor.style.setProperty('--cur-x', x + 'px');
    pcCursor.style.setProperty('--cur-y', y + 'px');
    pcCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (onFinish) {
      setTimeout(onFinish, 680);
    }
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
    }, 280);
  }

  function setErpModule(idx, byUser = false) {
    const btns   = Array.from(erpModBtns);
    const panels = Array.from(erpPanels);
    if (idx < 0 || idx >= btns.length) return;

    btns.forEach((b, i) => {
      b.classList.toggle('active', i === idx);
      b.setAttribute('aria-selected', String(i === idx));
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    // Animate chart line if dashboard or fees panel is active
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
    if (prefersReducedMotion || isUserOperating) return;
    const step = pcTour[currentTourStep];
    if (!step) return;

    // 1. Move simulated PC cursor to sidebar module button
    setCursorPosition(step.clickX, step.clickY, () => {
      // 2. Click sidebar button with tactile ripple
      simulateClick(() => {
        setErpModule(step.modIdx, false);

        // 3. Move cursor inside the active PC window to inspect content
        setTimeout(() => {
          if (isUserOperating) return;
          setCursorPosition(step.hoverX, step.hoverY, () => {
            // 4. Stay briefly on panel, then glide to next module
            erpTourTimer = setTimeout(() => {
              currentTourStep = (currentTourStep + 1) % pcTour.length;
              playPcStep();
            }, 3000);
          });
        }, 500);
      });
    });
  }

  function startErpAuto() {
    if (prefersReducedMotion || isUserOperating) return;
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
        if (!isUserOperating) {
          if (pcCursor) pcCursor.style.opacity = '1';
          startErpAuto();
        }
      }, 1200);
    });
  }

  erpModBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => setErpModule(idx, true));
  });

  if (erpModBtns.length > 0) {
    setErpModule(0);
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
        { threshold: 0.25 }
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
