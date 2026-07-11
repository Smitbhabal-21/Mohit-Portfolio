'use strict';

/* ══ LOADER ═══════════════════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    bar.style.width = pct + '%';
  }, 70);
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('gone'), 700);
  });
})();

/* ══ NAV ═══════════════════════════════════════════════════ */
(function () {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menuBtn');
  const ovl = document.getElementById('mobileOverlay');
  const cls = document.getElementById('mobileClose');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });

  function openMenu() {
    ovl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    ovl.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openMenu);
  cls.addEventListener('click', closeMenu);
  ovl.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
})();

/* ══ HERO SLIDESHOW ════════════════════════════════════════ */
(function () {
  const slides = document.querySelectorAll('.hbs-slide');
  const dots   = document.querySelectorAll('.hdot');
  if (!slides.length) return;
  let cur = 0, timer;

  function goTo(i) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = i;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  function next() { goTo((cur + 1) % slides.length); }

  timer = setInterval(next, 5800);
  dots.forEach((d, i) => d.addEventListener('click', () => {
    clearInterval(timer);
    goTo(i);
    timer = setInterval(next, 5800);
  }));
})();

/* ══ PARTICLE CANVAS ═══════════════════════════════════════ */
(function () {
  const cv  = document.getElementById('heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  class Pt {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.4 + 0.3;
      this.a  = Math.random() * 0.45 + 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,184,109,${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    pts = Array.from({ length: 90 }, () => new Pt());
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize, { passive: true });
  init(); loop();
})();

/* ══ REVEAL ON SCROLL ══════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ══ COUNTER ANIMATION ═════════════════════════════════════ */
(function () {
  const counters = document.querySelectorAll('[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1600;
      const t0  = performance.now();
      function tick(now) {
        const elapsed = Math.min(now - t0, dur);
        const eased   = 1 - Math.pow(1 - elapsed / dur, 3);
        el.textContent = Math.round(eased * end).toLocaleString();
        if (elapsed < dur) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ══ SKILL BARS ════════════════════════════════════════════ */
(function () {
  const bars = document.querySelectorAll('.sb-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.w + '%';
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
})();

/* ══ PROJECT FILTER ════════════════════════════════════════ */
(function () {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.proj-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(c => {
        const match = filter === 'all' || c.dataset.cat === filter;
        c.classList.toggle('hidden', !match);
      });
    });
  });
})();

/* ══ PARALLAX MUMBAI FEATURE ═══════════════════════════════ */
(function () {
  const sec = document.querySelector('.mumbai-feature');
  const img = sec ? sec.querySelector('img') : null;
  if (!img) return;
  window.addEventListener('scroll', () => {
    const rect  = sec.getBoundingClientRect();
    const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const shift = (ratio - 0.5) * 70;
    img.style.transform = `scale(1.15) translateY(${shift}px)`;
  }, { passive: true });
})();

/* ══ CONTRAST SECTION PARALLAX ═════════════════════════════ */
(function () {
  const panels = document.querySelectorAll('.contrast-panel img');
  window.addEventListener('scroll', () => {
    panels.forEach((img, i) => {
      const rect  = img.closest('.contrast-panel').getBoundingClientRect();
      const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const dir   = i === 0 ? 1 : -1;
      const shift = (ratio - 0.5) * 30 * dir;
      img.style.transform = `scale(1.1) translateX(${shift}px)`;
    });
  }, { passive: true });
})();

/* ══ CONTACT FORM ══════════════════════════════════════════ */
(function () {
  const form = document.getElementById('contactForm');
  const sub  = document.getElementById('cfSubmit');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    sub.innerHTML = '<span>Sent! Will be in touch ✓</span>';
    sub.style.background = '#4caf8e';
    sub.style.pointerEvents = 'none';
    setTimeout(() => {
      sub.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
      sub.style.background = '';
      sub.style.pointerEvents = '';
      form.reset();
    }, 3500);
  });
})();

/* ══ SMOOTH SCROLL ══════════════════════════════════════════ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ══ CURSOR GLOW ════════════════════════════════════════════ */
(function () {
  const g = document.createElement('div');
  Object.assign(g.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9997',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,184,109,0.055) 0%, transparent 70%)',
    transform: 'translate(-50%,-50%)',
    transition: 'left 0.18s ease, top 0.18s ease',
    top: '-400px', left: '-400px',
  });
  document.body.appendChild(g);
  window.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ══ MAGNETIC CTA BUTTONS ═══════════════════════════════════ */
(function () {
  document.querySelectorAll('.hbtn, .cf-submit, .nav-link-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.18;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.18;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();
