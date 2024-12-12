'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from './AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      //console.log('AuthProvider: Initializing authentication');
      setIsLoading(true);
      const token = authService.getAccessToken();
      if (token) {
        try {
          await authService.refreshToken();
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            //console.log('AuthProvider: User authenticated');
            setIsAuthenticated(true);
            setUser(currentUser);
          } else {
            //console.log('AuthProvider: No current user');
          }
        } catch (error) {
          //console.error('AuthProvider: Token refresh failed:', error);
          authService.logout();
        }
      } else {
        //console.log('AuthProvider: No token found');
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login(username, password);
      const currentUser = authService.getCurrentUser();
      //console.log('AuthProvider: Login successful, setting isAuthenticated to true');
      setIsAuthenticated(true);
      setUser(currentUser);
    } catch (error) {
      //console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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