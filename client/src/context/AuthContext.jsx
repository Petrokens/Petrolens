// Authentication Context for role-based access

import { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../config/constants.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('qc_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password, role, discipline = null) => {
    // Simple authentication (in production, this would call an API)
    // For demo purposes, accept any credentials
    const userData = {
      username,
      role: role || USER_ROLES.USER,
      discipline: role === USER_ROLES.ADMIN ? null : discipline,
      loginTime: new Date().toISOString()
    };

    setUser(userData);
    localStorage.setItem('qc_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qc_user');
  };

  const isAdmin = () => user?.role === USER_ROLES.ADMIN;
  const hasDisciplineAccess = (discipline) => {
    if (isAdmin()) return true;
    return user?.discipline === discipline;
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    hasDisciplineAccess,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

