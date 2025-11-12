import generateParticles from '@/scripts/ui/components/Particles.js';
import { initQRInput } from '@/scripts/ui/components/QRInput.js';
import { authService } from '../../services/authServece.js';

// Referencias a los elementos del DOM
const verifyForm = document.getElementById('verify-2fa-form');
const pinInputs = document.querySelectorAll('.pin-input');
const verifyButton = document.getElementById('verify-button');
const loadingIndicator = document.getElementById('verify-loading');
const errorElement = document.getElementById('verify-error');
const resendButton = document.getElementById('resend-code');

// Estado de la aplicación
let isLoading = false;

// Funciones de utilidad
const showError = (message) => {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
};

const setLoading = (loading) => {
  isLoading = loading;
  if (verifyButton) verifyButton.disabled = loading;
  if (loadingIndicator) {
    loadingIndicator.style.display = loading ? 'block' : 'none';
  }
  if (resendButton) resendButton.disabled = loading;
};

// Manejar la entrada del código PIN
const handlePinInput = (e) => {
  const input = e.target;
  const nextInput = input.nextElementSibling;
  
  // Solo permitir números
  input.value = input.value.replace(/[^0-9]/g, '');
  
  // Mover al siguiente campo si se ingresó un número
  if (input.value && nextInput && nextInput.classList.contains('pin-input')) {
    nextInput.focus();
  }
};

// Manejar la tecla de retroceso
const handleBackspace = (e) => {
  const input = e.target;
  
  if (e.key === 'Backspace' && !input.value) {
    const prevInput = input.previousElementSibling;
    if (prevInput && prevInput.classList.contains('pin-input')) {
      prevInput.focus();
    }
  }
};

// Obtener el código PIN completo
const getPinCode = () => {
  return Array.from(pinInputs).map(input => input.value).join('');
};

// Manejar el envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const pin = getPinCode();
  
  if (pin.length !== 6) {
    showError('Por favor, ingresa el código de 6 dígitos');
    return;
  }
  
  try {
    setLoading(true);
    await authService.verify2FA(pin);
    
    // Redirigir al dashboard después de la verificación exitosa
    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('2FA verification error:', error);
    showError(error.message || 'Código inválido. Intenta de nuevo.');
    
    // Limpiar los campos de entrada en caso de error
    pinInputs.forEach(input => {
      input.value = '';
    });
    if (pinInputs[0]) pinInputs[0].focus();
  } finally {
    setLoading(false);
  }
};

// Manejar el reenvío del código
const handleResendCode = async () => {
  try {
    setLoading(true);
    // Aquí puedes implementar la lógica para reenviar el código 2FA
    // Por ejemplo, podrías hacer una petición al backend para reenviar el código
    showError('Se ha enviado un nuevo código de verificación');
  } catch (error) {
    console.error('Error al reenviar el código:', error);
    showError('Error al reenviar el código. Intenta de nuevo.');
  } finally {
    setLoading(false);
  }
};

// Inicializar la página 2FA
const init2FA = () => {
  // Verificar si hay una sesión de 2FA activa
  if (!authService.temp2FAToken) {
    window.location.href = '/login.html';
    return;
  }
  
  // Inicializar componentes de UI
  generateParticles();
  initQRInput();
  
  // Configurar manejadores de eventos
  if (verifyForm) {
    verifyForm.addEventListener('submit', handleSubmit);
  }
  
  if (resendButton) {
    resendButton.addEventListener('click', handleResendCode);
  }
  
  // Configurar los campos de entrada del PIN
  pinInputs.forEach((input, index) => {
    input.addEventListener('input', handlePinInput);
    input.addEventListener('keydown', handleBackspace);
    
    // Permitir pegar el código completo
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text');
      const pasteDigits = pasteData.replace(/[^0-9]/g, '').split('');
      
      if (pasteDigits.length === 6) {
        pinInputs.forEach((input, i) => {
          if (pasteDigits[i]) {
            input.value = pasteDigits[i];
          }
        });
        // Enviar automáticamente si se pegaron 6 dígitos
        if (verifyForm) {
          verifyForm.dispatchEvent(new Event('submit'));
        }
      }
    });
  });
  
  // Enfocar el primer campo de entrada
  if (pinInputs[0]) {
    pinInputs[0].focus();
  }
};

// Iniciar la verificación 2FA cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init2FA);
} else {
  init2FA();
}