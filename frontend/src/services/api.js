import axios from 'axios';

const API_BASE_URL = 'https://pau-alumni-tracking-production.up.railway.app:8080';
console.log('API Base URL:', API_BASE_URL); // Debug log
// axios.defaults.baseURL = 'https://pau-alumni-tracking-production.up.railway.app:8080';
axios.defaults.baseURL = API_BASE_URL;

// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}