import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  planExpireAt?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: true,
  isAuthenticated: !!localStorage.getItem('auth_token'),

  login: (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const { authApi } = await import('@/services/api');
      const response = await authApi.getMe();
      if (response.success && response.data) {
        set({
          user: response.data,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem('auth_token');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
