import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Parse credentials from env: "email:pass,email:pass" */
const parseCredentials = (): Map<string, string> => {
  const raw = import.meta.env.VITE_AUTH_USERS || '';
  const map = new Map<string, string>();
  if (!raw) return map;
  raw.split(',').forEach((pair: string) => {
    const [email, pass] = pair.trim().split(':');
    if (email && pass) map.set(email.toLowerCase(), pass);
  });
  return map;
};

const VALID_USERS = parseCredentials();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('aerosky_auth') === 'true');
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const stored = localStorage.getItem('aerosky_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    setLoginError(null);
    const key = email.toLowerCase().trim();
    const expected = VALID_USERS.get(key);

    if (!expected || expected !== password) {
      setLoginError('Invalid email or password');
      return false;
    }

    const u = { name: key.split('@')[0], email: key };
    setUser(u);
    setIsLoggedIn(true);
    localStorage.setItem('aerosky_auth', 'true');
    localStorage.setItem('aerosky_user', JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setLoginError(null);
    localStorage.removeItem('aerosky_auth');
    localStorage.removeItem('aerosky_user');
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
