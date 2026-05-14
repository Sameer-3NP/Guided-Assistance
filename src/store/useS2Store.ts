// store/useS2Store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CoreIdentity = {
  firstLastName: string | null;
  middleName: string | null;
  suffix: string | null;
  ssn: string | null;
  dob: string | null;
  akaSsn: string | null;
};

type CoreIdentityConditions = {
  nameMismatch: string;
  middleNameIssue: string;
  suffixIssue: string;
  ssnIssue: string;
  dobIssue: string;
  akaSsnIssue: string;
};

type CoreIdentitySummary = {
  conditions: string[];
  alerts: string[];
};

type CurrentAddress = {
  addressMatch: string | null;
};

type CurrentAddressConditions = {
  addressMatch: string;
};

type CurrentAddressSummary = {
  conditions: string[];
};

type PreviousAddress = {
  hasPreviousAddress: string | null;
  addressMatch: string | null;
  requireUpdatedReport: string | null;
};

type PreviousAddressConditions = {
  requireUpdatedReport: string;
};

type Section2Summary = {
  raisedConditions: string[];
};

type S2Store = {
  coreIdentity: CoreIdentity;
  setCoreIdentity: (data: Partial<CoreIdentity>) => void;

  coreIdentityConditions: CoreIdentityConditions;
  setCoreIdentityConditions: (data: Partial<CoreIdentityConditions>) => void;

  coreIdentitySummary: CoreIdentitySummary;
  setCoreIdentitySummary: (data: Partial<CoreIdentitySummary>) => void;

  currentAddress: CurrentAddress;
  setCurrentAddress: (data: Partial<CurrentAddress>) => void;

  currentAddressConditions: CurrentAddressConditions;
  setCurrentAddressConditions: (
    data: Partial<CurrentAddressConditions>,
  ) => void;

  currentAddressSummary: CurrentAddressSummary;
  setCurrentAddressSummary: (data: Partial<CurrentAddressSummary>) => void;

  previousAddress: PreviousAddress;
  setPreviousAddress: (data: Partial<PreviousAddress>) => void;

  previousAddressConditions: PreviousAddressConditions;
  setPreviousAddressConditions: (
    data: Partial<PreviousAddressConditions>,
  ) => void;

  section2Summary: Section2Summary;
  setSection2Summary: (data: Partial<Section2Summary>) => void;

  // ⭐ RESET
  resetStore: () => void;
};

// ✅ INITIAL STATE
const initialS2State = {
  coreIdentity: {
    firstLastName: null,
    middleName: null,
    suffix: null,
    ssn: null,
    dob: null,
    akaSsn: null,
  },

  coreIdentityConditions: {
    nameMismatch: "",
    middleNameIssue: "",
    suffixIssue: "",
    ssnIssue: "",
    dobIssue: "",
    akaSsnIssue: "",
  },

  coreIdentitySummary: {
    conditions: [] as string[],
    alerts: [] as string[],
  },

  currentAddress: {
    addressMatch: null,
  },

  currentAddressConditions: {
    addressMatch: "",
  },

  currentAddressSummary: {
    conditions: [] as string[],
  },

  previousAddress: {
    hasPreviousAddress: null,
    addressMatch: null,
    requireUpdatedReport: null,
  },

  previousAddressConditions: {
    requireUpdatedReport: "",
  },

  section2Summary: {
    raisedConditions: [] as string[],
  },
};

// ✅ STORE
export const useS2Store = create<S2Store>()(
  persist(
    (set) => ({
      ...initialS2State,

      setCoreIdentity: (data) =>
        set((state) => ({
          coreIdentity: { ...state.coreIdentity, ...data },
        })),

      setCoreIdentityConditions: (data) =>
        set((state) => ({
          coreIdentityConditions: {
            ...state.coreIdentityConditions,
            ...data,
          },
        })),

      setCoreIdentitySummary: (data) =>
        set((state) => ({
          coreIdentitySummary: {
            ...state.coreIdentitySummary,
            ...data,
          },
        })),

      setCurrentAddress: (data) =>
        set((state) => ({
          currentAddress: { ...state.currentAddress, ...data },
        })),

      setCurrentAddressConditions: (data) =>
        set((state) => ({
          currentAddressConditions: {
            ...state.currentAddressConditions,
            ...data,
          },
        })),

      setCurrentAddressSummary: (data) =>
        set((state) => ({
          currentAddressSummary: {
            ...state.currentAddressSummary,
            ...data,
          },
        })),

      setPreviousAddress: (data) =>
        set((state) => ({
          previousAddress: { ...state.previousAddress, ...data },
        })),

      setPreviousAddressConditions: (data) =>
        set((state) => ({
          previousAddressConditions: {
            ...state.previousAddressConditions,
            ...data,
          },
        })),

      setSection2Summary: (data) =>
        set((state) => ({
          section2Summary: {
            ...state.section2Summary,
            ...data,
          },
        })),

      // ⭐ RESET (persist-safe)
      resetStore: () => {
        set({ ...initialS2State });
        localStorage.removeItem("s2-store");
      },
    }),
    {
      name: "s2-store",
    },
  ),
);
