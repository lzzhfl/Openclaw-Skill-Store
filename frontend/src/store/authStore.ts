import { create } from 'zustand';
import { authService } from '../services/authService';
import type { UserVO } from '../types/user';

interface AuthState {
  user: UserVO | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.login({ username, password });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      set({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register({ username, email, password });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      set({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchMe: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      // Token invalid, clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
