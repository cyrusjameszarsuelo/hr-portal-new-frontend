import axios from 'axios';

// Prefer VITE_API_URL from .env (Vite exposes env vars via import.meta.env).
// Fall back to the hardcoded local IP if not provided.
const DEFAULT_API_URL = 'http://192.168.100.125:8000';
const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || DEFAULT_API_URL;

// Normalize and ensure the base ends with '/api'
const baseUrl = rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/$/, '') + '/api';

// Create an Axios instance with the resolved base URL
const api = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor to include the token in headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Adjust the key if necessary
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ensure backend receives the user_id on POST requests when available
    try {
      const uid = localStorage.getItem('user_id');
      const method = (config.method || '').toLowerCase();
      if (method === 'post' && uid) {
        // If the request is FormData, append the field
        if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
          config.data.append('user_id', uid);
        } else {
          // Try to handle JSON bodies (object or stringified JSON)
          const contentType = (config.headers && (config.headers['Content-Type'] || config.headers['content-type'])) || '';
          if (typeof config.data === 'string' && contentType.includes('application/json')) {
            try {
              const parsed = JSON.parse(config.data);
              if (parsed && typeof parsed === 'object') {
                parsed.user_id = uid;
                config.data = JSON.stringify(parsed);
              } else {
                // fallback to wrapping
                config.data = JSON.stringify({ payload: parsed, user_id: uid });
              }
            } catch (parseErr) {
              // if parsing fails, wrap into an object and log the parse error
              console.warn('Failed to parse JSON request body when attaching user_id:', String(parseErr));
              config.data = JSON.stringify({ data: config.data, user_id: uid });
              config.headers = config.headers || {};
              config.headers['Content-Type'] = 'application/json';
            }
          } else if (config.data && typeof config.data === 'object') {
            // plain object - merge user_id in
            config.data = { ...config.data, user_id: uid };
          } else if (!config.data) {
            // no body yet - create one
            config.data = { user_id: uid };
            config.headers = config.headers || {};
            if (!contentType) config.headers['Content-Type'] = 'application/json';
          }
        }
      }
    } catch (err) {
      // Do not block requests if localStorage access or parsing fails
      console.warn('Could not attach user_id to POST request', String(err));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: if the backend indicates the token is invalid/expired (401) or forbidden (403),
// remove authentication info from localStorage so the app state stays in sync with the backend.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const resp = error && error.response;
      if (resp && (resp.status === 401 || resp.status === 403)) {
        // backend rejected token or access — clear stored credentials
        try {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_id');
        } catch (e) {
          // ignore storage errors
          console.warn('Failed to clear localStorage after auth error', e);
        }
        // Refresh/redirect to auth page so the UI can re-authenticate.
        try {
          if (typeof window !== 'undefined' && window.location) {
            // use replace to avoid leaving the invalid page in history
            window.location.replace('/auth');
          }
        } catch (navErr) {
          console.warn('Failed to redirect to /auth after auth error', navErr);
        }
      }
    } catch (e) {
      // swallow any unexpected errors in the interceptor
      console.warn('Error in response interceptor', e);
    }
    return Promise.reject(error);
  }
);

export default api;
