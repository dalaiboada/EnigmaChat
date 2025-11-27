// Configuración de la URL base de la API usando variables de entorno de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;// || 'http://localhost:3000/api';

// Clase principal del servicio de autenticación
class AuthService {

  // Login user
  async login(email, password) {
    try {
      // Validar campos
      if (!email || !password) {
        const error = new Error('Email y contraseña son requeridos');
        error.status = 400;
        throw error;
      }

      // Realizar la petición
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

      // Validar respuesta
      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.status = response.status;
        throw error;
      }

      // Parsear la respuesta y retornar los datos

      localStorage.setItem('isAuthenticated', true);

      const data = await response.json();
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
    let response;
    let data;
    
    try {
      response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Intentar parsear la respuesta JSON
      try {
        data = await response.json();
        console.log('2FA setup response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response format');
        error.status = response.status || 500;
        throw error;
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data?.message || '2FA setup failed';
        console.error('2FA setup failed:', errorMessage);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
      }

      // Si todo salió bien, devolver los datos
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
    let response;
    let data;
    
    try {
      response = await fetch(`${API_BASE_URL}/auth/confirm-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin, secret }),
      });

      // Intentar parsear la respuesta JSON
      try {
        data = await response.json();
        console.log('2FA confirmation response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response format');
        error.status = response.status || 500;
        throw error;
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data?.message || '2FA confirmation failed';
        console.error('2FA confirmation failed:', errorMessage);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
      }

      // Si todo salió bien, devolver los datos
      return data;
    } catch (error) {
      console.error('Error in confirm2FA:', error);
      // Si el error ya tiene un status, lanzarlo tal cual
      if (error.status) {
        throw error;
      }
      // Si no tiene status, crear un nuevo error con la información disponible
      const newError = new Error(error.message || 'Error confirming 2FA setup');
      newError.status = error.status || (response ? response.status : 500);
      newError.response = data;
      throw newError;
    }
  }

  // Disable 2FA
  async disable2FA() {
    let response;
    let data;
    
    try {
      response = await fetch(`${API_BASE_URL}/auth/disable-2fa`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
      });

      // Intentar parsear la respuesta JSON
      try {
        data = await response.json();
        console.log('2FA disable response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response format');
        error.status = response.status || 500;
        throw error;
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data?.message || 'Failed to disable 2FA';
        console.error('2FA disable failed:', errorMessage);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
      }

      // Si todo salió bien, devolver los datos
      return data;
    } catch (error) {
      console.error('Error in disable2FA:', error);
      // Si el error ya tiene un status, lanzarlo tal cual
      if (error.status) {
        throw error;
      }
      // Si no tiene status, crear un nuevo error con la información disponible
      const newError = new Error(error.message || 'Error disabling 2FA');
      newError.status = error.status || (response ? response.status : 500);
      newError.response = data;
      throw newError;
    }
  }

  // Search users
  async searchUsers({ username, email }) {
    let response;
    let data;
    
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (email) params.append('email', email);

      response = await fetch(
        `${API_BASE_URL}/users?${params.toString()}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
        }
      );

      // Intentar parsear la respuesta JSON
      try {
        data = await response.json();
        console.log('User search response:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const error = new Error('Invalid server response format');
        error.status = response.status || 500;
        throw error;
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data?.message || 'User search failed';
        console.error('User search failed:', errorMessage);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
      }

      // Si todo salió bien, devolver los datos
      return data;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      // Si el error ya tiene un status, lanzarlo tal cual
      if (error.status) {
        throw error;
      }
      // Si no tiene status, crear un nuevo error con la información disponible
      const newError = new Error(error.message || 'Error searching users');
      newError.status = error.status || (response ? response.status : 500);
      newError.response = data;
      throw newError;
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
