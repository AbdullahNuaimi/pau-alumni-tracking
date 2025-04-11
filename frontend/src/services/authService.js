import axios from 'axios';
import { setAuthToken } from './api';
const API_URL = 'http://localhost:5000/api/v1/auth';

// Register User
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return {
      success: true,
      message: 'تم تسجيل الحساب بنجاح',
      user: response.data.data.user
    };
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء التسجيل';
    return { success: false, message: errorMessage };
  }
};

// Login User
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data?.user?.id,
        name: response.data.data?.user?.name,
        role: response.data.data?.user?.role
      }));
    }

    return {
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: response.data.data?.user
    };
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    return { success: false, message: errorMessage };
  }
};

// Logout User
export const logout = async (callApi = false) => {
    try {
      if (callApi) {
        await axios.post(`${API_URL}/logout`);
      }
  

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      return { 
        success: true,
        message: 'تم تسجيل الخروج بنجاح' 
      };
    } catch (err) {

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      return {
        success: false,
        message: 'تم تسجيل الخروج محلياً ولكن حدث خطأ في الخروج من الخادم'
      };
    }
  };