/* ============================================
   Kalash Tutorials — Student Portal JS
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Elements ----
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const loginError = document.getElementById('loginError');
  const loginSuccess = document.getElementById('loginSuccess');

  // ---- Demo Credentials ----
  const DEMO_EMAIL = 'demo@kalash.com';
  const DEMO_PASSWORD = 'demo123';

  // ---- Password Visibility Toggle ----
  passwordToggle.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    // Swap the eye icon
    passwordToggle.textContent = isPassword ? '🙈' : '👁️';
    passwordInput.focus();
  });

  // ---- Form Input Focus / Blur Animations ----
  const allInputs = loginForm.querySelectorAll('.form-input');

  allInputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      const group = input.closest('.form-group');
      if (group) {
        group.style.transform = 'scale(1.01)';
        group.style.transition = 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)';
      }
      // Clear individual field error on focus
      clearFieldError(input);
    });

    input.addEventListener('blur', function () {
      const group = input.closest('.form-group');
      if (group) {
        group.style.transform = 'scale(1)';
      }
    });

    // Also clear errors when typing
    input.addEventListener('input', function () {
      clearFieldError(input);
      hideMessages();
    });
  });

  // ---- Helper: Clear Field Error ----
  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('form-group--error');
    }
    input.classList.remove('form-input--error');
  }

  // ---- Helper: Show Field Error ----
  function showFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('form-group--error');
    }
    input.classList.add('form-input--error');
  }

  // ---- Helper: Hide Status Messages ----
  function hideMessages() {
    loginError.style.display = 'none';
    loginSuccess.style.display = 'none';
  }

  // ---- Form Validation & Submission ----
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideMessages();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    // Validate email / student ID
    if (!email) {
      showFieldError(emailInput);
      isValid = false;
    }

    // Validate password
    if (!password) {
      showFieldError(passwordInput);
      isValid = false;
    }

    if (!isValid) {
      // Shake the form briefly to draw attention
      loginForm.style.animation = 'none';
      // Force reflow
      void loginForm.offsetWidth;
      loginForm.style.animation = 'shakeForm 0.4s ease';
      return;
    }

    // Check credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // Success — demo login
      loginSuccess.style.display = 'block';
      loginError.style.display = 'none';

      // Disable the button while redirecting
      const submitBtn = loginForm.querySelector('.btn--primary');
      submitBtn.textContent = 'Redirecting...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';

      // Redirect after 2 seconds
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      // Invalid credentials
      loginError.style.display = 'block';
      loginSuccess.style.display = 'none';

      // Shake animation
      loginForm.style.animation = 'none';
      void loginForm.offsetWidth;
      loginForm.style.animation = 'shakeForm 0.4s ease';
    }
  });

  // ---- Inject Shake Keyframes ----
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shakeForm {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(styleSheet);

})();
