import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

interface User {
  email: string;
  name: string;
  phone: string;
  profile_picture: string;
  user_type: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isVerifying: boolean;
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedToken, setHasCheckedToken] = useState<boolean>(false);

  const verifyToken = useCallback(async () => {
    // Skip verification if we've already checked the token
    if (hasCheckedToken) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authService.getCurrentUser();
      if (response.status && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setIsVerifying(false);
      setHasCheckedToken(true);
    }
  }, [hasCheckedToken]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (token: string, userData: User) => {
    try {
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsAuthenticated(true);
      setIsVerifying(false);
      setHasCheckedToken(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setIsVerifying(false);
    setHasCheckedToken(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isVerifying, user, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 