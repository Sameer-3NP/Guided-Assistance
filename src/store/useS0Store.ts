// store/useS0Store.ts
import { create } from "zustand";
import type { InventoryItem } from "../types/inventory";
import { persist } from "zustand/middleware";

type S0Store = {
  s0: InventoryItem | null;
  setS0: (data: InventoryItem) => void;

  // ⭐ RESET
  resetStore: () => void;
};

// ✅ INITIAL STATE
const initialS0State = {
  s0: null as InventoryItem | null,
};

export const useS0Store = create<S0Store>()(
  persist(
    (set) => ({
      ...initialS0State,

      setS0: (data) => set({ s0: data }),

      // ⭐ RESET (with persist clear)
      resetStore: () => {
        set({ ...initialS0State });
        localStorage.removeItem("s0-store");
      },
    }),
    {
      name: "s0-store",
    },
  ),
);
