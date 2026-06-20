/* ===================================
   PORTFOLIO — script.js
   =================================== */

// Always start at top on page load / refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (window.location.hash) history.replaceState(null, '', window.location.pathname);
window.scrollTo(0, 0);

// ── Conference photo upload ───────────────────────────────
(function () {
  const input   = document.getElementById('conf-upload');
  const img     = document.getElementById('conf-img');
  const caption = document.getElementById('conf-caption');
  const ph      = document.getElementById('conf-placeholder');
  if (!input) return;
  input.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    img.src = URL.createObjectURL(file);
    img.classList.remove('hidden');
    if (ph) ph.style.display = 'none';
    if (caption) caption.style.display = 'block';
  });
  if (img) {
    img.addEventListener('load', function () {
      if (img.naturalWidth > 0) {
        img.classList.remove('hidden');
        if (ph) ph.style.display = 'none';
        if (caption) caption.style.display = 'block';
      }
    });
  }
})();

// ── Loader — premium animated sequence ──────────────────
(function initLoader() {
  const bar     = document.getElementById('ldr-bar');
  const counter = document.getElementById('ldr-counter');
  const ring    = document.getElementById('ldr-ring');
  const loader  = document.getElementById('loader');
  const CIRC    = 263.9;
  if (!loader) return;

  // Ease-in-out quad for a natural-feeling counter
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let step = 0;
  const STEPS    = 100;
  const DURATION = 2400; // ms
  const INTERVAL = DURATION / STEPS;

  const timer = setInterval(() => {
    step++;
    const progress = Math.round(easeInOut(step / STEPS) * 100);

    if (bar) bar.style.width = progress + '%';
    if (ring) ring.style.strokeDashoffset = CIRC * (1 - progress / 100);
    if (counter) counter.textContent = String(progress).padStart(2, '0');

    if (step >= STEPS) {
      clearInterval(timer);
      setTimeout(exitLoader, 350); // brief pause at 100%
    }
  }, INTERVAL);

  function exitLoader() {
    if (!loader) return;
    loader.classList.add('ldr-exit');
    setTimeout(() => {
      loader.style.display = 'none';
      loader.remove();
      document.querySelectorAll('.name-char').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.name-word').forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.hero-item').forEach(el => el.classList.add('visible'));
      initParticles();
      initTypewriter();
      initTerminal();
      initHudClock();
    }, 650);
  }

  // Hard failsafe — if something goes wrong, remove loader after 5s
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (l) { l.style.display = 'none'; l.remove(); }
  }, 5000);
})();

// ── Footer year ─────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Theme Toggle ────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function setTheme(mode) {
  if (mode === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  } else {
    html.classList.add('dark');
    html.classList.remove('light');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  }
  localStorage.setItem('theme', mode);
}

// Init from saved preference
const saved = localStorage.getItem('theme') || 'dark';
setTheme(saved);

themeBtn?.addEventListener('click', () => {
  const next = html.classList.contains('light') ? 'dark' : 'light';
  setTheme(next);
});


// ── Navbar Scroll Behavior ──────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Navbar glass effect
  if (y > 60) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');

  // Back to top
  if (y > 400) backToTop?.classList.add('visible');
  else backToTop?.classList.remove('visible');

  // Active nav highlighting
  highlightActiveNav();
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Active Nav Section Highlight ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

// ── Mobile Menu ─────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');

mobileMenuBtn?.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
  hamburgerIcon.className = isOpen ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
});

// Close on link click
document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerIcon.className = 'fa-solid fa-bars';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ── Intersection Observer — Reveal ──────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Animate skill bars when they enter viewport
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) setTimeout(() => fill.classList.add('animate'), 200);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Skill Category Tabs ─────────────────────────────────
const skillTabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

function applySkillFilter(selected) {
  skillCards.forEach((card) => {
    const show = selected === 'all' || card.dataset.category === selected;
    card.classList.toggle('hidden-skill', !show);
    if (show) revealObserver.observe(card);
  });
}

// Default: show only languages
applySkillFilter('languages');

skillTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    skillTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    applySkillFilter(tab.dataset.tab);
  });
});

// ── Project Filter ──────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const selected = btn.dataset.filter;

    projectCards.forEach((card) => {
      const cats = card.dataset.category || '';
      const show = selected === 'all' || cats.includes(selected);
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      if (show) {
        card.classList.remove('hidden-project');
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.classList.add('hidden-project'), 300);
      }
    });
  });
});

// ── Copy Email to Clipboard ─────────────────────────────
const copyBtn = document.getElementById('copy-email-btn');
const EMAIL = 'prasidbhusal07@gmail.com';

// Toast utility
function showToast(msg) {
  let toast = document.querySelector('.copy-tooltip');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-tooltip';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    showToast('Email copied to clipboard!');
    const icon = document.getElementById('copy-icon');
    if (icon) {
      icon.className = 'fa-solid fa-check text-sm text-emerald-400';
      setTimeout(() => { icon.className = 'fa-regular fa-copy text-sm'; }, 2000);
    }
  } catch {
    showToast('Copy failed — try manually');
  }
});

// ── Contact Form ─────────────────────────────────────────
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnIcon = document.getElementById('btn-icon');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.querySelector('#form-name').value.trim();
  const email = form.querySelector('#form-email').value.trim();
  const message = form.querySelector('#form-message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    feedback.textContent = 'Please fill in all required fields.';
    feedback.className = 'text-center text-sm text-red-400';
    feedback.classList.remove('hidden');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    feedback.textContent = 'Please enter a valid email address.';
    feedback.className = 'text-center text-sm text-red-400';
    feedback.classList.remove('hidden');
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  btnText.textContent = 'Sending…';
  btnIcon.className = 'fa-solid fa-circle-notch fa-spin text-sm';

  try {
    const res = await fetch('https://formspree.io/f/xkoadern', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.querySelector('#form-name').value.trim(),
        email: form.querySelector('#form-email').value.trim(),
        subject: form.querySelector('#form-subject').value.trim(),
        message: form.querySelector('#form-message').value.trim(),
      }),
    });

    if (res.ok) {
      btnText.textContent = 'Message Sent!';
      btnIcon.className = 'fa-solid fa-check text-sm';
      submitBtn.style.background = '#059669';
      feedback.textContent = "Thanks for reaching out! I'll get back to you within 24 hours.";
      feedback.className = 'text-center text-sm text-emerald-400';
      feedback.classList.remove('hidden');
      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fa-solid fa-paper-plane text-sm';
        submitBtn.style.background = '';
        feedback.classList.add('hidden');
      }, 4000);
    } else {
      throw new Error('Failed');
    }
  } catch {
    btnText.textContent = 'Send Message';
    btnIcon.className = 'fa-solid fa-paper-plane text-sm';
    submitBtn.disabled = false;
    feedback.textContent = 'Something went wrong. Please try again or email me directly.';
    feedback.className = 'text-center text-sm text-red-400';
    feedback.classList.remove('hidden');
  }
});

// ── Smooth anchor scrolling ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Typewriter ───────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'Problem Solver',
    'Creative Coder',
    'Open Source Contributor',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let paused = false;

  function tick() {
    if (paused) return;
    const current = roles[roleIndex];

    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 450);
        return;
      }
      setTimeout(tick, 40);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 75);
    }
  }

  setTimeout(tick, 200);

  // Pause when tab not visible to save resources
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) tick();
  });
}

// ── Matrix Rain Canvas ───────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const FONT_SIZE = 18; // larger = fewer columns = less work
  const CHARS = '01{}[]<>/\\*+=;:#@$%&!?ABCDEFабвгде'.split('');
  const BG    = 'rgba(202,196,236,0.09)';
  const FPS   = 24;
  const FRAME = 1000 / FPS;

  let cols, drops, lastTime = 0;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => -Math.random() * 40);
  }
  resize();
  window.addEventListener('resize', () => { clearTimeout(resize._t); resize._t = setTimeout(resize, 200); }, { passive: true });

  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - lastTime < FRAME) return; // throttle to 24 fps
    lastTime = ts;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const drop = drops[i];
      const y    = drop * FONT_SIZE;
      if (y < 0) { drops[i] += 0.3; continue; }

      const char  = CHARS[Math.floor(Math.random() * CHARS.length)];
      const alpha = Math.random() * 0.12 + 0.03;
      ctx.fillStyle = `rgba(80,30,180,${alpha})`;
      ctx.fillText(char, i * FONT_SIZE, y);

      if (y > canvas.height && Math.random() > 0.97) drops[i] = 0;
      drops[i] += 0.35;
    }
  }

  requestAnimationFrame(draw);
}

// ── Terminal Typing Animation ────────────────────────────
function initTerminal() {
  const out = document.getElementById('terminal-output');
  if (!out) return;

  // Remove the initial cursor placeholder
  out.innerHTML = '';

  const script = [
    { kind: 'cmd',  text: 'whoami' },
    { kind: 'out',  text: 'prasid_bhusal  // full stack dev' },
    { kind: 'cmd',  text: 'cat skills.json' },
    { kind: 'out',  text: '{ "react":92, "ts":85, "node":87' },
    { kind: 'out',  text: '  "next":88,  "aws":72, "docker":78 }' },
    { kind: 'cmd',  text: 'git log --oneline -2' },
    { kind: 'out',  text: 'a3f9c2e  feat: portfolio v2' },
    { kind: 'out',  text: '7b1d04a  fix: performance boost 60%' },
    { kind: 'cmd',  text: 'echo $STATUS' },
    { kind: 'ok',   text: '✓  open_to_work = true' },
    { kind: 'cmd',  text: '' },  // final blinking cursor
  ];

  let si = 0, ci = 0;
  let lineEl = null, textSpan = null;

  function next() {
    if (si >= script.length) return;
    const step = script[si];

    if (ci === 0) {
      lineEl  = document.createElement('div');
      lineEl.style.whiteSpace = 'pre';

      if (step.kind === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 't-prompt';
        prompt.textContent = '> ';
        lineEl.appendChild(prompt);
      }

      textSpan = document.createElement('span');
      textSpan.className = step.kind === 'out' ? 't-out'
                         : step.kind === 'ok'  ? 't-success'
                         : 't-cmd';
      lineEl.appendChild(textSpan);
      out.appendChild(lineEl);
    }

    if (step.text === '') {
      // Final line — just show a blinking block cursor
      const cur = document.createElement('span');
      cur.className = 'terminal-cursor-block';
      lineEl.appendChild(cur);
      return;
    }

    textSpan.textContent = step.text.slice(0, ci + 1);
    ci++;

    if (ci >= step.text.length) {
      ci = 0; si++;
      const pause = script[si - 1].kind === 'cmd' ? 320 : 80;
      setTimeout(next, pause);
    } else {
      setTimeout(next, step.kind === 'cmd' ? 55 : 22);
    }

    // Auto scroll terminal
    out.scrollTop = out.scrollHeight;
  }

  setTimeout(next, 400);
}

// ── HUD Clock ────────────────────────────────────────────
function initHudClock() {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = [
      now.getHours().toString().padStart(2,'0'),
      now.getMinutes().toString().padStart(2,'0'),
      now.getSeconds().toString().padStart(2,'0'),
    ].join(':');
  }
  tick();
  setInterval(tick, 1000);
}
