// Simplified Auth Context without Firebase
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api.simple';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (has token)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      api.get('/auth/me')
        .then(response => {
          setCurrentUser(response.data.data);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      const data = response.data.data;
      console.log('📦 Extracted data:', data);
      
      const { token, user } = data;
      console.log('🔑 Token:', token ? 'Present (' + token.substring(0, 20) + '...)' : 'Missing');
      console.log('👤 User:', user ? user.email : 'Missing');
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      if (!user) {
        throw new Error('No user data received from server');
      }
      
      // Store token
      localStorage.setItem('authToken', token);
      console.log('💾 Token stored in localStorage');
      
      // Set user data
      setCurrentUser(user);
      console.log('✅ Current user set:', user.email);
      
      return user;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      
      // Set user data
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
