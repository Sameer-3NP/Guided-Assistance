// store/useS1Store.ts
import { create } from "zustand";
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
};

export const useS1Store = create<S1Store>((set) => ({
  s1: [],
  setS1: (data) => set({ s1: data }),

  activeCreditReport: null,
  setActiveCreditReport: (label) => set({ activeCreditReport: label }),

  selectedReports: [],
  setSelectedReports: (reports) => set({ selectedReports: reports }),

  reportQueue: [],
  setReportQueue: (queue) => set({ reportQueue: queue }),

  currentReportIndex: 0,
  setCurrentReportIndex: (index) => set({ currentReportIndex: index }),

  creditValidityStep: "pullCheck",
  setCreditValidityStep: (step) => set({ creditValidityStep: step }),

  pullType: null,
  setPullType: (type) => set({ pullType: type }),

  biMergeAccepted: null,
  setBiMergeAccepted: (value) => set({ biMergeAccepted: value }),

  expiredCR: null,
  setExpiredCR: (value) => set({ expiredCR: value }),

  sourceRequestIntegrity: {
    agencyName: null,
    agencyAddress: null,
    agencyPhone: null,
    lenderName: null,
    requestedRole: "",
    lastNameMatch: null,
    loanMatch: null,
  },
  setSourceRequestIntegrity: (data) =>
    set((state) => ({
      sourceRequestIntegrity: { ...state.sourceRequestIntegrity, ...data },
    })),

  systemAlignmentReview: {
    ausDate: "",
    losAlign: null,
    ausAlign: null,
    matchingReport: null,
    creditNewerThanAUS: null,
    matchingCreditAvailable: null,
  },
  setSystemAlignmentReview: (data) =>
    set((state) => ({
      systemAlignmentReview: { ...state.systemAlignmentReview, ...data },
    })),

  CreditCondition: {
    softPull: "",
    expiredCR: "",
  },
  setCreditCondition: (data) =>
    set((state) => ({
      CreditCondition: { ...state.CreditCondition, ...data },
    })),

  repositoryConditions: {
    biMergeFail:
      "Credit report has been pulled with less than three distinct repositories and same is not acceptable. Hence, obtain a Tri-merged credit report in order to proceed further.",
    biMergePass:
      "Credit report has been pulled with less than three distinct repositories (available repository names should be Equifax, Experian and TransUnion). As per client requirement, Tri-merge credit report is not required.",
  },
  setRepositoryConditions: (data) =>
    set((state) => ({
      repositoryConditions: { ...state.repositoryConditions, ...data },
    })),

  sourceIntegrityConditions: {
    missingAgency:
      "Credit report available in the file does not reflect {missingFields}. Hence, new credit report showing {missingFields} is required to be pulled.",
    requestedByIssue:
      "Credit report is {missingFields}. Contact LO to pull new credit report requested by LO or LP.",
    loanMismatch:
      "Credit report available in the file reflects a loan number which is different than the current loan number. The loan number mentioned on credit report is currently active in the LOS. Hence, we need confirmation if the loan is cancelled or will be cancelled. If the loan is not cancelled, then property needs to be updated in LOS along with complete PITIA information.",
  },
  setSourceIntegrityConditions: (data) =>
    set((state) => ({
      sourceIntegrityConditions: {
        ...state.sourceIntegrityConditions,
        ...data,
      },
    })),

  systemAlignmentConditions: {
    caseA_mismatch: "",
    caseB_matchFound: "",
    caseB_noMatch: "",
  },
  setSystemAlignmentConditions: (data) =>
    set((state) => ({
      systemAlignmentConditions: {
        ...state.systemAlignmentConditions,
        ...data,
      },
    })),
}));
