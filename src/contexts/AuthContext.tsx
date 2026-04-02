import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('aerosky_auth') === 'true');
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const stored = localStorage.getItem('aerosky_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setLoginError('Invalid email or password');
        return false;
      }

      const data = await response.json();
      const userName = email.split('@')[0];
      const u = { name: userName, email };
      
      setUser(u);
      setIsLoggedIn(true);
      localStorage.setItem('aerosky_auth', 'true');
      localStorage.setItem('aerosky_user', JSON.stringify(u));
      localStorage.setItem('authToken', data.token);
      
      return true;
    } catch (err) {
      setLoginError('Connection error. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setLoginError(null);
    localStorage.removeItem('aerosky_auth');
    localStorage.removeItem('aerosky_user');
    localStorage.removeItem('authToken');
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
