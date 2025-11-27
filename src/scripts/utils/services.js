export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Realiza una petición autenticada a la API
export const authenticatedFetch = async (endpoint, options = {}) => {

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Usuario no autenticado');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  });
  
  // Manejar errores de autenticación
  if (response.status === 401) {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/index.html';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
  }
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};
