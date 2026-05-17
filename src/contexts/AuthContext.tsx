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

/* ── Local dev fallback credentials (injected by Vite in dev mode only) ── */
const DEV_USERS: { email: string; password: string }[] = (() => {
  try {
    const raw = typeof __DEV_AUTH_USERS__ !== 'undefined' ? __DEV_AUTH_USERS__ : '';
    if (!raw) return [];
    return raw.split(',').map(entry => {
      const [email, password] = entry.split(':');
      return { email, password };
    });
  } catch {
    return [];
  }
})();

console.log('[Auth] DEV_USERS loaded:', DEV_USERS.length);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('aerosky_auth') === 'true');
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const stored = localStorage.getItem('aerosky_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);

    // Helper: authenticate via local dev credentials
    const tryDevFallback = (): boolean => {
      const devUser = DEV_USERS.find(u => u.email === email && u.password === password);
      if (devUser) {
        const u = { name: email.split('@')[0], email };
        setUser(u);
        setIsLoggedIn(true);
        localStorage.setItem('aerosky_auth', 'true');
        localStorage.setItem('aerosky_user', JSON.stringify(u));
        localStorage.setItem('authToken', 'dev-fallback-token');
        return true;
      }
      return false;
    };

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        // API reachable but rejected — try dev fallback
        if (tryDevFallback()) return true;
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
      // API unreachable — try dev fallback
      if (tryDevFallback()) return true;
      setLoginError('Invalid email or password');
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
