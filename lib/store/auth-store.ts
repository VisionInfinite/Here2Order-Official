import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResource } from '@clerk/types';

// Define types for user and auth state
interface AuthState {
  user: UserResource | null;
  isLoaded: boolean;
  setUser: (user: UserResource | null) => void;
  setLoaded: (loaded: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoaded: false,
      setUser: (user) => set({ user }),
      setLoaded: (loaded) => set({ isLoaded: loaded }),
      reset: () => set({ user: null, isLoaded: false }),
    }),
    {
      name: 'auth-storage', // Persist auth state
      partialize: (state) => ({ user: state.user }), // Only persist `user`, not `isLoaded`
    }
  )
);
