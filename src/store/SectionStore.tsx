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
};

const SectionContext = createContext<Store | null>(null);

export const SectionProvider = ({ children }: any) => {
  const [s0, setS0] = useState<InventoryItem | null>(null);
  const [s1, setS1] = useState<CreditReport[]>([]);
  const [activeCreditReport, setActiveCreditReport] = useState<string | null>(
    null,
  );

  return (
    <SectionContext.Provider
      value={{
        s0,
        setS0,
        s1,
        setS1,
        activeCreditReport,
        setActiveCreditReport,
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
