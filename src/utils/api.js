import axios from 'axios';

// Create an Axios instance with a default base URL
const api = axios.create({
  baseURL: 'https://hr-portal-backend.portalwebsite.net/public/api', // Change this to your actual API base URL
});

export default api;
