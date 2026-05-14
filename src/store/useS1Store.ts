// store/useS1Store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreditReport } from "../types/credit";

type SourceRequestIntegrity = {
  agencyName: string | null;
  agencyAddress: string | null;
  agencyPhone: string | null;
  lenderName: string | null;
  requestedRole: string;
  lastNameMatch: string | null;
  loanMatch: string | null;
};

type SystemAlignmentReview = {
  ausDate: string;
  losAlign: string | null;
  ausAlign: string | null;
  matchingReport: string | null;
  creditNewerThanAUS: string | null;
  matchingCreditAvailable: string | null;
};

type CreditCondition = {
  softPull: string;
  expiredCR: string;
};

type RepositoryConditions = {
  biMergeFail: string;
  biMergePass: string;
};

type SourceIntegrityConditions = {
  missingAgency: string;
  requestedByIssue: string;
  loanMismatch: string;
};

type SystemAlignmentConditions = {
  caseA_mismatch: string;
  caseB_matchFound: string;
  caseB_noMatch: string;
};

type S1Store = {
  s1: CreditReport[];
  setS1: (data: CreditReport[]) => void;

  activeCreditReport: string | null;
  setActiveCreditReport: (label: string | null) => void;

  selectedReports: string[];
  setSelectedReports: (reports: string[]) => void;

  reportQueue: string[];
  setReportQueue: (queue: string[]) => void;

  currentReportIndex: number;
  setCurrentReportIndex: (index: number) => void;

  creditValidityStep: "pullCheck" | "expirationCheck";
  setCreditValidityStep: (step: "pullCheck" | "expirationCheck") => void;

  pullType: string | null;
  setPullType: (type: string | null) => void;

  biMergeAccepted: string | null;
  setBiMergeAccepted: (value: string | null) => void;

  expiredCR: boolean | null;
  setExpiredCR: (value: boolean | null) => void;

  sourceRequestIntegrity: SourceRequestIntegrity;
  setSourceRequestIntegrity: (data: Partial<SourceRequestIntegrity>) => void;

  systemAlignmentReview: SystemAlignmentReview;
  setSystemAlignmentReview: (data: Partial<SystemAlignmentReview>) => void;

  CreditCondition: CreditCondition;
  setCreditCondition: (data: Partial<CreditCondition>) => void;

  repositoryConditions: RepositoryConditions;
  setRepositoryConditions: (data: Partial<RepositoryConditions>) => void;

  sourceIntegrityConditions: SourceIntegrityConditions;
  setSourceIntegrityConditions: (
    data: Partial<SourceIntegrityConditions>,
  ) => void;

  systemAlignmentConditions: SystemAlignmentConditions;
  setSystemAlignmentConditions: (
    data: Partial<SystemAlignmentConditions>,
  ) => void;

  // ⭐ RESET
  resetStore: () => void;
};

// ✅ INITIAL STATE
const initialS1State = {
  s1: [] as CreditReport[],

  activeCreditReport: null,
  selectedReports: [] as string[],
  reportQueue: [] as string[],
  currentReportIndex: 0,

  creditValidityStep: "pullCheck" as "pullCheck" | "expirationCheck",

  pullType: null,
  biMergeAccepted: null,
  expiredCR: null,

  sourceRequestIntegrity: {
    agencyName: null,
    agencyAddress: null,
    agencyPhone: null,
    lenderName: null,
    requestedRole: "",
    lastNameMatch: null,
    loanMatch: null,
  },

  systemAlignmentReview: {
    ausDate: "",
    losAlign: null,
    ausAlign: null,
    matchingReport: null,
    creditNewerThanAUS: null,
    matchingCreditAvailable: null,
  },

  CreditCondition: {
    softPull: "",
    expiredCR: "",
  },

  repositoryConditions: {
    biMergeFail:
      "Credit report has been pulled with less than three distinct repositories and same is not acceptable. Hence, obtain a Tri-merged credit report in order to proceed further.",
    biMergePass:
      "Credit report has been pulled with less than three distinct repositories (available repository names should be Equifax, Experian and TransUnion). As per client requirement, Tri-merge credit report is not required.",
  },

  sourceIntegrityConditions: {
    missingAgency:
      "Credit report available in the file does not reflect {missingFields}. Hence, new credit report showing {missingFields} is required to be pulled.",
    requestedByIssue:
      "Credit report is {missingFields}. Contact LO to pull new credit report requested by LO or LP.",
    loanMismatch:
      "Credit report available in the file reflects a loan number which is different than the current loan number. The loan number mentioned on credit report is currently active in the LOS. Hence, we need confirmation if the loan is cancelled or will be cancelled. If the loan is not cancelled, then property needs to be updated in LOS along with complete PITIA information.",
  },

  systemAlignmentConditions: {
    caseA_mismatch: "",
    caseB_matchFound: "",
    caseB_noMatch: "",
  },
};

// ✅ STORE
export const useS1Store = create<S1Store>()(
  persist(
    (set) => ({
      ...initialS1State,

      setS1: (data) => set({ s1: data }),
      setActiveCreditReport: (label) => set({ activeCreditReport: label }),
      setSelectedReports: (reports) => set({ selectedReports: reports }),
      setReportQueue: (queue) => set({ reportQueue: queue }),
      setCurrentReportIndex: (index) => set({ currentReportIndex: index }),

      setCreditValidityStep: (step) => set({ creditValidityStep: step }),
      setPullType: (type) => set({ pullType: type }),
      setBiMergeAccepted: (value) => set({ biMergeAccepted: value }),
      setExpiredCR: (value) => set({ expiredCR: value }),

      setSourceRequestIntegrity: (data) =>
        set((state) => ({
          sourceRequestIntegrity: {
            ...state.sourceRequestIntegrity,
            ...data,
          },
        })),

      setSystemAlignmentReview: (data) =>
        set((state) => ({
          systemAlignmentReview: {
            ...state.systemAlignmentReview,
            ...data,
          },
        })),

      setCreditCondition: (data) =>
        set((state) => ({
          CreditCondition: { ...state.CreditCondition, ...data },
        })),

      setRepositoryConditions: (data) =>
        set((state) => ({
          repositoryConditions: {
            ...state.repositoryConditions,
            ...data,
          },
        })),

      setSourceIntegrityConditions: (data) =>
        set((state) => ({
          sourceIntegrityConditions: {
            ...state.sourceIntegrityConditions,
            ...data,
          },
        })),

      setSystemAlignmentConditions: (data) =>
        set((state) => ({
          systemAlignmentConditions: {
            ...state.systemAlignmentConditions,
            ...data,
          },
        })),

      // ⭐ RESET (with persist clear)
      resetStore: () => {
        set({ ...initialS1State });
        localStorage.removeItem("s1-store");
      },
    }),
    {
      name: "s1-store",
    },
  ),
);
