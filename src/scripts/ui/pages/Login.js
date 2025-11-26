import typeEffect from '@/scripts/ui/components/UserInput.js';
import ScannerStatus from '@/scripts/ui/components/ScannerStatus.js';
import updateSystemTime from '@/scripts/ui/components/SystemTime.js';
import switchTab from '@/scripts/ui/components/Tab.js';
import generateParticles from '@/scripts/ui/components/Particles.js';
import { authService } from '@/scripts/services/auth.js';

// Loading state management
const setLoading = (isLoading) => {
  const buttons = [
    document.querySelector('#login-form button[type="submit"]'),
    document.querySelector('#register-form button[type="submit"]'),
  ].filter(Boolean);

  buttons.forEach((button) => {
    button.disabled = isLoading;
    button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...'
      : button.getAttribute('data-original-text') || button.textContent;
  });
};

// Save original button texts on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.setAttribute('data-original-text', button.textContent);
  });
});

// login form
const loginForm = document.getElementById('login-form');
const loginError = document.createElement('div');
loginError.className = 'error-message';
loginForm?.appendChild(loginError);

// register form
const registerForm = document.getElementById('register-form');
const registerError = document.createElement('div');
registerError.className = 'error-message';
registerForm?.appendChild(registerError);

// Función para mostrar errores
const showError = (element, message) => {
  element.textContent = message;
  element.style.display = 'block';
  element.style.color = 'red';
  element.style.marginTop = '10px';
  element.style.marginBottom = '10px';
  element.style.fontSize = '14px';
};

// Función para limpiar errores
const clearError = (element) => {
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
};

// Funcion para validar login
const validateLogin = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && password.length >= 6;
};

// Funcion para validar registro
const validateRegister = (email, password, confirmPassword) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && password === confirmPassword;
};

// Manejar el envío del formulario de login
const handleLogin = async (e) => {
  e.preventDefault();
  clearError(loginError);

  const loginEmail = document.getElementById('usuario').value.trim();
  const loginPassword = document.getElementById('contrasena').value.trim();

  // Validar campos
  if (!validateLogin(loginEmail, loginPassword)) {
    return showError(
      loginError,
      'Por favor ingresa un correo electrónico válido y una contraseña'
    );
  }

  try {
    setLoading(true);
    console.log('Attempting login with:', { loginEmail });

    // Realizar la petición
    const result = await authService.login(loginEmail, loginPassword);

    // Verificar si se requiere 2FA
    if (result.required2fa) {
      console.log('2FA required, redirecting to 2FA page');
      window.location.href = '/two-factor-authentication-login';
    } else { // Si no se requiere 2FA
      console.log('Login successful, redirecting to messages');
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = '/messages';
    }
  } catch (error) { // Manejar errores
    console.error('Login error:', error);
    let errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
    if (error.response) {
      if (error.response.message) {
        errorMessage = error.response.message;
      } else if (error.status === 401) { // Si el error es 401
        errorMessage = 'Correo o contraseña incorrectos';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    showError(loginError, errorMessage);
  } finally {
    setLoading(false);
  }
};

// register handler
const handleRegister = async (e) => {
  e.preventDefault();
  clearError(registerError);

  const userData = {
    username: document.getElementById('reg-username').value.trim(),
    email: document.getElementById('reg-email').value.trim(),
    password: document.getElementById('reg-password').value,
    confirmPassword: document.getElementById('reg-confirm-password').value,
  };

  // Validate register
  if (
    !validateRegister(
      userData.email,
      userData.password,
      userData.confirmPassword
    )
  ) {
    return showError(
      registerError,
      'Por favor ingresa un correo electrónico válido y una contraseña'
    );
  }

  try {
    setLoading(true);
    const result = await authService.register(userData);
    console.log('Registration successful:', result);
    console.log(result);

    localStorage.setItem('user', JSON.stringify(result));

    console.log('2FA required, redirecting to 2FA page');
    window.location.href = '/two-factor-authentication';

  } catch (error) {
    console.error('Registration failed:', error);
    let errorMessage =
      'Error al registrar el usuario. Por favor, inténtalo de nuevo.';

    if (error.response) {
      // Handle specific error messages from the server
      if (error.response.errors) {
        errorMessage = Object.values(error.response.errors).join('\n');
      } else if (error.response.message) {
        errorMessage = error.response.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    showError(registerError, errorMessage);
  } finally {
    setLoading(false);
  }
};

const initApp = () => {
  try {
    // Initialize UI components
    if (typeof generateParticles === 'function') generateParticles();
    if (typeof ScannerStatus === 'function') ScannerStatus();
    if (typeof typeEffect === 'function') typeEffect();

    // Set up event listeners first
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }

    // Initialize tabs after event listeners
    if (typeof switchTab === 'function') switchTab();

    // Initial time update
    if (typeof updateSystemTime === 'function') {
      updateSystemTime();
      // Store interval ID for cleanup
      const timeUpdateInterval = setInterval(updateSystemTime, 1000);

      // Return cleanup function
      return () => {
        clearInterval(timeUpdateInterval);
      };
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }

  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);
};

const cleanup = initApp();

// If you're using a module system that supports cleanup
if (typeof module !== 'undefined' && module.hot) {
  module.hot.dispose(() => {
    if (cleanup) cleanup();
  });
}
