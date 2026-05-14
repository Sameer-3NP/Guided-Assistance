// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  userId: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const initialAuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,

      setUser: (user) =>
        set(() => ({
          user,
          isAuthenticated: true,
        })),

      clearUser: () =>
        set(() => ({
          ...initialAuthState,
        })),
    }),
    { name: "auth-store" },
  ),
);
