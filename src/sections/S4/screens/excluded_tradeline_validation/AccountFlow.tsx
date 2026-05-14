import PromptRadio from "../../../../components/PromptRadio";
import EditableCondition from "../../../../components/EditableCondition";
import { useS4Store } from "../../../../store/useS4Store";
import DynamicChecklist from "../../../../components/DynamicChecklist";

type FlowStep = {
  id: string;
  type: "radio" | "checkbox" | "document-checklist" | "alert" | "select";
  label: string | ((state: ExcludedTradelineValidation) => string);
  storeKey?: keyof ExcludedTradelineValidation;
  options?: CheckboxOption[];
  variant?: "error" | "success" | "info" | "alert";
  condition?: (state: ExcludedTradelineValidation) => boolean;
  docsStoreKey?: keyof ExcludedTradelineValidation;
  checklistStoreKey?: keyof ExcludedTradelineValidation;
  documents?: DocumentItem[];
  conditionBranch?: string;
};

type CheckboxOption =
  | string
  | {
      label: string;
      storeKey: keyof ExcludedTradelineValidation;
      accountStoreKey: keyof ExcludedTradelineValidation;
    };

type DocumentItem = {
  label: string;
  value: string;
  checklist: string[];
};

type Account = {
  type: string;
  creditorName: string;
  accountNumber: string;
};

type ExcludedTradelineValidation = {
  excludedFromVOL: string | null;
  accountTypes: string[];
  accounts: Account[];

  installmentLessThan10Payments: string | null;
  installmentSupportingDocs: string | null;

  installmentReason: string[];
  installmentDocuments: string[];

  installmentChecklist: Record<string, boolean>;
  customChecklistItems?: Record<string, string[]>;
  selectedCustomChecklist?: Record<string, string[]>;

  selectedInstallmentAccount?: string;

  conditionMessages: Record<string, string>;

  [key: string]:
    | string
    | string[]
    | boolean
    | null
    | Account[]
    | Record<string, string>
    | Record<string, boolean>
    | Record<string, string[]>
    | undefined;
};

type Props = {
  flow: FlowStep[];
  onContinue?: () => void;
};

const variantToType = {
  error: "condition",
  success: "success",
  info: "info",
  alert: "alert",
} as const;

const AccountFlow = ({ flow, onContinue }: Props) => {
  const { excludedTradelineValidation, setExcludedTradelineValidation } =
    useS4Store();

  const state = excludedTradelineValidation as ExcludedTradelineValidation;

  const resolveLabel = (
    label: string | ((s: ExcludedTradelineValidation) => string),
  ) => {
    return typeof label === "function" ? label(state) : label;
  };

  const isRichOptions = (
    options: CheckboxOption[],
  ): options is Exclude<CheckboxOption, string>[] => {
    return options.length > 0 && typeof options[0] === "object";
  };

  const getSelectedAccount = () => {
    const selectedEntry = Object.entries(state).find(
      ([key, value]) =>
        key.startsWith("selected") &&
        key.endsWith("Account") &&
        typeof value === "string" &&
        value,
    );

    return selectedEntry?.[1] || "[[Account Name_Number]]";
  };

  /* ---------------- CONTINUE HANDLER ---------------- */

  const handleContinue = (step: FlowStep) => {
    const checklistObj =
      (step.checklistStoreKey
        ? (state[step.checklistStoreKey] as Record<string, boolean>)
        : {}) || {};

    const selectedDocs =
      (step.docsStoreKey ? (state[step.docsStoreKey] as string[]) : []) || [];

    const selectedAccount = getSelectedAccount();

    const selectedChecklistKeys = Object.entries(checklistObj)
      .filter(([, value]) => value)
      .map(([key]) => key);

    const hasDiscrepancy = selectedChecklistKeys.length > 0;

    if (hasDiscrepancy && step.documents && step.conditionBranch) {
      const checklistLabels: string[] = [];
      const customChecklist = state.customChecklistItems || {};

      step.documents.forEach((doc) => {
        doc.checklist.forEach((item, idx) => {
          const key = `${doc.value}_${idx}`;

          if (checklistObj[key]) {
            checklistLabels.push(item);
          }
        });
      });

      const docText = step.documents
        .filter((doc) => selectedDocs.includes(doc.value))
        .map((doc) => doc.label)
        .join(" / ");

      const customChecklistPoints = Object.values(customChecklist)
        .flat()
        .filter((item) => item.trim());

      const allChecklistPoints = [...checklistLabels, ...customChecklistPoints];

      const checklistPoints = allChecklistPoints
        .map((item, index) => {
          const letter = String.fromCharCode(97 + index);

          return `${letter}) ${item}`;
        })
        .join("\n");

      const conditionMessage = `${selectedAccount} is an installment account and excluded in VOL. However, ${docText} received in file has below concerns:\n\n${checklistPoints}`;

      setExcludedTradelineValidation({
        conditionMessages: {
          ...(state.conditionMessages || {}),
          [`branch${step.conditionBranch}`]: conditionMessage,
        },
        [`conditionTriggered_branch${step.conditionBranch}`]: true,
      });
    }

    onContinue?.();
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {flow.map((step) => {
        if (step.condition && !step.condition(state)) {
          return null;
        }

        return (
          <div
            key={step.id}
            className="border rounded-xl p-6 bg-gray-50 space-y-6"
          >
            {/* RADIO */}
            {step.type === "radio" && step.storeKey && step.options && (
              <PromptRadio
                label={resolveLabel(step.label)}
                value={(state[step.storeKey] as string | null) || null}
                options={step.options as string[]}
                onChange={(v) => {
                  setExcludedTradelineValidation({
                    [step.storeKey as string]: v,
                  });
                }}
              />
            )}

            {/* RICH CHECKBOX */}
            {step.type === "checkbox" &&
              step.options &&
              isRichOptions(step.options) && (
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    {resolveLabel(step.label)}
                  </p>

                  {step.options.map((opt) => {
                    const isChecked = Boolean(state[opt.storeKey]);

                    return (
                      <div key={String(opt.storeKey)} className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setExcludedTradelineValidation({
                                [opt.storeKey]: e.target.checked,

                                ...(!e.target.checked && {
                                  [opt.accountStoreKey]: "",
                                }),
                              })
                            }
                            className="w-4 h-4 rounded"
                          />

                          {opt.label}
                        </label>

                        {isChecked && (
                          <div className="ml-6">
                            <label className="text-xs text-gray-500 mb-1 block">
                              Select account
                            </label>

                            <select
                              className="w-full border rounded-md p-2 text-sm"
                              value={
                                (state[opt.accountStoreKey] as string) || ""
                              }
                              onChange={(e) =>
                                setExcludedTradelineValidation({
                                  [opt.accountStoreKey]: e.target.value,
                                })
                              }
                            >
                              <option value="">Select account</option>

                              {state.accounts?.map((acc, i) => (
                                <option
                                  key={i}
                                  value={`${acc.creditorName}#${acc.accountNumber}`}
                                >
                                  {acc.creditorName} - {acc.accountNumber}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            {/* DOCUMENT CHECKLIST */}
            {step.type === "document-checklist" &&
              step.documents &&
              step.docsStoreKey &&
              step.checklistStoreKey && (
                <div className="space-y-6">
                  <p className="text-sm font-medium">
                    {resolveLabel(step.label)}
                  </p>

                  {step.documents.map((doc) => {
                    const selectedDocs =
                      (state[step.docsStoreKey!] as string[]) || [];

                    const isDocSelected = selectedDocs.includes(doc.value);

                    const checklist =
                      (state[step.checklistStoreKey!] as Record<
                        string,
                        boolean
                      >) || {};

                    return (
                      <div key={doc.value} className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isDocSelected}
                            onChange={(e) => {
                              const docsKey = step.docsStoreKey as string;

                              const updated = e.target.checked
                                ? [...selectedDocs, doc.value]
                                : selectedDocs.filter((d) => d !== doc.value);

                              setExcludedTradelineValidation({
                                [docsKey]: updated,
                              });
                            }}
                            className="w-4 h-4 rounded"
                          />

                          {doc.label}
                        </label>

                        {isDocSelected && (
                          <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
                            <DynamicChecklist
                              items={doc.checklist}
                              selectedItems={Object.entries(checklist)
                                .filter(([, v]) => v)
                                .map(([k]) => k)}
                              customItems={
                                state.customChecklistItems?.[doc.value] || []
                              }
                              onToggle={(item) => {
                                const checklistKey =
                                  step.checklistStoreKey as string;

                                setExcludedTradelineValidation({
                                  [checklistKey]: {
                                    ...checklist,
                                    [item]: !checklist[item],
                                  },
                                });
                              }}
                              onCustomChange={(valueOrFn) => {
                                const prev =
                                  state.customChecklistItems?.[doc.value] || [];

                                const updated =
                                  typeof valueOrFn === "function"
                                    ? valueOrFn(prev)
                                    : valueOrFn;

                                setExcludedTradelineValidation({
                                  customChecklistItems: {
                                    ...(state.customChecklistItems || {}),
                                    [doc.value]: updated,
                                  },
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={() => handleContinue(step)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Continue
                  </button>

                  {step.conditionBranch &&
                    state[
                      `conditionTriggered_branch${step.conditionBranch}`
                    ] && (
                      <div className="space-y-3">
                        <EditableCondition
                          type="condition"
                          value={
                            state.conditionMessages?.[
                              `branch${step.conditionBranch}`
                            ] ||
                            `Condition required for Branch ${step.conditionBranch}`
                          }
                          onChange={(v) =>
                            setExcludedTradelineValidation({
                              conditionMessages: {
                                ...(state.conditionMessages || {}),
                                [`branch${step.conditionBranch}`]: v,
                              },
                            })
                          }
                        />

                        <select
                          className="w-full border rounded-md p-2 text-sm"
                          value={
                            (state[
                              `conditionAccount_branch${step.conditionBranch}`
                            ] as string) || ""
                          }
                          onChange={(e) =>
                            setExcludedTradelineValidation({
                              [`conditionAccount_branch${step.conditionBranch}`]:
                                e.target.value,
                            })
                          }
                        >
                          <option value="">Select account</option>

                          {state.accounts?.map((acc, i) => (
                            <option
                              key={i}
                              value={`${acc.creditorName}#${acc.accountNumber}`}
                            >
                              {acc.creditorName} - {acc.accountNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                </div>
              )}

            {/* ALERT */}
            {step.type === "alert" && (
              <EditableCondition
                type={
                  variantToType[step.variant as keyof typeof variantToType] ??
                  "info"
                }
                value={resolveLabel(step.label)}
              />
            )}

            {/* SELECT */}
            {step.type === "select" && step.storeKey && (
              <div>
                <label className="text-sm font-medium">
                  {resolveLabel(step.label)}
                </label>

                <select
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                  value={(state[step.storeKey] as string) || ""}
                  onChange={(e) =>
                    setExcludedTradelineValidation({
                      [step.storeKey as string]: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>

                  {state.accounts?.map((acc, i) => (
                    <option
                      key={i}
                      value={`${acc.creditorName}#${acc.accountNumber}`}
                    >
                      {acc.creditorName} - {acc.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AccountFlow;
