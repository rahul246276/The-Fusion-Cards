/* ============================================================
   THE FUSION CARDS — Main JavaScript
   Description: Navigation, animations, form validation, utilities
   ============================================================ */

/* ── Navbar Scroll Behavior ── */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page is already scrolled
})();

/* ── Active Nav Link ── */
(function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Mobile Menu Toggle ── */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ── Scroll-to-top Button ── */
(function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Intersection Observer — Fade-up animations ── */
(function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.fade-up'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400); // cap at 400ms
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(ease * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── Contact Form Validation ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('#name'),
      validate: v => v.trim().length >= 2,
      msg: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      el: form.querySelector('#email'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: 'Please enter a valid email address.'
    },
    phone: {
      el: form.querySelector('#phone'),
      validate: v => !v.trim() || /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),
      msg: 'Please enter a valid phone number.'
    },
    message: {
      el: form.querySelector('#message'),
      validate: v => v.trim().length >= 10,
      msg: 'Please enter your message (at least 10 characters).'
    }
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, validate, msg }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const group = el.closest('.form-group');
      if (!group) return;
      let errEl = group.querySelector('.error-msg');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'error-msg';
        group.appendChild(errEl);
      }
      if (!validate(el.value)) {
        errEl.textContent = msg;
        group.classList.add('has-error');
      } else {
        group.classList.remove('has-error');
      }
    });
    el.addEventListener('input', () => {
      const group = el.closest('.form-group');
      if (group && group.classList.contains('has-error') && validate(el.value)) {
        group.classList.remove('has-error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.values(fields).forEach(({ el, validate, msg }) => {
      if (!el) return;
      const group = el.closest('.form-group');
      if (!group) return;
      let errEl = group.querySelector('.error-msg');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'error-msg';
        group.appendChild(errEl);
      }
      if (!validate(el.value)) {
        errEl.textContent = msg;
        group.classList.add('has-error');
        isValid = false;
      }
    });

    if (isValid) {
      // Show success message (replace with real submit logic)
      const successEl = form.querySelector('.form-success');
      if (successEl) successEl.classList.add('show');
      form.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
      // Hide success after 5 seconds
      setTimeout(() => { if (successEl) successEl.classList.remove('show'); }, 5000);
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();

/* ── Gallery Lightbox (simple) ── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(7,21,48,0.95);
    z-index:9999; align-items:center; justify-content:center;
    cursor:zoom-out; backdrop-filter:blur(8px);
  `;
  overlay.innerHTML = `
    <button id="lb-close" style="
      position:absolute; top:24px; right:24px;
      background:rgba(255,255,255,0.1); border:none; border-radius:8px;
      width:44px; height:44px; color:white; cursor:pointer;
      font-size:1.2rem; display:flex; align-items:center; justify-content:center;
    ">✕</button>
    <div id="lb-content" style="
      max-width:90vw; max-height:90vh;
      border-radius:12px; overflow:hidden;
      box-shadow:0 40px 80px rgba(0,0,0,0.6);
    "></div>
    <span id="lb-caption" style="
      position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
      color:rgba(255,255,255,0.7); font-size:0.9rem; letter-spacing:0.04em;
      background:rgba(0,0,0,0.5); padding:8px 20px; border-radius:100px;
    "></span>
  `;
  document.body.appendChild(overlay);

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');
    const content = overlay.querySelector('#lb-content');
    const cap = overlay.querySelector('#lb-caption');

    if (img) {
      content.innerHTML = `<img src="${img.src}" alt="${img.alt}"
        style="max-width:90vw; max-height:85vh; object-fit:contain; display:block;">`;
    } else {
      const ph = item.querySelector('.gallery-placeholder');
      content.innerHTML = ph ? ph.outerHTML : '';
      content.style.cssText = 'width:600px; height:400px; border-radius:12px; overflow:hidden;';
    }
    if (cap) cap.textContent = caption ? caption.textContent : '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  overlay.querySelector('#lb-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Navbar: add initial transparent state ── */
(function initNavbarTransparency() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  // Hero pages: start transparent
  const isHero = document.querySelector('.hero');
  if (!isHero) {
    navbar.classList.add('scrolled'); // always solid on inner pages
  }
})();