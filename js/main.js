/* ============================================
   Pakistan Stroke Initiative - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounterAnimation();
  initTestimonialSlider();
  initVideoModal();
  initScrollToTop();
  initMobileNav();
  initSmoothScroll();
  initContactForm();
  initScrollProgress();
  initParallax();
  initSymptomChecker();
  initLightbox();
});

/* ============================================
   Navbar
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-donate a)');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   Mobile Navigation
   ============================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  if (!toggle || !navLinks) return;

  function closeMenu() {
    toggle.classList.remove('active');
    navLinks.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    navLinks.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Counter Animation
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   Testimonial Slider
   ============================================ */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!slider || !dots.length) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  // Update dots on scroll
  slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateDots();
    }
  }, { passive: true });

  // Click on dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      const cardWidth = cards[0].offsetWidth + 24;
      slider.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
      updateDots();
    });
  });

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Auto-scroll
  let autoScroll = setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    const cardWidth = cards[0].offsetWidth + 24;
    slider.scrollTo({ left: cardWidth * currentIndex, behavior: 'smooth' });
    updateDots();
  }, 5000);

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoScroll));
  slider.addEventListener('mouseleave', () => {
    autoScroll = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      const cardWidth = cards[0].offsetWidth + 24;
      slider.scrollTo({ left: cardWidth * currentIndex, behavior: 'smooth' });
      updateDots();
    }, 5000);
  });
}

/* ============================================
   Video Modal
   ============================================ */
function initVideoModal() {
  const modal = document.querySelector('.video-modal');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');
  const closeBtn = modal.querySelector('.video-modal-close');

  document.querySelectorAll('[data-video]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const videoId = trigger.getAttribute('data-video');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================
   Scroll to Top
   ============================================ */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   Smooth Scroll for Anchors
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Use Formspree or similar - for now show success
    // In production, replace with actual endpoint
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showFormMessage(form, 'Thank you! Your message has been sent. We will get back to you soon.', 'success');
        form.reset();
      } else {
        showFormMessage(form, 'Something went wrong. Please email us at info@pakistanstroke.com', 'error');
      }
    } catch {
      showFormMessage(form, 'Something went wrong. Please email us at info@pakistanstroke.com', 'error');
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}

function showFormMessage(form, message, type) {
  let msgEl = form.querySelector('.form-message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'form-message';
    form.appendChild(msgEl);
  }

  msgEl.textContent = message;
  msgEl.style.padding = '1rem';
  msgEl.style.borderRadius = '8px';
  msgEl.style.marginTop = '1rem';
  msgEl.style.fontSize = '0.9rem';
  msgEl.style.fontWeight = '500';

  if (type === 'success') {
    msgEl.style.background = 'rgba(30,98,57,0.1)';
    msgEl.style.color = '#1e6239';
  } else {
    msgEl.style.background = 'rgba(220,38,38,0.1)';
    msgEl.style.color = '#dc2626';
  }

  setTimeout(() => msgEl.remove(), 8000);
}

/* ============================================
   Scroll Progress Indicator
   ============================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ============================================
   Parallax Effect
   ============================================ */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ============================================
   Interactive Stroke Symptom Checker
   ============================================ */
function initSymptomChecker() {
  const checker = document.querySelector('.symptom-checker');
  if (!checker) return;

  const steps = checker.querySelectorAll('.checker-step');
  const dots = checker.querySelectorAll('.checker-dot');
  const resultEl = checker.querySelector('.checker-result');
  let answeredCount = 0;
  let yesCount = 0;

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i < answeredCount);
    });
  }

  function showResult() {
    if (yesCount > 0) {
      resultEl.className = 'checker-result emergency';
      resultEl.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">&#x1F6A8;</div>
        <h3 style="color: var(--red);">Call Emergency Now!</h3>
        <p>The symptoms you identified may indicate a stroke. Call <strong>1122</strong> (Pakistan) or <strong>911</strong> (US) immediately.</p>
        <p style="font-weight: 600; color: var(--dark);">Every minute matters. Do not wait.</p>
        <button class="btn btn-primary checker-reset-btn" style="margin-top: 0.75rem;">Start Over</button>
      `;
    } else {
      resultEl.className = 'checker-result safe';
      resultEl.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">&#x2705;</div>
        <h3 style="color: var(--green);">No Warning Signs Detected</h3>
        <p>Based on your answers, no immediate stroke warning signs were identified. Stay aware and learn the signs.</p>
        <button class="btn btn-secondary checker-reset-btn" style="margin-top: 0.75rem;">Start Over</button>
      `;
    }
    resultEl.style.display = 'block';
  }

  checker.addEventListener('click', (e) => {
    // Handle reset
    if (e.target.closest('.checker-reset-btn')) {
      answeredCount = 0;
      yesCount = 0;
      resultEl.style.display = 'none';
      resultEl.className = 'checker-result';
      steps.forEach(step => {
        step.classList.remove('answered');
        step.querySelectorAll('.checker-btn').forEach(btn => btn.classList.remove('selected'));
      });
      updateDots();
      return;
    }

    const btn = e.target.closest('.checker-btn');
    if (!btn) return;

    const step = btn.closest('.checker-step');
    if (step.classList.contains('answered')) return;

    // Mark selected button
    btn.classList.add('selected');
    step.classList.add('answered');

    if (btn.classList.contains('yes')) yesCount++;
    answeredCount++;
    updateDots();

    if (answeredCount >= steps.length) {
      showResult();
    }
  });
}

/* ============================================
   Lightbox Gallery
   ============================================ */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('.lightbox img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const items = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  let slideshowImages = null;
  let slideshowIndex = 0;

  function showSlide() {
    if (slideshowImages) {
      const slide = slideshowImages[slideshowIndex];
      img.src = slide.src;
      caption.textContent = slide.caption + ' (' + (slideshowIndex + 1) + '/' + slideshowImages.length + ')';
    }
  }

  function open(index) {
    const item = items[index];
    const slideData = item.dataset.slideshow;

    if (slideData) {
      slideshowImages = JSON.parse(slideData);
      slideshowIndex = 0;
      currentIndex = index;
      showSlide();
    } else {
      slideshowImages = null;
      currentIndex = index;
      const imgSrc = item.querySelector('img').src;
      const alt = item.querySelector('img').alt || '';
      img.src = imgSrc;
      caption.textContent = alt;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    slideshowImages = null;
  }

  function next() {
    if (slideshowImages) {
      slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
      showSlide();
    } else {
      currentIndex = (currentIndex + 1) % items.length;
      open(currentIndex);
    }
  }

  function prev() {
    if (slideshowImages) {
      slideshowIndex = (slideshowIndex - 1 + slideshowImages.length) % slideshowImages.length;
      showSlide();
    } else {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      open(currentIndex);
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', prev);
  lightbox.querySelector('.lightbox-next').addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}
