import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true, // true until Firebase auth check finishes
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      updateSettings: (newSettings) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              settings: {
                ...state.user.settings,
                ...newSettings,
              },
            },
          };
        }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'finwrap-user-storage',
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
);
