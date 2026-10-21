/**
 * Open Softwares — Contact & Demo Request JavaScript (js/contact.js)
 * Implements client-side form validation with accessible error handling and success state.
 */

(function () {
  'use strict';

  const demoForm = document.getElementById('demoForm');
  const successBanner = document.getElementById('demoSuccessBanner');

  if (!demoForm) return;

  const fields = {
    fullName: {
      el: document.getElementById('fullName'),
      errorEl: document.getElementById('fullNameError'),
      validate: (val) => val.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).',
    },
    schoolName: {
      el: document.getElementById('schoolName'),
      errorEl: document.getElementById('schoolNameError'),
      validate: (val) => val.trim().length >= 3,
      message: 'Please enter the name of your school or institution.',
    },
    city: {
      el: document.getElementById('city'),
      errorEl: document.getElementById('cityError'),
      validate: (val) => val.trim().length >= 2,
      message: 'Please enter your city in Maharashtra (or other location).',
    },
    phone: {
      el: document.getElementById('phone'),
      errorEl: document.getElementById('phoneError'),
      validate: (val) => {
        // Match 10 digits, optionally prefixed by +91 or 0
        const cleaned = val.replace(/[\s\-\(\)]/g, '');
        return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
      },
      message: 'Please enter a valid 10-digit mobile phone number.',
    },
    email: {
      el: document.getElementById('email'),
      errorEl: document.getElementById('emailError'),
      validate: (val) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
      },
      message: 'Please enter a valid email address.',
    },
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.el) return true;

    const val = field.el.value;
    const isValid = field.validate(val);

    if (!isValid) {
      field.el.classList.add('is-invalid');
      field.el.setAttribute('aria-invalid', 'true');
      if (field.errorEl) {
        field.errorEl.textContent = field.message;
        field.errorEl.style.display = 'block';
      }
      return false;
    } else {
      field.el.classList.remove('is-invalid');
      field.el.removeAttribute('aria-invalid');
      if (field.errorEl) {
        field.errorEl.style.display = 'none';
      }
      return true;
    }
  }

  // Attach real-time validation on blur and input
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field.el) return;

    field.el.addEventListener('blur', () => {
      validateField(key);
    });

    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('is-invalid')) {
        validateField(key);
      }
    });
  });

  // Handle Form Submission
  demoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidField = null;

    Object.keys(fields).forEach((key) => {
      const isValid = validateField(key);
      if (!isValid) {
        allValid = false;
        if (!firstInvalidField) {
          firstInvalidField = fields[key].el;
        }
      }
    });

    if (!allValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Success State
    if (successBanner) {
      const schoolVal = fields.schoolName.el.value.trim();
      const nameVal = fields.fullName.el.value.trim();

      const schoolPlaceholder = successBanner.querySelector('.success-school-name');
      if (schoolPlaceholder) {
        schoolPlaceholder.textContent = `${nameVal} (${schoolVal})`;
      }

      successBanner.classList.add('active');
      demoForm.style.display = 'none';
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
