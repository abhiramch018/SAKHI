import { User } from '../types';

const TOKEN_KEY = 'sakhi_token';
const USER_KEY = 'sakhi_user';

export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

