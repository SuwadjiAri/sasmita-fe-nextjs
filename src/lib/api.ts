import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
// Convert PUT/DELETE to POST with X-HTTP-Method-Override (shared hosting fix)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Method override for shared hosting compatibility
  const method = config.method?.toUpperCase();
  if (method === 'PUT' || method === 'DELETE') {
    config.headers['X-HTTP-Method-Override'] = method;
    config.method = 'post';
  }

  return config;
});

// Handle 401 responses (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const method = error.config?.headers?.['X-HTTP-Method-Override'] || error.config?.method?.toUpperCase();
      // Only auto-redirect for GET requests
      if (method === 'GET' || (!method && error.config?.method === 'get')) {
        const path = window.location.pathname;
        if (!path.startsWith('/login') && !path.startsWith('/register') && !path.startsWith('/forgot-password')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
