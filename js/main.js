/* ============================================
   KALASH TUTORIALS — Main JavaScript
   ============================================ */
(function () {
  'use strict';

  // ---- DOM Elements ----
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');

  // ---- Navbar scroll effect ----
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Back to top visibility
    if (scrollY > 600) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link[data-section]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkEls.forEach((link) => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile hamburger ----
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('nav__hamburger--active');
      navLinks.classList.toggle('nav__links--open');
      document.body.style.overflow = navLinks.classList.contains('nav__links--open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('nav__hamburger--active');
        navLinks.classList.remove('nav__links--open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Back to top ----
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll reveal animations (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach((el) => el.classList.add('reveal--visible'));
  }

  // ---- Counter animation ----
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.textContent.replace(/\d/g, '').trim();
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  // ---- Testimonial Carousel ----
  const testimonialTrack = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');

  if (testimonialTrack && prevBtn && nextBtn) {
    let currentSlide = 0;
    let cardsPerView = 3;
    let autoPlayTimer;

    function getCardsPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 968) return 2;
      return 3;
    }

    function getTotalSlides() {
      const cards = testimonialTrack.querySelectorAll('.testimonial-card');
      return Math.max(1, cards.length - cardsPerView + 1);
    }

    function updateCarousel() {
      const cards = testimonialTrack.querySelectorAll('.testimonial-card');
      if (cards.length === 0) return;

      const cardWidth = cards[0].offsetWidth;
      const gap = 24; // var(--space-6)
      const offset = currentSlide * (cardWidth + gap);

      testimonialTrack.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getTotalSlides();

      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials-dot' + (i === 0 ? ' testimonials-dot--active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentSlide = i;
          updateCarousel();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.testimonials-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('testimonials-dot--active', i === currentSlide);
      });
    }

    function nextSlide() {
      const total = getTotalSlides();
      currentSlide = (currentSlide + 1) % total;
      updateCarousel();
    }

    function prevSlide() {
      const total = getTotalSlides();
      currentSlide = (currentSlide - 1 + total) % total;
      updateCarousel();
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(nextSlide, 5000);
    }

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    function init() {
      cardsPerView = getCardsPerView();
      currentSlide = 0;
      createDots();
      updateCarousel();
      resetAutoPlay();
    }

    init();

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cardsPerView = getCardsPerView();
        if (currentSlide >= getTotalSlides()) {
          currentSlide = getTotalSlides() - 1;
        }
        createDots();
        updateCarousel();
      }, 200);
    });

    // Pause on hover
    const slider = document.getElementById('testimonialSlider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      slider.addEventListener('mouseleave', () => resetAutoPlay());
    }
  }

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-item__header');
    const body = item.querySelector('.faq-item__body');
    const answer = item.querySelector('.faq-item__answer');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('faq-item--open');
          const otherBody = other.querySelector('.faq-item__body');
          if (otherBody) otherBody.style.maxHeight = '0';
          const otherHeader = other.querySelector('.faq-item__header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('faq-item--open');
        body.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('faq-item--open');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // ---- Contact Form ----
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fields = contactForm.querySelectorAll('[required]');

      fields.forEach((field) => {
        const group = field.closest('.form-group');

        if (!field.value.trim()) {
          isValid = false;
          if (group) group.classList.add('form-group--error');
          field.classList.add('form-input--error');
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          if (group) group.classList.add('form-group--error');
          field.classList.add('form-input--error');
        } else {
          if (group) group.classList.remove('form-group--error');
          field.classList.remove('form-input--error');
        }
      });

      if (isValid) {
        contactModal.classList.add('modal-overlay--active');
        contactForm.reset();
      }
    });

    // Clear error on focus
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach((input) => {
      input.addEventListener('focus', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('form-group--error');
        input.classList.remove('form-input--error');
      });
    });
  }

  // ---- Contact Modal Close ----
  if (closeContactModal) {
    closeContactModal.addEventListener('click', () => {
      contactModal.classList.remove('modal-overlay--active');
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('modal-overlay--active');
      }
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
