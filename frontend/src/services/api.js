import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-e663.up.railway.app/';
console.log('API Base URL:', API_BASE_URL); // Debug log

if (!API_BASE_URL.includes('localhost')) {
  axios.defaults.baseURL = API_BASE_URL;
} else {
  console.error('Invalid API URL detected:', API_BASE_URL);
}

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