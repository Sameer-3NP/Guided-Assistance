import { create } from "zustand";

export type SectionStatus = "locked" | "active" | "completed";

type WorkflowStore = {
  activeSection: string;

  sectionStatus: Record<string, SectionStatus>;

  setActiveSection: (section: string) => void;

  setSectionStatus: (
    updater:
      | Record<string, SectionStatus>
      | ((
          prev: Record<string, SectionStatus>,
        ) => Record<string, SectionStatus>),
  ) => void;

  // NEW HELPERS
  completeSection: (section: string) => void;
  activateSection: (section: string) => void;
  lockSection: (section: string) => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  activeSection: "S0",

  sectionStatus: {
    S0: "active",
    S1: "locked",
    S2: "locked",
    S3: "locked",
    S4: "locked",
    S5: "locked",
  },

  setActiveSection: (section) =>
    set({
      activeSection: section,
    }),

  setSectionStatus: (updater) =>
    set((state) => ({
      sectionStatus:
        typeof updater === "function" ? updater(state.sectionStatus) : updater,
    })),

  // ✅ mark section completed
  completeSection: (section) =>
    set((state) => ({
      sectionStatus: {
        ...state.sectionStatus,
        [section]: "completed",
      },
    })),

  // ✅ activate section
  activateSection: (section) =>
    set((state) => ({
      sectionStatus: {
        ...state.sectionStatus,
        [section]: "active",
      },
    })),

  // ✅ lock section
  lockSection: (section) =>
    set((state) => ({
      sectionStatus: {
        ...state.sectionStatus,
        [section]: "locked",
      },
    })),
}));
