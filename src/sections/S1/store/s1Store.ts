import { create } from "zustand";
import type { CreditReport } from "../../../types/credit";

type S1Store = {
  reports: CreditReport[];

  setReports: (reports: CreditReport[]) => void;

  activeCreditReport: string | null;

  setActiveCreditReport: (label: string) => void;
};

export const useS1Store = create<S1Store>((set) => ({
  reports: [],

  setReports: (reports) => set({ reports }),

  activeCreditReport: null,

  setActiveCreditReport: (label) => set({ activeCreditReport: label }),
}));
