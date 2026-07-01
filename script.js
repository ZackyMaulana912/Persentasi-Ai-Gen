/* ═══════════════════════════════════════════════════════════ */
/* SCRIPT INTERAKSI DAN ANIMASI PRESENTASI GENERATIVE AI      */
/* ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Kemajuan Scroll ──────────────────────────────────────────
const scrollProgressEl = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressEl.style.width = scrolled + '%';
  scrollProgressEl.setAttribute('aria-valuenow', Math.round(scrolled));
}

// ── Navigasi Dot ─────────────────────────────────────────────
const navDots  = document.querySelectorAll('.nav-dot');
const slides   = document.querySelectorAll('.slide');

// ═══════════════════════════════════════════════════════════════
// NAVIGASI SLIDE — scroll-snap native menangani kemulusan.
// JS hanya untuk lompat via keyboard / dot, dan sinkron indikator.
// ═══════════════════════════════════════════════════════════════
let currentSlide = 0;

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;
  slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Sinkronkan slide aktif (dot + nomor) berdasarkan slide yang terlihat.
// Lebih andal daripada menebak dari event wheel.
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const idx = slidesArr.indexOf(entry.target);
        if (idx === -1) return;
        currentSlide = idx;
        navDots.forEach(d => d.classList.remove('active'));
        if (navDots[idx]) navDots[idx].classList.add('active');
      }
    });
  },
  { threshold: [0.5, 0.75] }
);
const slidesArr = Array.from(slides);
slidesArr.forEach(s => activeObserver.observe(s));

// Scroll dibiarkan bebas/normal (tanpa pembajakan roda mouse).
// Perpindahan antar-slide cukup lewat tombol panah / Page / Spasi,
// serta klik dot navigasi.
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(slides.length - 1);
  }
});

// Klik nav dot → pindah ke slide
navDots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    goToSlide(idx);
  });
});

// ── Reveal Animasi (Intersection Observer) ───────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── Animasi Penghitung Angka ──────────────────────────────────
function animateCounter(el, targetVal, duration = 1800) {
  let start     = null;
  const startVal = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease-out-cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (targetVal - startVal) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = parseInt(el.dataset.target, 10);
        animateCounter(el, val);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ── Efek Gerak Cursor pada Blob Latar ────────────────────────
const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');
const blob3 = document.querySelector('.blob-3');

let mouseX = 0, mouseY = 0;
let blobX1 = 0, blobY1 = 0;
let blobX2 = 0, blobY2 = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateBlobs() {
  // Gerakan halus mengikuti kursor (lerp)
  blobX1 += (mouseX * 0.04 - blobX1) * 0.04;
  blobY1 += (mouseY * 0.04 - blobY1) * 0.04;

  blobX2 += (mouseX * -0.02 - blobX2) * 0.03;
  blobY2 += (mouseY * -0.02 - blobY2) * 0.03;

  if (blob1) blob1.style.transform = `translate(${blobX1}px, ${blobY1}px)`;
  if (blob2) blob2.style.transform = `translate(${blobX2}px, ${blobY2}px)`;

  requestAnimationFrame(animateBlobs);
}

animateBlobs();

// ── Efek Parallax Ringan pada Hero ───────────────────────────
const heroVisual = document.querySelector('.hero-visual');

function onScrollParallax() {
  const scrollY = window.scrollY;
  // Parallax halus pada visual hero (tanpa mengubah posisi grid-nya).
  if (heroVisual && scrollY < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
  }
}

// ── Efek Tilt 3D pada Kartu ───────────────────────────────────
function addTiltEffect(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const tiltX   = dy * -8;
      const tiltY   = dx *  8;
      card.style.transform        = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
      card.style.transition       = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

addTiltEffect('.glass-card');
addTiltEffect('.type-card');
addTiltEffect('.pillar');
addTiltEffect('.industry-card');

// ── Efek Sorot Cahaya Kursor pada Kartu ──────────────────────
document.querySelectorAll('.glass-card, .type-card, .industry-card, .challenge-card, .pillar').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ── Efek Teks Mengetik pada Judul Hero ───────────────────────
function typewriterEffect(selector, text, speed = 80) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = '';
  let i = 0;

  // Hanya jalankan sekali saat halaman dimuat
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

// Jalankan efek ketik setelah sedikit jeda
setTimeout(() => {
  // Tidak menggunakan typewriter pada judul utama agar tetap bersih
  // Hanya aktifkan animasi badge
  const badge = document.querySelector('.hero-badge');
  if (badge) badge.style.opacity = '1';
}, 300);

// ── Efek Partikel Melayang ────────────────────────────────────
function createParticles() {
  const container = document.querySelector('.bg-blobs');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';

    const size  = Math.random() * 4 + 1;
    const posX  = Math.random() * 100;
    const posY  = Math.random() * 100;
    const delay = Math.random() * 15;
    const dur   = Math.random() * 15 + 15;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      left: ${posX}%;
      top: ${posY}%;
      background: rgba(108, 99, 255, ${Math.random() * 0.4 + 0.1});
      animation: particleFloat ${dur}s ${delay}s ease-in-out infinite;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }
}

// Tambahkan keyframe partikel
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    25% {
      transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 80 - 40}px) scale(1.2);
      opacity: 0.8;
    }
    50% {
      transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 60 - 30}px) scale(0.8);
      opacity: 0.5;
    }
    75% {
      transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 100 - 50}px) scale(1.1);
      opacity: 0.7;
    }
  }

  /* Cahaya kursor pada kartu */
  .glass-card,
  .type-card,
  .industry-card,
  .challenge-card,
  .pillar {
    --mouse-x: 50%;
    --mouse-y: 50%;
  }

  .glass-card::after,
  .type-card::after,
  .industry-card::after,
  .challenge-card::after,
  .pillar::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      200px circle at var(--mouse-x) var(--mouse-y),
      rgba(108, 99, 255, 0.08),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .glass-card:hover::after,
  .type-card:hover::after,
  .industry-card:hover::after,
  .challenge-card:hover::after,
  .pillar:hover::after {
    opacity: 1;
  }

  /* Animasi masuk untuk hero badge (sedikit lebih lambat & berirama) */
  .hero-badge {
    opacity: 0;
    animation: fadeSlideUp 1.1s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-title .title-line:first-child {
    opacity: 0;
    transform: translateY(60px);
    animation: fadeSlideUp 1.3s 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-title .title-line:last-child {
    opacity: 0;
    transform: translateY(60px);
    animation: fadeSlideUp 1.3s 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-subtitle {
    opacity: 0;
    transform: translateY(40px);
    animation: fadeSlideUp 1.2s 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-caption {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeSlideUp 1.1s 1.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-scroll-hint {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeSlideUp 1.1s 2.05s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-visual {
    opacity: 0;
    animation: fadeIn 1.5s 0.8s ease forwards;
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(var(--from-y, 40px));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 0.5; }
  }

  /* Efek garis scan pada kartu tantangan */
  .challenge-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .challenge-card:hover::before {
    transform: scaleX(1);
  }

  /* Animasi step item */
  .step-item.visible .step-content {
    box-shadow: -4px 0 20px rgba(108, 99, 255, 0.1);
  }

  /* Transisi halus scroll seluruh halaman */
  html {
    scroll-behavior: smooth;
  }

  /* Seleksi teks berwarna */
  ::selection {
    background: rgba(108, 99, 255, 0.3);
    color: #fff;
  }
`;
document.head.appendChild(styleSheet);

createParticles();

// ── Efek Gelombang pada Orbit Hero ───────────────────────────
const orbitCore = document.querySelector('.orbit-core');

function pulseWave() {
  if (!orbitCore) return;

  const wave = document.createElement('div');
  wave.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid rgba(108, 99, 255, 0.5);
    animation: waveExpand 2.5s ease-out forwards;
    pointer-events: none;
  `;

  const waveAnim = document.createElement('style');
  waveAnim.textContent = `
    @keyframes waveExpand {
      0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
    }
  `;
  document.head.appendChild(waveAnim);

  const heroVisualEl = document.querySelector('.hero-visual');
  if (heroVisualEl) {
    heroVisualEl.appendChild(wave);
    setTimeout(() => wave.remove(), 2600);
  }
}

setInterval(pulseWave, 3000);
setTimeout(pulseWave, 500);

// ── Efek Highlight Baris Langkah Aktif ───────────────────────
const stepItems = document.querySelectorAll('.step-item');

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.4 }
);

stepItems.forEach(el => stepObserver.observe(el));

// ── Efek Scroll untuk Parallax ───────────────────────────────
let ticking = false;

function onScrollEvent() {
  if (!ticking) {
    requestAnimationFrame(() => {
      onScrollParallax();
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScrollEvent, { passive: true });

// Status awal
updateScrollProgress();
if (navDots[0]) navDots[0].classList.add('active');

// ── Efek Hover Orbit ─────────────────────────────────────────
const orbitRings = document.querySelectorAll('.orbit-ring');

document.querySelector('.hero-visual')?.addEventListener('mouseenter', () => {
  orbitRings.forEach((ring, i) => {
    ring.style.borderColor = `rgba(108, 99, 255, ${0.4 - i * 0.1})`;
    ring.style.boxShadow   = `0 0 ${20 + i * 10}px rgba(108, 99, 255, 0.1)`;
  });
});

document.querySelector('.hero-visual')?.addEventListener('mouseleave', () => {
  orbitRings.forEach(ring => {
    ring.style.borderColor = '';
    ring.style.boxShadow   = '';
  });
});

// ── Pesan di Konsol ──────────────────────────────────────────
console.log(
  '%c✦ Generative AI Presentation%c\nDibuat dengan cinematic dark UI + glassmorphism\nDari UI UX Pro Max Skill',
  'color: #6C63FF; font-size: 18px; font-weight: bold;',
  'color: #8A8F98; font-size: 12px;'
);
