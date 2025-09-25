import axios from 'axios';

// Create an Axios instance with a default base URL
const api = axios.create({
  baseURL: 'http://192.168.100.26:8000/api', // Change this to your actual API base URL
});

export default api;
