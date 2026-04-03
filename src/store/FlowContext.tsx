import { createContext, useContext, useState, useCallback } from "react";

type FlowActions = {
  onContinue: () => void;
  onBack: () => void;
  onSave: () => void;
};

type FlowContextType = {
  actions: FlowActions;
  registerActions: (actions: Partial<FlowActions>) => void;
  clearActions: () => void;
};

const defaultActions: FlowActions = {
  onContinue: () => {},
  onBack: () => {},
  onSave: () => {},
};

const FlowContext = createContext<FlowContextType | null>(null);

export const FlowProvider = ({ children }: { children: React.ReactNode }) => {
  const [actions, setActions] = useState<FlowActions>(defaultActions);

  const registerActions = useCallback((newActions: Partial<FlowActions>) => {
    setActions((prev) => ({ ...prev, ...newActions }));
  }, []);

  const clearActions = useCallback(() => {
    setActions(defaultActions);
  }, []);

  return (
    <FlowContext.Provider value={{ actions, registerActions, clearActions }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = () => {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlowContext must be used within FlowProvider");
  return ctx;
};
