import axios from 'axios';

// Create an Axios instance with a default base URL
const api = axios.create({
  baseURL: 'http://192.168.100.125:8000/api', // Change this to your actual API base URL
});

// Add a request interceptor to include the token in headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Adjust the key if necessary
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
