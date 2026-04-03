// import { createContext, useContext, useState, useEffect } from "react";
// import type { CreditReport } from "../types/credit";
// import type { InventoryItem } from "../types/inventory";

// type Store = {
//   s0: InventoryItem | null;
//   setS0: (data: InventoryItem) => void;

//   s1: CreditReport[];
//   setS1: (data: CreditReport[]) => void;

//   activeCreditReport: string | null;
//   setActiveCreditReport: (label: string) => void;

//   creditValidityStep: "pullCheck" | "expirationCheck";
//   setCreditValidityStep: (step: "pullCheck" | "expirationCheck") => void;

//   pullType: string | null;
//   setPullType: (type: string | null) => void;

//   biMergeAccepted: string | null;
//   setBiMergeAccepted: (value: string | null) => void;

//   sectionStatus: Record<string, string>;
//   setSectionStatus: (
//     status:
//       | Record<string, string>
//       | ((prev: Record<string, string>) => Record<string, string>),
//   ) => void;
// };

// const SectionContext = createContext<Store | null>(null);

// export const SectionProvider = ({ children }: any) => {
//   const [s0, setS0] = useState<InventoryItem | null>(null);
//   const [s1, setS1] = useState<CreditReport[]>(() => {
//     const saved = localStorage.getItem("S1_data");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [activeCreditReport, setActiveCreditReport] = useState<string | null>(
//     null,
//   );
//   const [creditValidityStep, setCreditValidityStep] = useState<
//     "pullCheck" | "expirationCheck"
//   >("pullCheck");

//   const [pullType, setPullType] = useState<string | null>(null);

//   const [biMergeAccepted, setBiMergeAccepted] = useState<string | null>(() => {
//     return localStorage.getItem("biMergeAccepted");
//   });

//   const [sectionStatus, setSectionStatus] = useState<Record<string, string>>(
//     () => {
//       const saved = localStorage.getItem("sectionStatus");
//       if (saved) return JSON.parse(saved);
//       return {
//         S0: "active",
//         S1: "locked",
//         S2: "locked",
//         S3: "locked",
//         S4: "locked",
//         S5: "locked",
//       };
//     },
//   );

//   useEffect(() => {
//     localStorage.setItem("sectionStatus", JSON.stringify(sectionStatus));
//   }, [sectionStatus]);

//   return (
//     <SectionContext.Provider
//       value={{
//         s0,
//         setS0,
//         s1,
//         setS1,
//         activeCreditReport,
//         setActiveCreditReport,
//         sectionStatus,
//         setSectionStatus,
//         creditValidityStep,
//         setCreditValidityStep,
//         pullType,
//         setPullType,
//         biMergeAccepted,
//         setBiMergeAccepted,
//       }}
//     >
//       {children}
//     </SectionContext.Provider>
//   );
// };

// export const useSectionStore = () => {
//   const ctx = useContext(SectionContext);

//   if (!ctx) {
//     throw new Error("SectionStore not available");
//   }

//   return ctx;
// };
// import { createContext, useContext, useState, useEffect } from "react";
// import type { CreditReport } from "../types/credit";
// import type { InventoryItem } from "../types/inventory";

// type Store = {
//   s0: InventoryItem | null;
//   setS0: (data: InventoryItem) => void;

//   s1: CreditReport[];
//   setS1: (data: CreditReport[]) => void;

//   activeCreditReport: string | null;
//   setActiveCreditReport: (label: string) => void;

//   creditValidityStep: "pullCheck" | "expirationCheck";
//   setCreditValidityStep: (step: "pullCheck" | "expirationCheck") => void;

//   pullType: string | null;
//   setPullType: (type: string | null) => void;

//   biMergeAccepted: string | null;
//   setBiMergeAccepted: (value: string | null) => void;

//   sourceRequestIntegrity: {
//     agencyName: string | null;
//     agencyAddress: string | null;
//     agencyPhone: string | null;
//     lenderName: string | null;
//     requestedRole: string;
//     lastNameMatch: string | null;
//     loanMatch: string | null;
//   };
//   setSourceRequestIntegrity: (
//     data: Partial<Store["sourceRequestIntegrity"]>,
//   ) => void;

//   sectionStatus: Record<string, string>;
//   setSectionStatus: (
//     status:
//       | Record<string, string>
//       | ((prev: Record<string, string>) => Record<string, string>),
//   ) => void;
// };

// const SectionContext = createContext<Store | null>(null);

// export const SectionProvider = ({ children }: any) => {
//   // 🔹 Load entire store from localStorage
//   const savedState = localStorage.getItem("sectionStore");

//   const initialState = savedState
//     ? JSON.parse(savedState)
//     : {
//         s0: null,
//         s1: [],
//         activeCreditReport: null,
//         creditValidityStep: "pullCheck",
//         pullType: null,
//         biMergeAccepted: null,
//         sourceRequestIntegrity: {
//           agencyName: null,
//           agencyAddress: null,
//           agencyPhone: null,
//           lenderName: null,
//           requestedRole: "",
//           lastNameMatch: null,
//           loanMatch: null,
//         },
//         sectionStatus: {
//           S0: "active",
//           S1: "locked",
//           S2: "locked",
//           S3: "locked",
//           S4: "locked",
//           S5: "locked",
//         },
//       };

//   const [s0, setS0] = useState<InventoryItem | null>(initialState.s0);
//   const [s1, setS1] = useState<CreditReport[]>(initialState.s1);
//   const [activeCreditReport, setActiveCreditReport] = useState<string | null>(
//     initialState.activeCreditReport,
//   );
//   const [creditValidityStep, setCreditValidityStep] = useState<
//     "pullCheck" | "expirationCheck"
//   >(initialState.creditValidityStep);
//   const [pullType, setPullType] = useState<string | null>(
//     initialState.pullType,
//   );
//   const [biMergeAccepted, setBiMergeAccepted] = useState<string | null>(
//     initialState.biMergeAccepted,
//   );

//   const [sourceRequestIntegrity, setSourceRequestIntegrityState] = useState(
//     initialState.sourceRequestIntegrity,
//   );

//   const setSourceRequestIntegrity = (
//     data: Partial<Store["sourceRequestIntegrity"]>,
//   ) => {
//     setSourceRequestIntegrityState((prev) => ({
//       ...prev,
//       ...data,
//     }));
//   };

//   const [sectionStatus, setSectionStatus] = useState<Record<string, string>>(
//     initialState.sectionStatus,
//   );

//   // 🔹 Persist entire store automatically
//   useEffect(() => {
//     const storeData = {
//       s0,
//       s1,
//       activeCreditReport,
//       creditValidityStep,
//       pullType,
//       biMergeAccepted,
//       sourceRequestIntegrity,
//       sectionStatus,
//     };

//     localStorage.setItem("sectionStore", JSON.stringify(storeData));
//   }, [
//     s0,
//     s1,
//     activeCreditReport,
//     creditValidityStep,
//     pullType,
//     biMergeAccepted,
//     sourceRequestIntegrity,
//     sectionStatus,
//   ]);

//   return (
//     <SectionContext.Provider
//       value={{
//         s0,
//         setS0,
//         s1,
//         setS1,
//         activeCreditReport,
//         setActiveCreditReport,
//         creditValidityStep,
//         setCreditValidityStep,
//         pullType,
//         setPullType,
//         biMergeAccepted,
//         setBiMergeAccepted,
//         sourceRequestIntegrity,
//         setSourceRequestIntegrity,
//         sectionStatus,
//         setSectionStatus,
//       }}
//     >
//       {children}
//     </SectionContext.Provider>
//   );
// };

// export const useSectionStore = () => {
//   const ctx = useContext(SectionContext);

//   if (!ctx) {
//     throw new Error("SectionStore not available");
//   }

//   return ctx;
// };

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

  const [sourceRequestIntegrity, setSourceRequestIntegrityState] = useState({
    agencyName: null,
    agencyAddress: null,
    agencyPhone: null,
    lenderName: null,
    requestedRole: "",
    lastNameMatch: null,
    loanMatch: null,
  });

  const setSourceRequestIntegrity = (
    data: Partial<Store["sourceRequestIntegrity"]>,
  ) => {
    setSourceRequestIntegrityState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [systemAlignmentReview, setSystemAlignmentReviewState] = useState({
    ausDate: "",
    losAlign: null,
    ausAlign: null,
    matchingReport: null,
  });

  const setSystemAlignmentReview = (
    data: Partial<Store["systemAlignmentReview"]>,
  ) => {
    setSystemAlignmentReviewState((prev) => ({
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
