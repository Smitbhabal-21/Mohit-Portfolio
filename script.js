'use strict';

/* ══════════════════════════════════════════════════════════
   ZHA-INSPIRED PORTFOLIO — script.js
   Mohit Manoj Pandarkame · Mumbai · 2025
   ══════════════════════════════════════════════════════════ */

/* ── 1. LOADER ─────────────────────────────────────────────
   Slide the black panel UP once the page has loaded         */
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Trigger the clip-path slide-up after fonts + images settle
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 900);
  });

  // Fallback: remove after 3 s even if load never fires
  setTimeout(() => loader.classList.add('loaded'), 3000);
})();

/* ── 2. CUSTOM CURSOR ──────────────────────────────────────
   Dot follows mouse instantly; ring lerps behind it.        */
(function () {
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = -100, my = -100;   // target (mouse)
  let rx = -100, ry = -100;   // ring current position

  // Snap dot immediately
  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  // Lerp ring
  (function lerp() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  // Expand ring on interactive elements
  const HOVER_SEL = 'a, button, [tabindex], .accord-trigger, .proj-card, .hero-cta, .contact-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

/* ── 3. HAMBURGER / MOBILE MENU ────────────────────────────  */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function open() {
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('active') ? close() : open();
  });

  // Close when a link is clicked
  menu.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', close));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
})();

/* ── 4. SMOOTH SCROLL (with sidebar offset) ─────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 5. HERO IMAGE SCALE-IN ─────────────────────────────── */
(function () {
  const img = document.querySelector('.hero-img');
  if (!img) return;
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
})();

/* ── 6. REVEAL ANIMATIONS (IntersectionObserver) ─────────
   Handles: .reveal-up, .reveal-text, .reveal-clip         */
(function () {
  const EASE_DELAY = el => parseFloat(el.dataset.delay || 0);

  // reveal-up and reveal-text
  const upEls = document.querySelectorAll('.reveal-up, .reveal-text');
  const upIO  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = EASE_DELAY(el);
      setTimeout(() => el.classList.add('visible'), delay);
      upIO.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  upEls.forEach(el => upIO.observe(el));

  // reveal-clip (hero headline spans) — fire on page load, not scroll
  function revealHeroClips() {
    document.querySelectorAll('.reveal-clip').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      // Wait for loader to finish (≈900ms) + element's own delay
      setTimeout(() => el.classList.add('visible'), 1000 + delay);
    });
  }
  revealHeroClips();

  // hero-eyebrow, hero-sub, hero-cta (reveal-text inside hero)
  function revealHeroTexts() {
    document.querySelectorAll('#hero .reveal-text').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), 1100 + delay);
    });
  }
  revealHeroTexts();
})();

/* ── 7. ACCORDION ──────────────────────────────────────────
   Click to open/close; only one open at a time.            */
(function () {
  const items    = document.querySelectorAll('.accord-item');
  const triggers = document.querySelectorAll('.accord-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item      = trigger.closest('.accord-item');
      const isOpen    = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accord-trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── 8. HORIZONTAL SCROLL GALLERY ─────────────────────────
   Maps vertical scroll progress inside .horiz-outer to a
   translateX on .horiz-track.                               */
(function () {
  const outer = document.getElementById('horiz-outer');
  const track = document.getElementById('horiz-track');
  if (!outer || !track) return;

  // On mobile (<768px) skip horizontal scroll
  const mq = window.matchMedia('(max-width: 767px)');
  if (mq.matches) return;

  let ticking = false;

  function updateScroll() {
    const outerRect  = outer.getBoundingClientRect();
    const outerH     = outer.offsetHeight;
    const innerH     = window.innerHeight;

    // How far we are into the sticky section (0 → 1)
    const scrolled   = -outerRect.top;            // px scrolled inside outer
    const maxScroll  = outerH - innerH;           // total scrollable distance
    const progress   = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    // Width of the track vs viewport
    const trackW     = track.scrollWidth;
    const maxTransX  = -(trackW - window.innerWidth + 80); // 80px right pad

    const tx = progress * maxTransX;
    track.style.transform = `translateX(${tx}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateScroll();
})();

/* ── 9. STATS COUNTER ANIMATION ───────────────────────────
   Counts up numeric value when stat enters viewport.       */
(function () {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1800;
      const t0  = performance.now();

      function tick(now) {
        const elapsed = Math.min(now - t0, dur);
        const eased   = 1 - Math.pow(1 - elapsed / dur, 4); // quartic ease-out
        const val     = Math.round(eased * end);
        el.textContent = val.toLocaleString() + (end === 18 ? '+' : '');
        if (elapsed < dur) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => io.observe(n));
})();

/* ── 10. ACTIVE NAV LINK HIGHLIGHT ────────────────────────
   Highlight sidebar nav dot when section is in view.       */
(function () {
  const sections  = document.querySelectorAll('main > section[id]');
  const navLinks  = document.querySelectorAll('#sidebar .nav-link');
  if (!navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(l => {
        const isMatch = l.getAttribute('href') === '#' + e.target.id;
        l.classList.toggle('active', isMatch);
        if (isMatch) l.querySelector('.nav-tick').style.color = 'var(--accent)';
        else         l.querySelector('.nav-tick').style.color = '';
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();

/* ── 11. MAGNETIC BUTTONS ──────────────────────────────────
   Hero CTA and contact button subtly follow cursor.        */
(function () {
  const magnets = document.querySelectorAll('.hero-cta, .contact-btn');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ── 12. HERO PARALLAX (subtle image drift on scroll) ─────  */
(function () {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const shift = y * 0.25;
    heroImg.style.transform = `scale(1) translateY(${shift}px)`;
  }, { passive: true });
})();

/* ── 13. CURSOR GLOW SPOTLIGHT ─────────────────────────────
   Ambient light that follows cursor — adds depth.          */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:        'fixed',
    pointerEvents:   'none',
    zIndex:          '9990',
    width:           '500px',
    height:          '500px',
    borderRadius:    '50%',
    background:      'radial-gradient(circle, rgba(232,184,109,0.04) 0%, transparent 65%)',
    transform:       'translate(-50%, -50%)',
    left:            '-600px',
    top:             '-600px',
    transition:      'left 0.3s ease, top 0.3s ease',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
