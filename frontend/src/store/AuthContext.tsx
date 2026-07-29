import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthData, User } from '@/types';
import { userApi } from '@/api/endpoints';
import { safeStorage } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => safeStorage.getItem('accessToken'));
  // Only show loading on first mount when we have a stored token to validate
  const [isLoading, setIsLoading] = useState(() => !!safeStorage.getItem('accessToken'));

  /**
   * login() — called immediately after a successful /auth/login response.
   * Sets the token AND pre-populates the user from the JWT payload so there
   * is NO delay before isAuthenticated becomes true and the redirect fires.
   */
  const login = useCallback((authData: AuthData) => {
    safeStorage.setItem('accessToken', authData.accessToken);
    safeStorage.setItem('refreshToken', authData.refreshToken);
    setToken(authData.accessToken);
    // Immediately mark the user as authenticated using the data returned by
    // the login endpoint — no extra round-trip needed.
    setUser({
      id: 0,               // will be replaced once profile loads
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    safeStorage.removeItem('accessToken');
    safeStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  /**
   * refreshUser() — validates the stored token by fetching the full profile.
   * Called once on mount (when a token exists in localStorage).
   * Sets isLoading=false in finally block so the app never stays locked.
   */
  const refreshUser = useCallback(async () => {
    const storedToken = safeStorage.getItem('accessToken');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await userApi.getProfile();
      setUser(res.data.data);
    } catch {
      // Token is invalid / expired — clear auth state silently
      safeStorage.removeItem('accessToken');
      safeStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run once on mount to restore the session from localStorage
  useEffect(() => {
    refreshUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!user,
      isLoading,
      login, logout, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
