import { create } from "zustand";
import { persist } from "zustand/middleware";

type SectionStatus = Record<string, string>;

type TimeTracking = {
  sectionTimes: Record<string, number>; // cumulative seconds per section
  screenTimes: Record<string, number>; // cumulative seconds per screen
  sectionStartTime: number | null; // when current section started
  screenStartTime: number | null; // when current screen started
};

type AppStore = {
  sessionId: string;
  sectionStatus: SectionStatus;
  timeTracking: TimeTracking;

  setSessionId: (id: string) => void;
  setSectionStatus: (
    status: SectionStatus | ((prev: SectionStatus) => SectionStatus),
  ) => void;

  // time tracking actions
  startSectionTimer: (section: string) => void;
  stopSectionTimer: (section: string) => void;
  startScreenTimer: (screen: string) => void;
  stopScreenTimer: (screen: string) => number; // returns duration

  resetStore: () => void;
};

const initialAppState = {
  sessionId: "",
  sectionStatus: {
    S0: "active",
    S1: "locked",
    S2: "locked",
    S3: "locked",
    S4: "locked",
    S5: "locked",
  },
  timeTracking: {
    sectionTimes: {},
    screenTimes: {},
    sectionStartTime: null,
    screenStartTime: null,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialAppState,

      setSessionId: (id) => set(() => ({ sessionId: id })),

      setSectionStatus: (status) =>
        set((state) => ({
          sectionStatus:
            typeof status === "function" ? status(state.sectionStatus) : status,
        })),

      // start tracking a section
      startSectionTimer: (section) =>
        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            sectionStartTime: Date.now(),
            // reset section time when starting fresh
            sectionTimes: {
              ...state.timeTracking.sectionTimes,
              [section]: state.timeTracking.sectionTimes[section] || 0,
            },
          },
        })),

      // stop tracking section — accumulate time
      stopSectionTimer: (section) => {
        const { timeTracking } = get();
        if (!timeTracking.sectionStartTime) return;

        const elapsed = Math.floor(
          (Date.now() - timeTracking.sectionStartTime) / 1000,
        );

        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            sectionStartTime: null,
            sectionTimes: {
              ...state.timeTracking.sectionTimes,
              [section]:
                (state.timeTracking.sectionTimes[section] || 0) + elapsed,
            },
          },
        }));
      },

      // start tracking a screen
      startScreenTimer: (screen) =>
        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            screenStartTime: Date.now(),
          },
        })),

      // stop tracking screen — returns duration in seconds
      stopScreenTimer: (screen) => {
        const { timeTracking } = get();
        if (!timeTracking.screenStartTime) return 0;

        const elapsed = Math.floor(
          (Date.now() - timeTracking.screenStartTime) / 1000,
        );

        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            screenStartTime: null,
            screenTimes: {
              ...state.timeTracking.screenTimes,
              [screen]: (state.timeTracking.screenTimes[screen] || 0) + elapsed,
            },
          },
        }));

        return elapsed;
      },

      resetStore: () => set(() => ({ ...initialAppState })),
    }),
    { name: "app-store" },
  ),
);
