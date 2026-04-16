import { create } from "zustand";

export type S0State = {
  applicationDate: string;
  closingDate: string;
  creditAsOfDate: string;
  borrowerCount: number;
};

type S0Store = {
  data: S0State | null;
  setData: (data: S0State) => void;
};

export const useS0Store = create<S0Store>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
