// store/useS4Store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------------- TYPES ---------------- */

type TradelineAlignment = {
  losGreater: string | null;
  creditGreater: string | null;
  fieldsMatch: string | null;
  branch1: string;
  updateLos1: string;
  updateLos2: string;
};

type MissingTradelinePayment = {
  allPayments: string | null;
  accountType: string[];
  loanType: string | null;
  creditorName: string | null;
  accountNumber: string | null;
  revolving: string;
  fnma: string;
  fhlmc: string;
  installmentCondition: string;

  accounts: {
    creditorName: string;
    accountNumber: string;
  }[];

  selectedAccount: string;
};

type CollectionHandling = {
  hasCollection: string | null;
  collectionType: string | null;
  cumulativeBalance: string | null;
  occupancy: string | null;
  unit: string | null;

  conditionMsg: string;

  accounts: {
    accountName: string;
    accountNumber: string;
    individualBalance: string;
  }[];
};

type DisputedHandling = {
  hasDispute: string | null;
  ausEligible: string | null;
  disputeDueToAccount: string | null;
  supplementAvailable: string | null;
  checklist: string[];
  otherChecklist: string[]; // ← add this
  accounts: {
    accountName: string;
    accountNumber: string;
  }[];

  disputedCondition: string;
  disputedChecklistCondition: string;
};

type UtilityTelecomAccount = {
  hasUtilityAccount: string | null;
  paymentIncludedInDTI: string | null;
};

type PaymentHistoryRecencyValidation = {
  hasDLA: string | null;
  lienTypes: string[];
  accounts: {
    type: string | null;
    accountName: string | null;
    accountNumber: string | null;
  }[];
  mortgagePropertyType: string[];
  subjectProperty: {
    coversClosingMinus1Month: string | null;
    hasSupportingDocs: string | null;
    documents: string[];
    discrepancies: string[];
    conditionText: string;
  };
  reoProperty: {
    dlaMoreThan45Days: string | null;
  };
  nonMortgageLien: {
    dlaMoreThan90Days: string | null;
  };

  otherChecklist: string[];
};

type DelinquencyLateHandling = {
  accounts: {
    accountName: string;
    accountNumber: string;
  }[];
  latePaymentLast12Months: string | null;
  lateAccountTypes: string[];
  lenderRequireExplanation: string | null;
  conditionMsg: string;
};

type AuthorizedUserAccountHandling = {
  creditorName: string;
  accountNumber: string;
  loanType: string | null;
  duAuthorizedAccount: string | null;
  duBorrowerQualify: string | null;
  duClauses: string;
  lpaAuthorizedAccount: string | null;
  lpaBorrowerQualify: string | null;
  lpaClauses: string;
};

type DuplicateTradelineHandling = {
  accounts: {
    accountName: string;
    accountNumber: string;
  }[];
  duplicateAccount: string | null;
  qualifiesWithBothAccounts: string | null;
  creditSupplementAvailable: string | null;
  supplementFailures: string[];
  otherSupplementFailures: string[];
  supplementCondition: string;
};

type PastDueAccountHandling = {
  accounts: {
    accountName: string;
    accountNumber: string;
  }[];
  pastDueAccount: string | null;
  supportingDocument: string | null;
  documentType: string[];
  discrepancies: string[];
};

type LiabilityPaidOffHandling = {
  debtPaidOff: string | null;
  accountTypes: string[];
  supportingDocument: string | null;
  documentType: string[];
  discrepancies: string[];
  latestCreditReport: string | null;
  conditionMsg: string;
  revolvingAccountStatus: string;
  checklist: string[];
  otherChecklist: string[];
  accounts: {
    creditorName: string;
    accountNumber: string;
  }[];

  // Account selected when supportingDocument = "Yes" (InstallmentHandling & RevolvingHandling)
  selectedAccount: {
    creditorName: string;
    accountNumber: string;
  } | null;

  // Account selected when supportingDocument = "No" → drives Condition 1 (InstallmentHandling)
  noDocAccount: {
    creditorName: string;
    accountNumber: string;
  } | null;

  // Account selected for Condition 2 dropdown (InstallmentHandling)
  condition2Account: {
    creditorName: string;
    accountNumber: string;
  } | null;
};

type ChildSupportHandling = {
  hasChildSupportTradeline: string | null;
  dlaLessThan7Years: string | null;
  supportingDocument: string | null;
  documentType: string[];
  lenderRequirement: string | null;

  accounts: {
    creditorName: string;
    accountNumber: string;
    balance: string;
  }[];

  selectedAccount?: {
    creditorName: string;
    accountNumber: string;
    balance: string;
  };

  // ✅ FIX: separate checklist control
  checklist: string[]; // fixed checklist
  customAgreementChecklist: string[];
  customDivorceChecklist: string[];
  conditionMsg?: string | null;
  agreementDiscrepancies: string[];
  divorceDiscrepancies: string[];
};

type ChecklistItems = {
  [checklistLabel: string]: boolean;
};

type ChecklistDocuments = {
  [documentType: string]: ChecklistItems;
};

export type ExcludedTradelineValidation = {
  // ── existing fields ──────────────────────────────────────
  excludedFromVOL: string | null;
  accountTypes: string[];
  accounts: {
    type: string;
    creditorName: string;
    accountNumber: string;
  }[];
  installmentLessThan10Payments: string | null;
  installmentSupportingDocs: string | null;
  installmentReason: string[];
  installmentDocuments: string[];
  installmentChecklist: Record<string, boolean>;

  // ── 2b ───────────────────────────────────────────────────
  installmentLessThan10?: string;
  selectedInstallmentAccount?: string;
  selectedInstallmentAccountNo?: string;

  // ── 2c ───────────────────────────────────────────────────
  installmentReasonBusiness?: boolean;
  installmentReasonBorrower?: boolean;
  installmentReasonGift?: boolean;
  installmentAccountBusiness?: string;
  installmentAccountBorrower?: string;
  installmentAccountGift?: string;

  // ── 2d / 2e / 2f docs ────────────────────────────────────
  installmentDocs2d?: string[];
  installmentDocs2e?: string[];
  installmentDocs2f?: string[];

  // ── 2d / 2e / 2f checklists ──────────────────────────────
  installmentChecklist2d?: ChecklistDocuments;
  installmentChecklist2e?: ChecklistDocuments;
  installmentChecklist2f?: ChecklistDocuments;

  // Revolving
  revolvingChecklist3c?: ChecklistDocuments;
  revolvingChecklist3d?: ChecklistDocuments;

  // Mortgage
  mortgageChecklist4c?: ChecklistDocuments;
  mortgageChecklist4d?: ChecklistDocuments;
  mortgageChecklist4e?: ChecklistDocuments;
  mortgageChecklist4f?: ChecklistDocuments;

  // HELOC
  helocChecklist5c?: ChecklistDocuments;
  helocChecklist5d?: ChecklistDocuments;
  helocChecklist5e?: ChecklistDocuments;
  helocChecklist5f?: ChecklistDocuments;
  helocChecklist5g?: ChecklistDocuments;

  // Lease
  leaseChecklist6c?: ChecklistDocuments;

  // Charge
  chargeChecklist7c?: ChecklistDocuments;
  chargeChecklist7d?: ChecklistDocuments;
  chargeChecklist7e?: ChecklistDocuments;

  // Taxes
  taxChecklist8c?: ChecklistDocuments;
  taxChecklist8d?: ChecklistDocuments;

  // Tax Lien
  taxLienChecklist9c?: ChecklistDocuments;
  taxLienChecklist9d?: ChecklistDocuments;

  // ── conditions ───────────────────────────────────────────
  conditionMessages?: Record<string, string>;
  conditionTriggered_branch2?: boolean;
  conditionTriggered_branch3?: boolean;
  conditionTriggered_branch4?: boolean;

  conditionAccount_branch2?: string;
  conditionAccount_branch3?: string;
  conditionAccount_branch4?: string;

  dynamicChecklist: string[]; // tracks which preset items are checked
  dynamicCustomChecklist: string[]; // tracks custom typed items

  // ── index signature (required for dynamic storeKey access)
  [key: string]: unknown;
};

type S4Store = {
  tradelineAlignment: TradelineAlignment;
  setTradelineAlignment: (data: Partial<TradelineAlignment>) => void;

  missingTradelinePayment: MissingTradelinePayment;
  setMissingTradelinePayment: (data: Partial<MissingTradelinePayment>) => void;

  collectionHandling: CollectionHandling;
  setCollectionHandling: (data: Partial<CollectionHandling>) => void;

  disputedHandling: DisputedHandling;
  setDisputedHandling: (data: Partial<DisputedHandling>) => void;

  utilityTelecomAccount: UtilityTelecomAccount;
  setUtilityTelecomAccount: (data: Partial<UtilityTelecomAccount>) => void;

  paymentHistoryRecencyValidation: PaymentHistoryRecencyValidation;
  setPaymentHistoryRecencyValidation: (
    data: Partial<PaymentHistoryRecencyValidation>,
  ) => void;

  delinquencyLateHandling: DelinquencyLateHandling;
  setDelinquencyLateHandling: (data: Partial<DelinquencyLateHandling>) => void;

  authorizedUserAccountHandling: AuthorizedUserAccountHandling;
  setAuthorizedUserAccountHandling: (
    data: Partial<AuthorizedUserAccountHandling>,
  ) => void;

  duplicateTradelineHandling: DuplicateTradelineHandling;
  setDuplicateTradelineHandling: (
    data: Partial<DuplicateTradelineHandling>,
  ) => void;

  pastDueAccountHandling: PastDueAccountHandling;
  setPastDueAccountHandling: (data: Partial<PastDueAccountHandling>) => void;

  liabilityPaidOffHandling: LiabilityPaidOffHandling;
  setLiabilityPaidOffHandling: (
    data: Partial<LiabilityPaidOffHandling>,
  ) => void;

  childSupportHandling: ChildSupportHandling;
  setChildSupportHandling: (data: Partial<ChildSupportHandling>) => void;

  excludedTradelineValidation: ExcludedTradelineValidation;
  setExcludedTradelineValidation: (
    data: Partial<ExcludedTradelineValidation>,
  ) => void;

  resetStore: () => void;
};

/* ---------------- INITIAL STATE ---------------- */

const initialS4State = {
  tradelineAlignment: {
    losGreater: null,
    creditGreater: null,
    fieldsMatch: null,
    branch1: "",
    updateLos1: "",
    updateLos2: "",
  },

  missingTradelinePayment: {
    allPayments: null,
    accountType: [],
    loanType: null,
    creditorName: null,
    accountNumber: null,
    revolving: "",
    fnma: "",
    fhlmc: "",
    installmentCondition: "",

    accounts: [],
    selectedAccount: "",
  },

  collectionHandling: {
    hasCollection: null,
    collectionType: null,
    cumulativeBalance: null,
    occupancy: null,
    unit: null,

    conditionMsg: "",

    accounts: [],
  },

  disputedHandling: {
    hasDispute: null,
    ausEligible: null,
    disputeDueToAccount: null,
    supplementAvailable: null,
    checklist: [] as string[],
    otherChecklist: [] as string[],
    accounts: [],

    disputedCondition: "",
    disputedChecklistCondition: "",
  },

  utilityTelecomAccount: {
    hasUtilityAccount: null,
    paymentIncludedInDTI: null,
  },

  paymentHistoryRecencyValidation: {
    hasDLA: null,
    lienTypes: [] as string[],
    accounts: [{ type: null, accountName: null, accountNumber: null }],
    mortgagePropertyType: [] as string[],
    subjectProperty: {
      coversClosingMinus1Month: null,
      hasSupportingDocs: null,
      documents: [] as string[],
      discrepancies: [] as string[],
      conditionText: "",
    },
    reoProperty: { dlaMoreThan45Days: null },
    nonMortgageLien: { dlaMoreThan90Days: null },
    otherChecklist: [] as string[],
  },

  delinquencyLateHandling: {
    accounts: [],
    latePaymentLast12Months: null,
    lateAccountTypes: [] as string[],
    lenderRequireExplanation: null,
    conditionMsg: "",
  },

  authorizedUserAccountHandling: {
    creditorName: "",
    accountNumber: "",
    loanType: null,
    duAuthorizedAccount: null,
    duBorrowerQualify: null,
    duClauses: "",
    lpaAuthorizedAccount: null,
    lpaBorrowerQualify: null,
    lpaClauses: "",
  },

  duplicateTradelineHandling: {
    accounts: [],
    duplicateAccount: null,
    qualifiesWithBothAccounts: null,
    creditSupplementAvailable: null,
    supplementFailures: [] as string[],
    otherSupplementFailures: [] as string[],
    supplementCondition: "",
  },

  pastDueAccountHandling: {
    accounts: [],
    pastDueAccount: null,
    supportingDocument: null,
    documentType: [] as string[],
    discrepancies: [] as string[],
  },

  liabilityPaidOffHandling: {
    debtPaidOff: null,
    accountTypes: [] as string[],
    supportingDocument: null,
    documentType: [] as string[],
    discrepancies: [] as string[],
    latestCreditReport: null,
    revolvingAccountStatus: "",
    checklist: [] as string[],
    otherChecklist: [] as string[],
    conditionMsg: "",
    accounts: [] as { creditorName: string; accountNumber: string }[],
    selectedAccount: { creditorName: "", accountNumber: "" },
    noDocAccount: { creditorName: "", accountNumber: "" },
    condition2Account: { creditorName: "", accountNumber: "" },
  },

  childSupportHandling: {
    hasChildSupportTradeline: null,
    dlaLessThan7Years: null,
    supportingDocument: null,
    documentType: [] as string[],
    agreementDiscrepancies: [] as string[],
    divorceDiscrepancies: [] as string[],
    lenderRequirement: null,
    accounts: [],
    selectedAccount: undefined,
    checklist: [] as string[],
    customAgreementChecklist: [] as string[],
    customDivorceChecklist: [] as string[],
    conditionMsg: "",
  },

  excludedTradelineValidation: {
    excludedFromVOL: null,
    accountTypes: [] as string[],
    accounts: [],
    installmentLessThan10Payments: null,
    installmentSupportingDocs: null,
    installmentReason: [] as string[],
    installmentDocuments: [] as string[],
    installmentChecklist: {},
    conditionMessages: {},
    dynamicChecklist: [],
    dynamicCustomChecklist: [],
  },
};

/* ---------------- STORE ---------------- */

export const useS4Store = create<S4Store>()(
  persist(
    (set) => ({
      ...initialS4State,

      setTradelineAlignment: (data) =>
        set((s) => ({
          tradelineAlignment: { ...s.tradelineAlignment, ...data },
        })),

      setMissingTradelinePayment: (data) =>
        set((s) => ({
          missingTradelinePayment: {
            ...s.missingTradelinePayment,
            ...data,
          },
        })),

      setCollectionHandling: (data) =>
        set((s) => ({
          collectionHandling: { ...s.collectionHandling, ...data },
        })),

      setDisputedHandling: (data) =>
        set((s) => ({
          disputedHandling: { ...s.disputedHandling, ...data },
        })),

      setUtilityTelecomAccount: (data) =>
        set((s) => ({
          utilityTelecomAccount: {
            ...s.utilityTelecomAccount,
            ...data,
          },
        })),

      setPaymentHistoryRecencyValidation: (data) =>
        set((s) => ({
          paymentHistoryRecencyValidation: {
            ...s.paymentHistoryRecencyValidation,
            ...data,
          },
        })),

      setDelinquencyLateHandling: (data) =>
        set((s) => ({
          delinquencyLateHandling: {
            ...s.delinquencyLateHandling,
            ...data,
          },
        })),

      setAuthorizedUserAccountHandling: (data) =>
        set((s) => ({
          authorizedUserAccountHandling: {
            ...s.authorizedUserAccountHandling,
            ...data,
          },
        })),

      setDuplicateTradelineHandling: (data) =>
        set((s) => ({
          duplicateTradelineHandling: {
            ...s.duplicateTradelineHandling,
            ...data,
          },
        })),

      setPastDueAccountHandling: (data) =>
        set((s) => ({
          pastDueAccountHandling: {
            ...s.pastDueAccountHandling,
            ...data,
          },
        })),

      setLiabilityPaidOffHandling: (data) =>
        set((s) => ({
          liabilityPaidOffHandling: {
            ...s.liabilityPaidOffHandling,
            ...data,
          },
        })),

      setChildSupportHandling: (data) =>
        set((s) => ({
          childSupportHandling: {
            ...s.childSupportHandling,
            ...data,
          },
        })),

      setExcludedTradelineValidation: (data) =>
        set((s) => ({
          excludedTradelineValidation: {
            ...s.excludedTradelineValidation,
            ...data,
          },
        })),

      // ⭐ RESET
      resetStore: () => {
        set({ ...initialS4State });
        localStorage.removeItem("s4-store");
      },
    }),
    { name: "s4-store" },
  ),
);
