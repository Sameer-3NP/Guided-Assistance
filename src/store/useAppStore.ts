import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type SectionStatus = Record<string, string>;

type AppStore = {
  sessionId: string;
  sectionStatus: SectionStatus;
  setSectionStatus: (
    status: SectionStatus | ((prev: SectionStatus) => SectionStatus),
  ) => void;
  resetStore: () => void;
};

const initialAppState = {
  sessionId: uuidv4().slice(0, 8).toUpperCase(),
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

      resetStore: () =>
        set(() => ({
          ...initialAppState,
          sessionId: uuidv4().slice(0, 8).toUpperCase(),
        })),
    }),
    { name: "app-store" },
  ),
);
