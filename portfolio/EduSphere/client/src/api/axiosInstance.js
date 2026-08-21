import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from sessionStorage or localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const hasToken = sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token');
      if (hasToken) {
        console.warn('[Auth API] Session expired or unauthorized request. Clearing session.');
        try {
          sessionStorage.removeItem('edusphere_token');
          sessionStorage.removeItem('edusphere_user');
          localStorage.removeItem('edusphere_token');
          localStorage.removeItem('edusphere_user');
        } catch (e) {}
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
