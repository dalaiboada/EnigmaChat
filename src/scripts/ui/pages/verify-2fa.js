import generateParticles from '@/scripts/ui/components/Particles.js';
import { initQRInput } from '@/scripts/ui/components/QRInput.js';
import { authService } from '@/scripts/services/authServece.js';

// DOM Elements
const verificationForm = document.querySelector('.verification-form');
const qrCodeImage = document.querySelector('.qr-code');
const secretKeyElement = document.querySelector('.secret-key-value');

const errorElement = document.createElement('div');
errorElement.className = 'error-message';
verificationForm?.insertBefore(errorElement, verificationForm.firstChild);

// Utility functions
const showError = (message) => {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
};

const setLoading = (isLoading) => {
  const submitButton = verificationForm?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading
      ? '<span class="spinner"></span> Verificando...'
      : 'VERIFICAR';
  }
};

// Get complete verification code
const getVerificationCode = () => {
  const codeInputs = document.querySelectorAll('.code-input');
  return Array.from(codeInputs)
    .map((input) => input.value)
    .join('');
};

// Handle form submission
const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  const code = getVerificationCode();
  if (code.length !== 6) {
    showError('Por favor ingresa el código de 6 dígitos');
    return;
  }

  try {
    setLoading(true);
    console.log(code)
    const result = await authService.verify2FA(code);
    console.log('2FA verification successful:', result);

    if (result && result.token) {
      window.location.href = '/messages';
    }
  } catch (error) {
    console.error('Verification error:', error);
    showError(error.message || 'Código inválido. Intenta de nuevo.');

    // Clear inputs on error
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input) => {
      input.value = '';
    });
    if (codeInputs[0]) codeInputs[0].focus();
  } finally {
    setLoading(false);
  }
};

// Initialize the 2FA page
const init2FA = () => {
  // Initialize QR input handling and particles
  initQRInput(); // Esto manejará la navegación entre inputs
  generateParticles();

  // Set up form submission
  if (verificationForm) {
    verificationForm.addEventListener('submit', handleSubmit);
  }

  // Auto-submit when all fields are filled
  const codeInputs = document.querySelectorAll('.code-input');
  codeInputs[codeInputs.length - 1]?.addEventListener('input', () => {
    if (getVerificationCode().length === 6) {
      handleSubmit();
    }
  });

  console.log('2FA initialized');
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init2FA);
} else {
  init2FA();
}
