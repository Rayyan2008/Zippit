import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// TEMPORARY DEVELOPMENT CREDENTIALS ONLY
// This will be replaced with Supabase authentication
const DEV_ADMIN_EMAIL = 'admin@zippit.local';
const DEV_ADMIN_PASSWORD = 'zippit123';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in - runs on mount
    const restoreSession = async () => {
      // Give localStorage a moment to be available
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('[v0] Error parsing stored user:', error);
          localStorage.removeItem('admin_user');
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // TEMPORARY: Dev login with fixed credentials
  const devLogin = (email, password) => {
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      const userData = {
        id: 'dev_admin',
        email: DEV_ADMIN_EMAIL,
        name: 'Development Admin',
        authMethod: 'dev-temp', // TEMPORARY
      };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials (dev: admin@zippit.local / zippit123)' };
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    devLogin, // TEMPORARY: Remove when using Supabase
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
