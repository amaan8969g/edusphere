import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const getAuthToken = () => {
  return sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token') || null;
};

export const clearAuthStorage = () => {
  try {
    sessionStorage.removeItem('edusphere_token');
    sessionStorage.removeItem('edusphere_user');
    localStorage.removeItem('edusphere_token');
    localStorage.removeItem('edusphere_user');
  } catch (e) {}
};

export const AuthProvider = ({ children }) => {
  // Clear any persistent localStorage on app init so project launch does NOT auto-login from old sessions
  try {
    localStorage.removeItem('edusphere_token');
    localStorage.removeItem('edusphere_user');
  } catch (e) {}

  const initialToken = sessionStorage.getItem('edusphere_token') || null;
  let initialUser = null;
  try {
    const raw = sessionStorage.getItem('edusphere_user');
    if (raw) initialUser = JSON.parse(raw);
  } catch (e) {
    initialUser = null;
  }

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data && response.data.data && response.data.data.user) {
          setUser(response.data.data.user);
          try {
            sessionStorage.setItem('edusphere_user', JSON.stringify(response.data.data.user));
          } catch (e) {}
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to verify user session:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = (userData, authToken) => {
    try {
      sessionStorage.setItem('edusphere_token', authToken);
      sessionStorage.setItem('edusphere_user', JSON.stringify(userData));
      localStorage.removeItem('edusphere_token');
      localStorage.removeItem('edusphere_user');
    } catch (e) {}

    setToken(authToken);
    setUser(userData);
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const nextUser = prev ? { ...prev, ...updatedUserData } : null;
      if (nextUser) {
        try {
          sessionStorage.setItem('edusphere_user', JSON.stringify(nextUser));
        } catch (e) {}
      }
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
