import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:5000/api/v1';

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