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
  initDonateNav();

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

  const track = checker.querySelector('.checker-track');
  const steps = checker.querySelectorAll('.checker-step');
  const dots = checker.querySelectorAll('.checker-dot');
  const resultEl = checker.querySelector('.checker-result');
  const prevBtn = checker.querySelector('.checker-prev');
  const nextBtn = checker.querySelector('.checker-next');
  const navEl = checker.querySelector('.checker-nav');

  let currentStep = 0;
  let yesCount = 0;
  const answered = new Array(steps.length).fill(false);

  function goToStep(index, direction) {
    if (index < 0 || index >= steps.length) return;
    const dir = direction || (index > currentStep ? 'left' : 'right');
    steps.forEach(s => {
      s.classList.remove('active', 'slide-left', 'slide-right');
    });
    steps[index].classList.add('active', dir === 'left' ? 'slide-left' : 'slide-right');
    currentStep = index;
    updateUI();
  }

  function updateUI() {
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'current');
      if (answered[i]) dot.classList.add('active');
      if (i === currentStep) dot.classList.add('current');
    });
    // Update arrows
    prevBtn.disabled = currentStep === 0;
    nextBtn.disabled = currentStep === steps.length - 1;
  }

  function showResult() {
    // Hide track and nav
    track.style.display = 'none';
    navEl.style.display = 'none';

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

  function resetChecker() {
    currentStep = 0;
    yesCount = 0;
    answered.fill(false);
    resultEl.style.display = 'none';
    resultEl.className = 'checker-result';
    track.style.display = '';
    navEl.style.display = '';
    steps.forEach(s => {
      s.classList.remove('active', 'answered', 'slide-left', 'slide-right');
      s.querySelectorAll('.checker-btn').forEach(b => b.classList.remove('selected'));
    });
    steps[0].classList.add('active');
    updateUI();
  }

  // Arrow navigation
  prevBtn.addEventListener('click', () => goToStep(currentStep - 1, 'right'));
  nextBtn.addEventListener('click', () => goToStep(currentStep + 1, 'left'));

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToStep(i));
  });

  // Answer buttons
  checker.addEventListener('click', (e) => {
    if (e.target.closest('.checker-reset-btn')) {
      resetChecker();
      return;
    }

    const btn = e.target.closest('.checker-btn');
    if (!btn) return;

    const step = btn.closest('.checker-step');
    if (step.classList.contains('answered')) return;

    // Mark answer
    btn.classList.add('selected');
    step.classList.add('answered');
    answered[currentStep] = true;
    if (btn.classList.contains('yes')) yesCount++;

    // Check if all answered
    const allAnswered = answered.every(Boolean);
    if (allAnswered) {
      setTimeout(() => showResult(), 400);
      return;
    }

    // Auto-advance to next unanswered step
    setTimeout(() => {
      let next = -1;
      // Look forward first
      for (let i = currentStep + 1; i < steps.length; i++) {
        if (!answered[i]) { next = i; break; }
      }
      // Then look from beginning
      if (next === -1) {
        for (let i = 0; i < currentStep; i++) {
          if (!answered[i]) { next = i; break; }
        }
      }
      if (next !== -1) goToStep(next, 'left');
    }, 350);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!checker.closest('.section')) return;
    const rect = checker.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') goToStep(currentStep + 1, 'left');
    if (e.key === 'ArrowLeft') goToStep(currentStep - 1, 'right');
  });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToStep(currentStep + 1, 'left');
      else goToStep(currentStep - 1, 'right');
    }
  }, { passive: true });

  updateUI();
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

/* ============================================
   Donate Page Sticky Nav & Scroll Spy
   ============================================ */
function initDonateNav() {
  const nav = document.getElementById('donate-sticky-nav');
  if (!nav) return;

  const links = nav.querySelectorAll('.donate-nav-link');
  const sectionIds = Array.from(links).map(l => l.getAttribute('href').slice(1));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Sticky behavior via IntersectionObserver on the nav itself
  const sentinel = nav;
  let navTop = nav.offsetTop;

  function updateSticky() {
    if (window.scrollY >= navTop) {
      nav.classList.add('stuck');
    } else {
      nav.classList.remove('stuck');
    }
  }

  // Scroll spy - highlight active section
  function updateActive() {
    const mainNav = document.querySelector('.navbar');
    const navHeight = nav.offsetHeight + (mainNav ? mainNav.offsetHeight : 0) + 10;
    let current = sectionIds[0];

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navHeight + 80) {
        current = section.id;
      }
    }

    links.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === current);
    });
  }

  // Smooth scroll on click
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      const mainNav = document.querySelector('.navbar');
      const mainNavHeight = mainNav ? mainNav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - mainNavHeight - nav.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', () => {
    updateSticky();
    updateActive();
  }, { passive: true });

  // Recalculate nav position on resize
  window.addEventListener('resize', () => {
    if (!nav.classList.contains('stuck')) {
      navTop = nav.offsetTop;
    }
  });

  updateSticky();
  updateActive();
}

