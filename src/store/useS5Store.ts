// store/useS5Store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------------- TYPES ---------------- */

type ActiveBankruptcyHandling = {
  hasActiveBankruptcy: string | null;
  bankruptcyType: string | null;
  cases: {
    caseNumber: string;
    bankruptcyDate: string;
  }[];
  selectedCase: {
    caseNumber: string;
    bankruptcyDate: string;
  };
  supportingDocument: string | null;
  escalatedToManagement: boolean;
};

type BankruptcyWaitingValidation = {
  hasInactiveBankruptcy: string | null;
  bankruptcyType: string | null;
  caseNumber: string;
  dischargedDate: string;
  waitingPeriod4Years: string | null;
  waitingPeriod2Years: string | null;
  lenderRequirement: string | null;
  bankruptcyDocumentAvailable: string | null;
  extenuatingDocuments: string | null;
  dismissedOrDischarged: string | null;
  escalatedToManagement: boolean;
};

type MortgageDerogatoryEventHandling = {
  derogatoryTypes: string[];
  accounts: {
    creditorName: string;
    accountNumber: string;
  }[];
  selectedAccount?: {
    creditorName: string;
    accountNumber: string;
  };

  foreclosureDocsAvailable: string | null;
  foreclosureDocTypes: string[];
  trusteesDeedChecklist: string[];
  propertyProfileChecklist: string[];
  foreclosureWaitingPeriod: string | null;

  preForeclosureDocsAvailable: string | null;
  preForeclosureDocTypes: string[];
  shortSaleChecklist: string[];
  settlementChecklist: string[];
  propertyProfileChecklistB: string[];
  preForeclosureWaitingPeriod: string | null;

  chargeOffDocsAvailable: string | null;
  chargeOffDocTypes: string[];
  cancellationChecklist: string[];
  lenderLetterChecklist: string[];
  chargeOffWaitingPeriod: string | null;

  escalatedToManagement: boolean;
};

type TaxLienHandling = {
  taxLienDetected: string | null;
  lienStatus: string[];
  releasedCaseNumber: string;
  releasedCreditorName: string;
  releasedDate: string;
  payoffInFileAvailable: string | null;
  releaseDateBeforeAppDate: string | null;
  taxLienSourceDocsProvided: string | null;
  taxLienSourceDocTypes: string[];
  bankStatementChecklist2: string[];
  cancelledCheckChecklist2: string[];
  giftLetterChecklist2: string[];
  taxLienAdditionalDocsProvided: string | null;
  additionalDocTypes: string[];
  creditorLetterChecklist: string[];
  bankStatementChecklist3: string[];
  cancelledCheckChecklist3: string[];
  giftLetterChecklist3: string[];
  losUpdatedForTaxLien: string | null;
  payoffInFile: string | null;
  payoffChecklist: string[];
  selectedTaxLienAccount: {
    creditorName: string;
    caseNumber: string;
  };
};

type JudgmentHandling = {
  judgmentTypes: string[];
  selectedAccount: {
    creditorName: string;
    accountNumber: string;
  };
  judgmentStatus: string[];
  releasedCreditorName: string;
  releasedCaseNumber: string;
  releasedDate: string;
  judgmentDocsAvailable: string | null;
  judgmentDocTypes: string[];
  bankStatementChecklist: string[];
  checkChecklist: string[];
  giftLetterChecklist: string[];
  judgmentSourceDocsProvided: string | null;
  judgmentAdditionalDocsProvided: string | null;
  creditorLetterChecklist3: string[];
  creditorLetterChecklist: string[];
  bankStatementChecklist3: string[];
  checkChecklist3: string[];
  giftLetterChecklist3: string[];
  losUpdatedForJudgment: string | null;
  payoffAvailable: string | null;
  payoffChecklist: string[];
  judgmentDocTypes3: string[];
  escalatedToManagement: boolean;
  releaseDateBeforeAppDate: string | null;
};

type S5Store = {
  activeBankruptcyHandling: ActiveBankruptcyHandling;
  setActiveBankruptcyHandling: (
    data: Partial<ActiveBankruptcyHandling>,
  ) => void;

  bankruptcyWaitingValidation: BankruptcyWaitingValidation;
  setBankruptcyWaitingValidation: (
    data: Partial<BankruptcyWaitingValidation>,
  ) => void;

  mortgageDerogatoryEventHandling: MortgageDerogatoryEventHandling;
  setMortgageDerogatoryEventHandling: (
    data: Partial<MortgageDerogatoryEventHandling>,
  ) => void;

  taxLienHandling: TaxLienHandling;
  setTaxLienHandling: (data: Partial<TaxLienHandling>) => void;

  judgmentHandling: JudgmentHandling;
  setJudgmentHandling: (data: Partial<JudgmentHandling>) => void;

  // ⭐ RESET
  resetStore: () => void;
};

/* ---------------- INITIAL STATE ---------------- */

const initialS5State: {
  activeBankruptcyHandling: ActiveBankruptcyHandling;
  bankruptcyWaitingValidation: BankruptcyWaitingValidation;
  mortgageDerogatoryEventHandling: MortgageDerogatoryEventHandling;
  taxLienHandling: TaxLienHandling;
  judgmentHandling: JudgmentHandling;
} = {
  activeBankruptcyHandling: {
    hasActiveBankruptcy: null,
    bankruptcyType: null,
    cases: [],
    selectedCase: { caseNumber: "", bankruptcyDate: "" },
    supportingDocument: null,
    escalatedToManagement: false,
  },

  bankruptcyWaitingValidation: {
    hasInactiveBankruptcy: null,
    bankruptcyType: null,
    caseNumber: "",
    dischargedDate: "",
    waitingPeriod4Years: null,
    waitingPeriod2Years: null,
    lenderRequirement: null,
    bankruptcyDocumentAvailable: null,
    extenuatingDocuments: null,
    dismissedOrDischarged: null,
    escalatedToManagement: false,
  },

  mortgageDerogatoryEventHandling: {
    derogatoryTypes: [],
    accounts: [],
    selectedAccount: { creditorName: "", accountNumber: "" },

    foreclosureDocsAvailable: null,
    foreclosureDocTypes: [],
    trusteesDeedChecklist: [],
    propertyProfileChecklist: [],
    foreclosureWaitingPeriod: null,

    preForeclosureDocsAvailable: null,
    preForeclosureDocTypes: [],
    shortSaleChecklist: [],
    settlementChecklist: [],
    propertyProfileChecklistB: [],
    preForeclosureWaitingPeriod: null,

    chargeOffDocsAvailable: null,
    chargeOffDocTypes: [],
    cancellationChecklist: [],
    lenderLetterChecklist: [],
    chargeOffWaitingPeriod: null,

    escalatedToManagement: false,
  },

  taxLienHandling: {
    taxLienDetected: null,
    lienStatus: [],
    releasedCaseNumber: "",
    releasedCreditorName: "",
    releasedDate: "",
    payoffInFileAvailable: null,
    releaseDateBeforeAppDate: null,
    taxLienSourceDocsProvided: null,
    taxLienSourceDocTypes: [],
    bankStatementChecklist2: [],
    cancelledCheckChecklist2: [],
    giftLetterChecklist2: [],
    taxLienAdditionalDocsProvided: null,
    additionalDocTypes: [],
    creditorLetterChecklist: [],
    bankStatementChecklist3: [],
    cancelledCheckChecklist3: [],
    giftLetterChecklist3: [],
    losUpdatedForTaxLien: null,
    payoffInFile: null,
    payoffChecklist: [],
    selectedTaxLienAccount: { creditorName: "", caseNumber: "" },
  },

  judgmentHandling: {
    judgmentTypes: [],
    selectedAccount: { creditorName: "", accountNumber: "" },
    judgmentStatus: [],
    releasedCreditorName: "",
    releasedCaseNumber: "",
    releasedDate: "",
    judgmentDocsAvailable: null,
    judgmentDocTypes: [],
    bankStatementChecklist: [],
    checkChecklist: [],
    giftLetterChecklist: [],
    judgmentSourceDocsProvided: null,
    judgmentAdditionalDocsProvided: null,
    creditorLetterChecklist3: [],
    creditorLetterChecklist: [],
    bankStatementChecklist3: [],
    checkChecklist3: [],
    giftLetterChecklist3: [],
    losUpdatedForJudgment: null,
    payoffAvailable: null,
    payoffChecklist: [],
    judgmentDocTypes3: [],
    escalatedToManagement: false,
    releaseDateBeforeAppDate: null,
  },
};

/* ---------------- STORE ---------------- */

export const useS5Store = create<S5Store>()(
  persist(
    (set) => ({
      ...initialS5State,

      setActiveBankruptcyHandling: (data) =>
        set((s) => ({
          activeBankruptcyHandling: {
            ...s.activeBankruptcyHandling,
            ...data,
          },
        })),

      setBankruptcyWaitingValidation: (data) =>
        set((s) => ({
          bankruptcyWaitingValidation: {
            ...s.bankruptcyWaitingValidation,
            ...data,
          },
        })),

      setMortgageDerogatoryEventHandling: (data) =>
        set((s) => ({
          mortgageDerogatoryEventHandling: {
            ...s.mortgageDerogatoryEventHandling,
            ...data,
          },
        })),

      setTaxLienHandling: (data) =>
        set((s) => ({
          taxLienHandling: { ...s.taxLienHandling, ...data },
        })),

      setJudgmentHandling: (data) =>
        set((s) => ({
          judgmentHandling: { ...s.judgmentHandling, ...data },
        })),

      // ⭐ RESET
      resetStore: () => {
        set({ ...initialS5State });
        localStorage.removeItem("s5-store");
      },
    }),
    { name: "s5-store" },
  ),
);
