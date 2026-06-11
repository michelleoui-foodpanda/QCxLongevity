/* ─────────────────────────────────────────────────────────────
   QC × LONGEVITY MICROSITE — MAIN JS
   ───────────────────────────────────────────────────────────── */

'use strict';

/* ── Reduced motion check ────────────────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Sticky nav ──────────────────────────────────────────────── */
(function initNav() {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');
  if (!nav || !hero) return;

  const obs = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('visible', !entry.isIntersecting),
    { threshold: 0.08 }
  );
  obs.observe(hero);
})();

/* ── Section reveals ─────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => obs.observe(el));
})();

/* ── Stat counters ───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    if (prefersReduced) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
      return;
    }
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const t    = Math.min((now - start) / duration, 1);
      const ease = easeOutCubic(t);
      const val  = ease * target;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => obs.observe(c));
})();

/* ── Active nav link ─────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.remove('active'));
          const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    },
    { threshold: 0.42 }
  );
  sections.forEach(s => obs.observe(s));
})();

/* ── Market tabs (proof section) ─────────────────────────────── */
(function initMarketTabs() {
  const tabs = document.querySelectorAll('.mktab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const market = tab.dataset.market;
      document.querySelectorAll('.mktab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.market-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + market);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ── CTA market pills ────────────────────────────────────────── */
(function initCtaPills() {
  const pills  = document.querySelectorAll('.cta-pill');
  const ctaBtn = document.getElementById('cta-btn');
  if (!ctaBtn) return;

  const labels = {
    pandamart:   'Shop health groceries on pandamart →',
    foodora:     'Shop health groceries on foodora market →',
    yemeksepeti: 'Sağlıklı ürünleri yemeksepeti\'nde keşfet →',
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.dataset.ctaMarket;
      if (labels[key]) ctaBtn.textContent = labels[key];
    });
  });
})();

/* ── Smooth scroll for anchor links ──────────────────────────── */
document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(el => {
  el.addEventListener('click', (e) => {
    const href = el.getAttribute('href') || el.dataset.scroll;
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
