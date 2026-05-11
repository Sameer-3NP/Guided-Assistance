// store/useSessionStore.ts
import { create } from "zustand";

type SessionStore = {
  sessionId: string | null;
  setSessionId: (id: string) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),
}));
