const API_BASE_URL = 'https://enigmachat-server.proceruss.com/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
    this.temp2faToken = null;
  }

  async _fetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Error en la petición');
      error.status = response.status;
      throw error;
    }

    return data;
  }

  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Registration failed');
        error.response = data;
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        status: error.status,
        response: error.response,
      });

      // Enhance the error message for common issues
      if (error.message.includes('NetworkError')) {
        error.message =
          'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.status === 400) {
        error.message = 'Datos de registro inválidos';
      } else if (error.status === 409) {
        error.message = 'El correo electrónico ya está en uso';
      } else if (error.status >= 500) {
        error.message = 'Error del servidor. Por favor, inténtalo más tarde.';
      }

      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      if (!email || !password) {
        const error = new Error('Email y contraseña son requeridos');
        error.status = 400;
        throw error;
      }

      // Asegurar que el email esté en minúsculas
      const normalizedEmail = email.toLowerCase().trim();

      console.log('Sending login request with email:', normalizedEmail);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.response = data;
        error.status = response.status;
        throw error;
      }

      // Handle 2FA if required
      if (data.required2fa) {
        this.temp2faToken = data.token;
        return { required2fa: true, message: data.message };
      }

      // Regular login
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('authToken', data.token);
        return { user: data.user, token: data.token };
      }

      throw new Error('Invalid server response');
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Verify 2FA code
  async verify2FA(pin) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.temp2faToken}`,
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || '2FA verification failed');
        error.response = data;
        throw error;
      }

      if (data.token) {
        this.token = data.token;
        this.temp2faToken = null;
        localStorage.setItem('authToken', data.token);
        return { user: data.user, token: data.token };
      }

      throw new Error('Invalid server response');
    } catch (error) {
      console.error('2FA verification error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Setup 2FA
  async setup2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || '2FA setup failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('2FA setup error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Confirm 2FA setup
  async confirm2FA(pin, secret) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/confirm-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ pin, secret }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || '2FA confirmation failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('2FA confirmation error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Disable 2FA
  async disable2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/disable-2fa`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'Failed to disable 2FA');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Disable 2FA error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Search users
  async searchUsers({ username, email }) {
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (email) params.append('email', email);

      const response = await fetch(
        `${API_BASE_URL}/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'User search failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('User search error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Logout
  logout() {
    this.token = null;
    this.temp2faToken = null;
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current token
  getToken() {
    return this.token;
  }
}

// Export a singleton instance
export const authService = new AuthService();
