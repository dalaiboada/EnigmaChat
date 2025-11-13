const API_BASE_URL_E = 'https://enigmachat-server.proceruss.com/api';
const API_BASE_URL = 'http://localhost:3000/api';

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

  // Login user
  async login(email, password) {
    try {
      if (!email || !password) {
        const error = new Error('Email y contraseña son requeridos');
        error.status = 400;
        throw error;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      console.log(data);
      return {
        user: data.user,
        token: data.token,
        required2fa: data.required2fa,
        message: data.message,
      };
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const error = new Error('Invalid server response');
      error.status = response.status;
      throw error;
    }
  }

  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        credentials: 'include',
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

      if (!response.ok) {
        const error = new Error(data.message || 'Registration failed');
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      data.is2faEnabled = true;
      return data;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const error = new Error('Invalid server response');
      error.status = response.status;
      throw error;
    }
  }

  // Verify 2FA code
  async verify2FA(pin) {
    let response;
    let data;
    
    try {
      response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      // Intentar parsear la respuesta JSON
      try {
        data = await response.json();
        console.log('2FA verification response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response format');
        error.status = response.status || 500;
        throw error;
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data?.message || '2FA verification failed';
        console.error('2FA verification failed:', errorMessage);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
      }

      // Si todo salió bien, devolver los datos
      return {
        user: data.user,
        token: data.token,
        message: data.message,
      };
    } catch (error) {
      console.error('Error in verify2FA:', error);
      // Si el error ya tiene un status, lanzarlo tal cual
      if (error.status) {
        throw error;
      }
      // Si no tiene status, crear un nuevo error con la información disponible
      const newError = new Error(error.message || 'Error verifying 2FA code');
      newError.status = error.status || (response ? response.status : 500);
      newError.response = data;
      throw newError;
    }
  }

  // Setup 2FA
  async setup2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      try {
        const data = await response.json();
        console.log(data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || '2FA setup failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const error = new Error('Invalid server response');
      error.status = response.status;
      throw error;
    }
  }

  // Confirm 2FA setup
  async confirm2FA(pin, secret) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/confirm-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ pin, secret }),
      });

      try {
        const data = await response.json();
        console.log(data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || '2FA confirmation failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const error = new Error('Invalid server response');
      error.status = response.status;
      throw error;
    }
  }

  // Disable 2FA
  async disable2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/disable-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      try {
        const data = await response.json();
        console.log(data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Failed to disable 2FA');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
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
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      try {
        const data = await response.json();
        console.log(data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'User search failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
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
