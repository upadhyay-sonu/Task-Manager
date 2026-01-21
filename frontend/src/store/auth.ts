import { create } from 'zustand';
import { AuthState, User } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      accessToken: user.accessToken,
    }),

  setAccessToken: (token: string) =>
    set({ accessToken: token }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
    }),
}));

// Hydrate from localStorage on client side only
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');
  
  if (stored && token && token !== 'null' && token !== 'undefined') {
    try {
      const user = JSON.parse(stored);
      if (user.userId && user.accessToken) {
        useAuthStore.setState({
          user,
          isAuthenticated: true,
          accessToken: token,
        });
      }
    } catch (e) {
      // Invalid stored data - clear it
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }
}
