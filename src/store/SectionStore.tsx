import { createContext, useContext, useState } from "react";
import type { CreditReport } from "../types/credit";
import type { InventoryItem } from "../types/inventory";

type Store = {
  s0: InventoryItem | null;
  setS0: (data: InventoryItem) => void;

  s1: CreditReport[];
  setS1: (data: CreditReport[]) => void;

  activeCreditReport: string | null;
  setActiveCreditReport: (label: string) => void;

  creditValidityStep: "pullCheck" | "expirationCheck";
  setCreditValidityStep: (step: "pullCheck" | "expirationCheck") => void;

  pullType: string | null;
  setPullType: (type: string | null) => void;

  biMergeAccepted: string | null;
  setBiMergeAccepted: (value: string | null) => void;

  sourceRequestIntegrity: {
    agencyName: string | null;
    agencyAddress: string | null;
    agencyPhone: string | null;
    lenderName: string | null;
    requestedRole: string;
    lastNameMatch: string | null;
    loanMatch: string | null;
  };

  setSourceRequestIntegrity: (
    data: Partial<Store["sourceRequestIntegrity"]>,
  ) => void;

  systemAlignmentReview: {
    ausDate: string;
    losAlign: string | null;
    ausAlign: string | null;
    matchingReport: string | null;
  };

  setSystemAlignmentReview: (
    data: Partial<Store["systemAlignmentReview"]>,
  ) => void;

  coreIdentity: {
    firstLastName: string | null;
    middleName: string | null;
    suffix: string | null;
    ssn: string | null;
    dob: string | null;
    akaSsn: string | null;
  };

  setCoreIdentity: (data: Partial<Store["coreIdentity"]>) => void;

  coreIdentitySummary: {
    conditions: string[];
    alerts: string[];
  };

  setCoreIdentitySummary: (data: Store["coreIdentitySummary"]) => void;

  currentAddress: {
    addressMatch: string | null;
  };

  setCurrentAddress: (data: Partial<Store["currentAddress"]>) => void;

  currentAddressSummary: {
    conditions: string[];
  };

  setCurrentAddressSummary: (data: Store["currentAddressSummary"]) => void;

  previousAddress: {
    hasPreviousAddress: string | null;
    addressMatch: string | null;
    requireUpdatedReport: string | null;
  };

  setPreviousAddress: (data: Partial<Store["previousAddress"]>) => void;

  section2Summary: {
    raisedConditions: string[];
  };

  setSection2Summary: (data: Partial<Store["section2Summary"]>) => void;

  scoreAvailability: {
    freeze: string | null;
    twoBureaus: string | null;
    oneScore: string | null;

    ausRequiresNonTrad: string | null;
    validatedByDu: string | null;
    nonTradAvailable: string | null;

    documents: string[];
    discrepancies: string[];
  };

  setScoreAvailability: (data: Partial<Store["scoreAvailability"]>) => void;

  qualifyingScore: {
    borrowerCount: string | null;

    b1ScoresCount: string | null;
    b2ScoresCount: string | null;

    b1Scores: {
      sc1: string;
      sc2: string;
      sc3: string;
    };

    b2Scores: {
      sc1: string;
      sc2: string;
      sc3: string;
    };

    b1QualifyingScore: number | null;
    b2QualifyingScore: number | null;
  };

  setQualifyingScore: (data: Partial<Store["qualifyingScore"]>) => void;

  updateB1Scores: (data: Partial<Store["qualifyingScore"]["b1Scores"]>) => void;

  updateB2Scores: (data: Partial<Store["qualifyingScore"]["b2Scores"]>) => void;

  tradelineAlignment: {
    losGreater: string | null;
    creditGreater: string | null;
    fieldsMatch: string | null;
  };

  setTradelineAlignment: (data: Partial<Store["tradelineAlignment"]>) => void;

  missingTradelinePayment: {
    allPayments: string | null;
    accountType: string | null;
    loanType: string | null;
    creditorName: string | null;
    accountNumber: string | null;
    setCreditorName: string | null;
    setAccountNumber: string | null;
  };

  setMissingTradelinePayment: (
    data: Partial<Store["missingTradelinePayment"]>,
  ) => void;

  collectionHandling: {
    hasCollection: string | null;
    collectionType: string | null;
    individualBalance: string | null;
    cumulativeBalance: string | null;
    occupancy: string | null;
    unit: string | null;
    accountName: string | null;
    accountNumber: string | null;
  };

  setCollectionHandling: (data: Partial<Store["collectionHandling"]>) => void;

  disputedHandling: {
    hasDispute: string | null;
    ausEligible: string | null;
    disputeDueToAccount: string | null;

    accountName: string | null;
    accountNumber: string | null;

    supplementAvailable: string | null;

    checklist: string[];
  };

  setDisputedHandling: (data: Partial<Store["disputedHandling"]>) => void;

  utilityTelecomAccount: {
    hasUtilityAccount: string | null;
    paymentIncludedInDTI: string | null;
  };

  setUtilityTelecomAccount: (
    data: Partial<Store["utilityTelecomAccount"]>,
  ) => void;

  paymentHistoryRecencyValidation: {
    hasDLA: string | null;
    lienTypes: string[];

    accounts: [
      {
        type: string | null;
        accountName: string | null;
        accountNumber: string | null;
      },
    ];

    mortgagePropertyType: string[];

    subjectProperty: {
      coversClosingMinus1Month: string | null;
      hasSupportingDocs: string | null;
      documents: string[];
      discrepancies: string[];
    };

    reoProperty: {
      dlaMoreThan45Days: string | null;
    };

    nonMortgageLien: {
      dlaMoreThan90Days: string | null;
    };
  };

  setPaymentHistoryRecencyValidation: (
    data: Partial<Store["paymentHistoryRecencyValidation"]>,
  ) => void;

  delinquencyLateHandling: {
    creditorName: string;
    accountNumber: string;

    latePaymentLast12Months: string;

    lateAccountTypes: string[];

    lenderRequireExplanation: string;
  };

  setDelinquencyLateHandling: (
    data: Partial<Store["delinquencyLateHandling"]>,
  ) => void;

  authorizedUserAccountHandling: {
    creditorName: string;
    accountNumber: string;

    loanType: string; // DU | LPA

    duAuthorizedAccount: string;
    duBorrowerQualify: string;
    duClauses: string;

    lpaAuthorizedAccount: string;
    lpaBorrowerQualify: string;
    lpaClauses: string;
  };

  setAuthorizedUserAccountHandling: (
    data: Partial<Store["authorizedUserAccountHandling"]>,
  ) => void;

  duplicateTradelineHandling: {
    creditorName: string;
    accountNumber: string;

    duplicateAccount: string;

    qualifiesWithBothAccounts: string;

    creditSupplementAvailable: string;

    supplementFailures: string[];
  };

  setDuplicateTradelineHandling: (
    data: Partial<Store["duplicateTradelineHandling"]>,
  ) => void;

  pastDueAccountHandling: {
    creditorName: string;
    accountNumber: string;

    pastDueAccount: string;

    supportingDocument: string;

    documentType: string[];

    discrepancies: string[];
  };

  setPastDueAccountHandling: (
    data: Partial<Store["pastDueAccountHandling"]>,
  ) => void;

  liabilityPaidOffHandling: {
    debtPaidOff: string;
    accountTypes: string[];
    supportingDocument: string;
    documentType: string[];
    discrepancies: string[];
    accounts: {
      creditorName: string;
      accountNumber: string;
    }[];
    selectedAccount?: {
      creditorName: string;
      accountNumber: string;
    };
  };

  setLiabilityPaidOffHandling: (
    data: Partial<Store["liabilityPaidOffHandling"]>,
  ) => void;

  sectionStatus: Record<string, string>;
  setSectionStatus: (
    status:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
};

const SectionContext = createContext<Store | null>(null);

export const SectionProvider = ({ children }: any) => {
  const [s0, setS0] = useState<InventoryItem | null>(null);
  const [s1, setS1] = useState<CreditReport[]>([]);
  const [activeCreditReport, setActiveCreditReport] = useState<string | null>(
    null,
  );

  const [creditValidityStep, setCreditValidityStep] = useState<
    "pullCheck" | "expirationCheck"
  >("pullCheck");

  const [pullType, setPullType] = useState<string | null>(null);
  const [biMergeAccepted, setBiMergeAccepted] = useState<string | null>(null);

  const [sourceRequestIntegrity, setSourceRequestIntegrityState] = useState<
    Store["sourceRequestIntegrity"]
  >({
    agencyName: null,
    agencyAddress: null,
    agencyPhone: null,
    lenderName: null,
    requestedRole: "",
    lastNameMatch: null,
    loanMatch: null,
  });

  const [systemAlignmentReview, setSystemAlignmentReviewState] = useState<
    Store["systemAlignmentReview"]
  >({
    ausDate: "",
    losAlign: null,
    ausAlign: null,
    matchingReport: null,
  });

  const [coreIdentity, setCoreIdentityState] = useState<Store["coreIdentity"]>({
    firstLastName: null,
    middleName: null,
    suffix: null,
    ssn: null,
    dob: null,
    akaSsn: null,
  });

  const [currentAddress, setCurrentAddressState] = useState<
    Store["currentAddress"]
  >({
    addressMatch: null,
  });

  const [previousAddress, setPreviousAddressState] = useState<
    Store["previousAddress"]
  >({
    hasPreviousAddress: null,
    addressMatch: null,
    requireUpdatedReport: null,
  });

  const [coreIdentitySummary, setCoreIdentitySummaryState] = useState<
    Store["coreIdentitySummary"]
  >({
    conditions: [],
    alerts: [],
  });

  const [scoreAvailability, setScoreAvailabilityState] = useState<
    Store["scoreAvailability"]
  >({
    freeze: null,
    twoBureaus: null,
    oneScore: null,

    ausRequiresNonTrad: null,
    validatedByDu: null,
    nonTradAvailable: null,

    documents: [],
    discrepancies: [],
  });

  const [qualifyingScore, setQualifyingScoreState] = useState<
    Store["qualifyingScore"]
  >({
    borrowerCount: null,
    b1ScoresCount: null,
    b2ScoresCount: null,

    b1Scores: { sc1: "", sc2: "", sc3: "" },
    b2Scores: { sc1: "", sc2: "", sc3: "" },

    b1QualifyingScore: null,
    b2QualifyingScore: null,
  });

  const [tradelineAlignment, setTradelineAlignmentState] = useState<
    Store["tradelineAlignment"]
  >({
    losGreater: null,
    creditGreater: null,
    fieldsMatch: null,
  });

  const [missingTradelinePayment, setMissingTradelinePaymentState] = useState<
    Store["missingTradelinePayment"]
  >({
    allPayments: null,
    accountType: null,
    loanType: null,
    creditorName: null,
    accountNumber: null,
    setCreditorName: null,
    setAccountNumber: null,
  });

  const [collectionHandling, setCollectionHandlingState] = useState<
    Store["collectionHandling"]
  >({
    hasCollection: null,
    collectionType: null,
    individualBalance: "",
    cumulativeBalance: "",
    occupancy: null,
    unit: null,
    accountName: "",
    accountNumber: "",
  });

  const [disputedHandling, setDisputeHandlingState] = useState<
    Store["disputedHandling"]
  >({
    hasDispute: null,
    ausEligible: null,
    disputeDueToAccount: null,

    accountName: null,
    accountNumber: null,

    supplementAvailable: null,

    checklist: [],
  });

  const [utilityTelecomAccount, setUtilityTelecomAccountState] = useState<
    Store["utilityTelecomAccount"]
  >({
    hasUtilityAccount: "",
    paymentIncludedInDTI: "",
  });

  const [
    paymentHistoryRecencyValidation,
    setPaymentHistoryRecencyValidationState,
  ] = useState<Store["paymentHistoryRecencyValidation"]>({
    hasDLA: "",
    lienTypes: [],

    accounts: [
      {
        type: "",
        accountName: "",
        accountNumber: "",
      },
    ],

    mortgagePropertyType: [],

    subjectProperty: {
      coversClosingMinus1Month: "",
      hasSupportingDocs: "",
      documents: [],
      discrepancies: [],
    },

    reoProperty: {
      dlaMoreThan45Days: "",
    },

    nonMortgageLien: {
      dlaMoreThan90Days: "",
    },
  });

  const [delinquencyLateHandling, setDelinquencyLateHandlingState] = useState<
    Store["delinquencyLateHandling"]
  >({
    creditorName: "",
    accountNumber: "",
    latePaymentLast12Months: "",
    lateAccountTypes: [],
    lenderRequireExplanation: "",
  });

  const [authorizedUserAccountHandling, setAuthorizedUserAccountHandlingState] =
    useState<Store["authorizedUserAccountHandling"]>({
      creditorName: "",
      accountNumber: "",

      loanType: "", // DU | LPA

      duAuthorizedAccount: "",
      duBorrowerQualify: "",
      duClauses: "",

      lpaAuthorizedAccount: "",
      lpaBorrowerQualify: "",
      lpaClauses: "",
    });

  const [duplicateTradelineHandling, setDuplicateTradelineHandlingState] =
    useState<Store["duplicateTradelineHandling"]>({
      creditorName: "",
      accountNumber: "",

      duplicateAccount: "",

      qualifiesWithBothAccounts: "",

      creditSupplementAvailable: "",

      supplementFailures: [],
    });

  const [pastDueAccountHandling, setPastDueAccountHandlingState] = useState<
    Store["pastDueAccountHandling"]
  >({
    creditorName: "",
    accountNumber: "",

    pastDueAccount: "",

    supportingDocument: "",

    documentType: [],

    discrepancies: [],
  });

  const [liabilityPaidOffHandling, setLiabilityPaidOffHandlingState] = useState<
    Store["liabilityPaidOffHandling"]
  >({
    debtPaidOff: undefined,

    accountTypes: [],

    supportingDocument: undefined,

    documentType: [],

    discrepancies: [],

    accounts: [],

    selectedAccount: {
      creditorName: "",
      accountNumber: "",
    },
  });

  const setQualifyingScore = (
    data:
      | Partial<Store["qualifyingScore"]>
      | ((prev: Store["qualifyingScore"]) => Store["qualifyingScore"]),
  ) => {
    if (typeof data === "function") {
      setQualifyingScoreState(data);
    } else {
      setQualifyingScoreState((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

  const updateB1Scores = (
    data: Partial<Store["qualifyingScore"]["b1Scores"]>,
  ) => {
    setQualifyingScoreState((prev) => ({
      ...prev,
      b1Scores: {
        ...prev.b1Scores,
        ...data,
      },
    }));
  };

  const updateB2Scores = (
    data: Partial<Store["qualifyingScore"]["b2Scores"]>,
  ) => {
    setQualifyingScoreState((prev) => ({
      ...prev,
      b2Scores: {
        ...prev.b2Scores,
        ...data,
      },
    }));
  };

  const setSourceRequestIntegrity = (
    data: Partial<Store["sourceRequestIntegrity"]>,
  ) => {
    setSourceRequestIntegrityState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setSystemAlignmentReview = (
    data: Partial<Store["systemAlignmentReview"]>,
  ) => {
    setSystemAlignmentReviewState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setCoreIdentity = (data: Partial<Store["coreIdentity"]>) => {
    setCoreIdentityState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setCoreIdentitySummary = (data: Store["coreIdentitySummary"]) => {
    setCoreIdentitySummaryState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setCurrentAddress = (data: Partial<Store["currentAddress"]>) => {
    setCurrentAddressState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [currentAddressSummary, setCurrentAddressSummaryState] = useState({
    conditions: [],
  });

  const setCurrentAddressSummary = (data: Store["currentAddressSummary"]) => {
    setCurrentAddressSummaryState(data);
  };

  const setPreviousAddress = (data: Partial<Store["previousAddress"]>) => {
    setPreviousAddressState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [section2Summary, setSection2SummaryState] = useState<
    Store["section2Summary"]
  >({
    raisedConditions: [],
  });

  const setSection2Summary = (data: Partial<Store["section2Summary"]>) => {
    setSection2SummaryState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setScoreAvailability = (data: Partial<Store["scoreAvailability"]>) => {
    setScoreAvailabilityState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setTradelineAlignment = (
    data: Partial<Store["tradelineAlignment"]>,
  ) => {
    setTradelineAlignmentState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setMissingTradelinePayment = (
    data: Partial<Store["missingTradelinePayment"]>,
  ) => {
    setMissingTradelinePaymentState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setCollectionHandling = (
    data: Partial<Store["collectionHandling"]>,
  ) => {
    setCollectionHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setDisputedHandling = (data: Partial<Store["disputedHandling"]>) => {
    setDisputeHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setUtilityTelecomAccount = (
    data: Partial<Store["utilityTelecomAccount"]>,
  ) => {
    setUtilityTelecomAccountState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setPaymentHistoryRecencyValidation = (
    data: Partial<Store["paymentHistoryRecencyValidation"]>,
  ) => {
    setPaymentHistoryRecencyValidationState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setDelinquencyLateHandling = (
    data: Partial<Store["delinquencyLateHandling"]>,
  ) => {
    setDelinquencyLateHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setAuthorizedUserAccountHandling = (
    data: Partial<Store["authorizedUserAccountHandling"]>,
  ) => {
    setAuthorizedUserAccountHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setDuplicateTradelineHandling = (
    data: Partial<Store["duplicateTradelineHandling"]>,
  ) => {
    setDuplicateTradelineHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setPastDueAccountHandling = (
    data: Partial<Store["pastDueAccountHandling"]>,
  ) => {
    setPastDueAccountHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setLiabilityPaidOffHandling = (
    data: Partial<Store["liabilityPaidOffHandling"]>,
  ) => {
    setLiabilityPaidOffHandlingState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [sectionStatus, setSectionStatus] = useState<Record<string, string>>({
    S0: "active",
    S1: "locked",
    S2: "locked",
    S3: "locked",
    S4: "locked",
    S5: "locked",
  });

  return (
    <SectionContext.Provider
      value={{
        s0,
        setS0,
        s1,
        setS1,
        activeCreditReport,
        setActiveCreditReport,
        creditValidityStep,
        setCreditValidityStep,
        pullType,
        setPullType,
        biMergeAccepted,
        setBiMergeAccepted,
        sourceRequestIntegrity,
        setSourceRequestIntegrity,
        sectionStatus,
        setSectionStatus,
        systemAlignmentReview,
        setSystemAlignmentReview,
        coreIdentity,
        setCoreIdentity,
        coreIdentitySummary,
        setCoreIdentitySummary,
        currentAddress,
        setCurrentAddress,
        currentAddressSummary,
        setCurrentAddressSummary,
        previousAddress,
        setPreviousAddress,
        section2Summary,
        setSection2Summary,
        scoreAvailability,
        setScoreAvailability,
        qualifyingScore,
        setQualifyingScore,
        updateB1Scores,
        updateB2Scores,
        tradelineAlignment,
        setTradelineAlignment,
        missingTradelinePayment,
        setMissingTradelinePayment,
        collectionHandling,
        setCollectionHandling,
        disputedHandling,
        setDisputedHandling,
        utilityTelecomAccount,
        setUtilityTelecomAccount,
        paymentHistoryRecencyValidation,
        setPaymentHistoryRecencyValidation,
        delinquencyLateHandling,
        setDelinquencyLateHandling,
        authorizedUserAccountHandling,
        setAuthorizedUserAccountHandling,
        duplicateTradelineHandling,
        setDuplicateTradelineHandling,
        pastDueAccountHandling,
        setPastDueAccountHandling,
        liabilityPaidOffHandling,
        setLiabilityPaidOffHandling,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export const useSectionStore = () => {
  const ctx = useContext(SectionContext);

  if (!ctx) {
    throw new Error("SectionStore not available");
  }

  return ctx;
};
