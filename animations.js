/* ================================================
   DEMORA BASKETBALL — Shared JS
   ================================================ */

/* CURSOR */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;
  let mx = -120, my = -120, rx = -120, ry = -120;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx - 3}px,${my - 3}px,0)`;
  }, { passive: true });
  (function tick() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate3d(${rx - 17}px,${ry - 17}px,0)`;
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('on'));
    el.addEventListener('mouseleave', () => ring.classList.remove('on'));
  });
}


/* PAGE TRANSITION */
function initTransition() {
  const ov = document.getElementById('pt');
  if (!ov || typeof gsap === 'undefined') return;
  gsap.set(ov, { yPercent: 0 });
  gsap.to(ov, { yPercent: -100, duration: 0.82, ease: 'expo.inOut', onComplete: () => { ov.style.pointerEvents = 'none'; } });
  document.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || h.startsWith('mailto') || h.startsWith('tel') || h.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      ov.style.pointerEvents = 'all';
      gsap.set(ov, { yPercent: 100 });
      gsap.to(ov, { yPercent: 0, duration: 0.68, ease: 'expo.inOut', onComplete: () => { window.location.href = h; } });
    });
  });
}

/* NAV */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const sync = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
  const file = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a => {
    if ((a.getAttribute('href') || '').split('/').pop() === file) a.classList.add('active');
  });
  const btn  = document.getElementById('ham');
  const menu = document.getElementById('mob');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
}

/* SCROLL REVEAL — IntersectionObserver (no ScrollTrigger) */
let _revealIO = null;
function initReveal() {
  _revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); _revealIO.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.reveal').forEach(el => _revealIO.observe(el));
}
function observeReveal(el) {
  if (_revealIO) _revealIO.observe(el);
  else el.classList.add('in');
}

/* COUNTER — fires once via IO */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const isF    = String(target).includes('.');
      const dur    = 1300;
      const t0     = performance.now();
      (function upd(now) {
        const p   = Math.min((now - t0) / dur, 1);
        const val = target * (1 - Math.pow(1 - p, 4));
        el.textContent = isF ? val.toFixed(1) : Math.round(val);
        if (p < 1) requestAnimationFrame(upd);
        else {
          // also animate any sibling bar
          el.closest('.sp-row')?.querySelectorAll('.sp-fill[data-w]').forEach(b => { b.style.width = b.dataset.w + '%'; });
        }
      })(t0);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

  // standalone bars (no counter)
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io2.unobserve(e.target);
      e.target.querySelectorAll('.sp-fill[data-w]').forEach(b => { b.style.width = b.dataset.w + '%'; });
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('#stats-panel').forEach(el => io2.observe(el));
}

/* SPLIT TEXT — chars */
function splitChars(el) {
  const txt = el.textContent;
  el.setAttribute('aria-label', txt);
  el.innerHTML = '';
  [...txt].forEach(ch => {
    const w = document.createElement('span');
    const i = document.createElement('span');
    w.className = 'split-wrap';
    i.className = 'split-inner';
    i.textContent = ch === ' ' ? ' ' : ch;
    w.appendChild(i); el.appendChild(w);
  });
  return el.querySelectorAll('.split-inner');
}

/* AUTO-INIT */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initTransition();
  initReveal();
  initCounters();
});
