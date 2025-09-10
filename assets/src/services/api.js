import axios from 'axios';

// Get API configuration from global variables
const apiConfig = window.companyHub || {};

const api = axios.create({
  baseURL: apiConfig.apiUrl || '/wp-json/company-hub/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': apiConfig.nonce || ''
  }
});

// Request interceptor to add nonce
api.interceptors.request.use(
  (config) => {
    const nonce = window.companyHub?.nonce;
    if (nonce) {
      config.headers['X-WP-Nonce'] = nonce;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/company-hub/login';
    }
    return Promise.reject(error);
  }
);

export default api;