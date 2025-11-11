export class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.user = null;
    this.token2FA = null;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

/*
// src/scripts/authService.js
const API_URL = 'http://localhost:3000/api/auth'; // Reemplaza con la URL real

export async function loginUser(username, password) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Lanza un error si el status es 4xx o 5xx
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación');
    }

    const data = await response.json();
    return data; // Contiene el token u otra información de éxito
  } catch (error) {
    console.error('API Error:', error.message);
    throw error; // Propaga el error para que la UI pueda manejarlo
  }
}
*/
