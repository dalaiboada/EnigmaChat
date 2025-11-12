const API_BASE_URL = 'https://localhost:3000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
    this.temp2FAToken = null;
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
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json().catch(() => ({})); // Handle non-JSON responses

      /// test
      console.log('Registration response:', {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      ///
      if (!response.ok) {
        const error = new Error(data.message || 'Registration failed');
        error.response = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response,
      });
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.response = data;
        throw error;
      }

      // Handle 2FA if required
      if (data.required2fa) {
        this.temp2FAToken = data.token;
        return { requires2FA: true, message: data.message };
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
          Authorization: `Bearer ${this.temp2FAToken}`,
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
        this.temp2FAToken = null;
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
    this.temp2FAToken = null;
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
