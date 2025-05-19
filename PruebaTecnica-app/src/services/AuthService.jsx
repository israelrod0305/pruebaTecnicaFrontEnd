import { TOKEN_STORAGE_KEY } from "../utils/constantes";


const API_URL = import.meta.env.VITE_API_URL || 'default_url';


const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const AuthService = {
  fetchWithAuth: async (endpoint, method = 'GET', data = null, additionalHeaders = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    };

    if (method.toUpperCase() === 'GET' || !data) {
      delete config.body;
    }

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, config);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error: No se pudo conectar al servidor.');
      }
      console.error('Error in fetchWithAuth:', error);
      throw error;
    }
  },

};

export default AuthService;