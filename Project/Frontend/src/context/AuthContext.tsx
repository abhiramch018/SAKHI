import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authStorage } from '../lib/auth';
import { authApi, getApiErrorMessage } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = authStorage.getToken();
    const savedUser = authStorage.getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token: jwtToken, user: loggedInUser } = res.data;
        authStorage.setToken(jwtToken);
        authStorage.setUser(loggedInUser);
        setToken(jwtToken);
        setUser(loggedInUser);
        return loggedInUser;
      }
      throw new Error(res.message || 'Invalid email or password.');
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await authApi.register({ name, email, phone, password });
      if (!res.success) {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
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

