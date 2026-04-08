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
    null
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
