// store/useAppStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SectionStatus = Record<string, string>;

type AppStore = {
  sectionStatus: SectionStatus;
  setSectionStatus: (
    status: SectionStatus | ((prev: SectionStatus) => SectionStatus),
  ) => void;

  // ⭐ RESET
  resetStore: () => void;
};

// ✅ INITIAL STATE (typed properly — no `as` needed)
const initialAppState: {
  sectionStatus: SectionStatus;
} = {
  sectionStatus: {
    S0: "active",
    S1: "locked",
    S2: "locked",
    S3: "locked",
    S4: "locked",
    S5: "locked",
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialAppState,

      setSectionStatus: (status) =>
        set((state) => ({
          sectionStatus:
            typeof status === "function" ? status(state.sectionStatus) : status,
        })),

      // ⭐ RESET (very important for flow restart)
      resetStore: () => {
        set({ ...initialAppState });
        localStorage.removeItem("app-store");
      },
    }),
    {
      name: "app-store",
    },
  ),
);
