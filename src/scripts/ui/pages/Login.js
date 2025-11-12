import typeEffect from '@/scripts/ui/components/UserInput.js';
import ScannerStatus from '@/scripts/ui/components/ScannerStatus.js';
import updateSystemTime from '@/scripts/ui/components/SystemTime.js';
import switchTab from '@/scripts/ui/components/Tab.js';
import generateParticles from '@/scripts/ui/components/Particles.js';
import { authService } from '../../services/authServece.js';

// Referencias a los elementos del DOM
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('usuario');
const loginPassword = document.getElementById('contrasena');

const loginError = document.createElement('div');
loginError.className = 'error-message';
loginForm?.appendChild(loginError);

// Referencias al formulario de registro
const registerForm = document.getElementById('register-form');
const registerName = document.getElementById('reg-username');
const registerEmail = document.getElementById('reg-email');
const registerPassword = document.getElementById('reg-password');
const registerConfirmPassword = document.getElementById('reg-confirm-password');
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

// Manejador de inicio de sesión
const handleLogin = async (e) => {
  e.preventDefault();
  clearError(loginError);

  const email = loginEmail.value;
  const password = loginPassword.value;

  try {
    const result = await authService.login(email, password);

    if (result.requires2FA) {
      window.location.href = '/2fa.html';
      return;
    }

    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('Login error:', error);
    showError(
      loginError,
      error.message || 'Error al iniciar sesión. Intenta de nuevo.'
    );
  }
};

// Manejador de registro
const handleRegister = async (e) => {
  e.preventDefault();
  clearError(registerError);

  const userData = {
    username: registerName.value.trim(),
    email: registerEmail.value.trim(),
    password: registerPassword.value,
    confirmPassword: registerConfirmPassword.value,
  };

  // Client-side validation
  if (userData.password !== userData.confirmPassword) {
    return showError(registerError, 'Las contraseñas no coinciden');
  }

  try {
    const result = await authService.register(userData);
    console.log('Registration successful:', result);

    const loginResult = await authService.login(
      userData.email,
      userData.password
    );

    // Handle 2FA if enabled
    if (loginResult.requires2FA) {
      return (window.location.href = '/2fa.html');
    }

    // Redirect to dashboard on successful login
    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('Registration failed:', error);
    const errorMessage =
      error.response?.message ||
      error.message ||
      'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
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
};

// Initialize and get cleanup function
const cleanup = initApp();

// If you're using a module system that supports cleanup
if (typeof module !== 'undefined' && module.hot) {
  module.hot.dispose(() => {
    if (cleanup) cleanup();
  });
}
