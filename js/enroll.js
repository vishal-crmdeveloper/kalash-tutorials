/* ============================================
   Kalash Tutorials — Enrollment Page JS
   ============================================ */

(function () {
  'use strict';

  // ---- DOM References ----
  const form          = document.getElementById('enrollForm');
  const panels        = document.querySelectorAll('.wizard__panel');
  const steps         = document.querySelectorAll('.wizard__step');
  const connectors    = document.querySelectorAll('.wizard__connector');
  const modal         = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const nav           = document.getElementById('nav');
  const navHamburger  = document.getElementById('navHamburger');
  const navLinks      = document.getElementById('navLinks');

  let currentStep = 1;
  const totalSteps = panels.length;

  // =============================================
  //  STEP NAVIGATION
  // =============================================

  /** Show the panel for the given step number and update the progress bar. */
  function goToStep(step) {
    // Update panels
    panels.forEach(panel => {
      panel.classList.remove('wizard__panel--active');
      if (parseInt(panel.dataset.panel) === step) {
        panel.classList.add('wizard__panel--active');
      }
    });

    // Update step indicators
    steps.forEach(s => {
      const sNum = parseInt(s.dataset.step);
      s.classList.remove('wizard__step--active', 'wizard__step--complete');

      if (sNum === step) {
        s.classList.add('wizard__step--active');
      } else if (sNum < step) {
        s.classList.add('wizard__step--complete');
        // Show a checkmark on completed step numbers
        s.querySelector('.wizard__step-number').textContent = '✓';
      } else {
        s.querySelector('.wizard__step-number').textContent = sNum;
      }
    });

    // Update connectors
    connectors.forEach(c => {
      const cNum = parseInt(c.dataset.connector);
      if (cNum < step) {
        c.classList.add('wizard__connector--active');
      } else {
        c.classList.remove('wizard__connector--active');
      }
    });

    currentStep = step;

    // Scroll the wizard into view
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // =============================================
  //  VALIDATION
  // =============================================

  /** Clear error state from a form-group. */
  function clearError(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
      group.classList.remove('form-group--error');
      const input = group.querySelector('.form-input, .form-select, .form-textarea');
      if (input) input.classList.remove('form-input--error');
    }
  }

  /** Set error state on a form-group. */
  function setError(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
      group.classList.add('form-group--error');
      const input = group.querySelector('.form-input, .form-select, .form-textarea');
      if (input) input.classList.add('form-input--error');
    }
  }

  /** Validate a basic text / date / select field – returns true if valid. */
  function validateField(groupId, inputId) {
    const el = document.getElementById(inputId);
    if (!el) return true;
    const value = el.value.trim();
    if (!value) {
      setError(groupId);
      return false;
    }
    clearError(groupId);
    return true;
  }

  /** Validate email format. */
  function validateEmail(groupId, inputId) {
    const el = document.getElementById(inputId);
    if (!el) return true;
    const value = el.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      setError(groupId);
      return false;
    }
    clearError(groupId);
    return true;
  }

  /** Validate phone – at least 7 digits present. */
  function validatePhone(groupId, inputId) {
    const el = document.getElementById(inputId);
    if (!el) return true;
    const digits = el.value.replace(/\D/g, '');
    if (digits.length < 7) {
      setError(groupId);
      return false;
    }
    clearError(groupId);
    return true;
  }

  /** Validate that at least one subject checkbox is checked. */
  function validateSubjects() {
    const checked = form.querySelectorAll('input[name="subjects"]:checked');
    if (checked.length === 0) {
      setError('group-subjects');
      return false;
    }
    clearError('group-subjects');
    return true;
  }

  /** Validate that a schedule radio is selected. */
  function validateSchedule() {
    const selected = form.querySelector('input[name="schedule"]:checked');
    if (!selected) {
      setError('group-schedule');
      return false;
    }
    clearError('group-schedule');
    return true;
  }

  /** Run all validations for a given step. Returns true if step is valid. */
  function validateStep(step) {
    let valid = true;

    if (step === 1) {
      if (!validateField('group-studentName', 'studentName')) valid = false;
      if (!validateField('group-dob', 'dob')) valid = false;
      if (!validateField('group-grade', 'grade')) valid = false;
      if (!validateField('group-school', 'school')) valid = false;
    }

    if (step === 2) {
      if (!validateSubjects()) valid = false;
      if (!validateSchedule()) valid = false;
    }

    if (step === 3) {
      if (!validateField('group-parentName', 'parentName')) valid = false;
      if (!validateEmail('group-email', 'email')) valid = false;
      if (!validatePhone('group-phone', 'phone')) valid = false;
    }

    return valid;
  }

  // ---- Live validation: clear errors on input ----
  const liveFields = [
    { group: 'group-studentName', input: 'studentName' },
    { group: 'group-dob',         input: 'dob' },
    { group: 'group-grade',       input: 'grade' },
    { group: 'group-school',      input: 'school' },
    { group: 'group-parentName',  input: 'parentName' },
    { group: 'group-email',       input: 'email' },
    { group: 'group-phone',       input: 'phone' },
  ];

  liveFields.forEach(({ group, input }) => {
    const el = document.getElementById(input);
    if (el) {
      el.addEventListener('input', () => clearError(group));
    }
  });

  // Clear subject error when any subject is toggled
  form.querySelectorAll('input[name="subjects"]').forEach(cb => {
    cb.addEventListener('change', () => clearError('group-subjects'));
  });

  // Clear schedule error when any schedule is selected
  form.querySelectorAll('input[name="schedule"]').forEach(radio => {
    radio.addEventListener('change', () => clearError('group-schedule'));
  });

  // =============================================
  //  BUTTON CLICKS (Next / Prev)
  // =============================================

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === 'next' && currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    }

    if (action === 'prev' && currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  // =============================================
  //  FORM SUBMISSION
  // =============================================

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    // Show success modal
    modal.classList.add('modal-overlay--active');
    document.body.style.overflow = 'hidden';
  });

  // =============================================
  //  MODAL CLOSE
  // =============================================

  function closeModal() {
    modal.classList.remove('modal-overlay--active');
    document.body.style.overflow = '';

    // Reset form & wizard
    form.reset();
    goToStep(1);
  }

  modalCloseBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside the modal card)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-overlay--active')) {
      closeModal();
    }
  });

  // =============================================
  //  NAV SCROLL BEHAVIOUR
  // =============================================

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // =============================================
  //  MOBILE HAMBURGER TOGGLE
  // =============================================

  if (navHamburger) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('nav__hamburger--active');
      navLinks.classList.toggle('nav__links--open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navHamburger.classList.remove('nav__hamburger--active');
        navLinks.classList.remove('nav__links--open');
      });
    });
  }

})();
