import { create } from "zustand";
import { persist } from "zustand/middleware";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 mins
// const WARNING_TIME = 60 * 1000; // last 1 min

type SessionStore = {
  lastActive: number;
  updateActivity: () => void;
  isExpired: () => boolean;
  resetSession: () => void;
  getRemainingTime: () => number;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      lastActive: Date.now(),

      updateActivity: () => {
        set({ lastActive: Date.now() });
      },

      isExpired: () => {
        return Date.now() - get().lastActive > SESSION_TIMEOUT;
      },

      resetSession: () => {
        set({ lastActive: Date.now() });
      },

      getRemainingTime: () => {
        return SESSION_TIMEOUT - (Date.now() - get().lastActive);
      },
    }),
    {
      name: "session-store",
    },
  ),
);
