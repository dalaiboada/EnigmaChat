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

  // Login user
  async login(email, password) {
    try {
      if (!email || !password) {
        const error = new Error('Email y contraseña son requeridos');
        error.status = 400;
        throw error;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      debugger;
      return data;
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
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      try {
        const data = await response.json();
        console.log(data);
        debugger;
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || '2FA verification failed');
        error.status = response.status;
        throw error;
      }

      if (data.token) {
        this.token = data.token;
        this.temp2faToken = null;
        localStorage.setItem('authToken', data.token);
        return { user: data.user, token: data.token };
      }

      throw new Error('Invalid server response');
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const error = new Error('Invalid server response');
      error.status = response.status;
      throw error;
    }
  }

  // Setup 2FA
  async setup2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      try {
        const data = await response.json();
        console.log(data);
        debugger;
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
        debugger;
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
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      try {
        const data = await response.json();
        console.log(data);
        debugger;
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
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      try {
        const data = await response.json();
        console.log(data);
        debugger;
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
