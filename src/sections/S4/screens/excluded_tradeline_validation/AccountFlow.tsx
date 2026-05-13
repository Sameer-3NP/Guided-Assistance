import PromptRadio from "../../../../components/PromptRadio";
import EditableCondition from "../../../../components/EditableCondition";
import { useS4Store } from "../../../../store/useS4Store";

const variantToType = {
  error: "condition",
  success: "success",
  info: "info",
  alert: "alert",
} as const;

const AccountFlow = ({ flow, onContinue }) => {
  const { excludedTradelineValidation, setExcludedTradelineValidation } =
    useS4Store();

  const resolveLabel = (label: string | ((s: any) => string), state: any) =>
    typeof label === "function" ? label(state) : label;

  const isRichOptions = (options: any[]) =>
    options.length > 0 && typeof options[0] === "object";

  /* ---------------- CONTINUE HANDLER ---------------- */

  const handleContinue = (step: any) => {
    const checklistObj =
      excludedTradelineValidation[step.checklistStoreKey] || {};

    const selectedDocs = excludedTradelineValidation[step.docsStoreKey] || [];

    const selectedInstallmentAccount =
      excludedTradelineValidation.selectedInstallmentAccount;

    // ✅ get checked checklist keys
    const selectedChecklistKeys = Object.entries(checklistObj)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const hasDiscrepancy = selectedChecklistKeys.length > 0;

    if (hasDiscrepancy) {
      const checklistLabels: string[] = [];

      // ✅ map keys → actual checklist labels
      step.documents.forEach((doc) => {
        doc.checklist.forEach((item: string, idx: number) => {
          const key = `${doc.value}_${idx}`;
          if (checklistObj[key]) {
            checklistLabels.push(item);
          }
        });
      });

      // ✅ map doc values → labels
      const docText = step.documents
        .filter((doc) => selectedDocs.includes(doc.value))
        .map((doc) => doc.label)
        .join(" / ");

      // ✅ checklist formatting (a, b, c...)
      const checklistPoints = checklistLabels
        .map((item, index) => {
          const letter = String.fromCharCode(97 + index);
          return `${letter}) ${item}`;
        })
        .join("\n");

      // ✅ final message
      const conditionMessage = `${
        selectedInstallmentAccount || "[[Account Name_Number]]"
      } is an installment account and excluded in VOL However, ${docText} received in file has below concerns:\n\n${checklistPoints}`;

      setExcludedTradelineValidation({
        conditionMessages: {
          ...(excludedTradelineValidation.conditionMessages || {}),
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
        if (step.condition && !step.condition(excludedTradelineValidation))
          return null;

        return (
          <div
            key={step.id}
            className="border rounded-xl p-6 bg-gray-50 space-y-6"
          >
            {/* RADIO */}
            {step.type === "radio" && (
              <PromptRadio
                label={resolveLabel(step.label, excludedTradelineValidation)}
                value={excludedTradelineValidation[step.storeKey]}
                options={step.options}
                onChange={(v) =>
                  setExcludedTradelineValidation({ [step.storeKey]: v })
                }
              />
            )}

            {/* RICH CHECKBOX (2c) */}
            {step.type === "checkbox" && isRichOptions(step.options) && (
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  {resolveLabel(step.label, excludedTradelineValidation)}
                </p>

                {step.options.map((opt) => {
                  const isChecked = !!excludedTradelineValidation[opt.storeKey];

                  return (
                    <div key={opt.storeKey} className="space-y-2">
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
                            Select account number/name
                          </label>
                          <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={
                              excludedTradelineValidation[
                                opt.accountStoreKey
                              ] || ""
                            }
                            onChange={(e) =>
                              setExcludedTradelineValidation({
                                [opt.accountStoreKey]: e.target.value,
                              })
                            }
                          >
                            <option value="">Select account</option>
                            {excludedTradelineValidation.accounts?.map(
                              (acc, i) => (
                                <option
                                  key={i}
                                  value={`${acc.creditorName}-${acc.accountNumber}`}
                                >
                                  {acc.creditorName} - {acc.accountNumber}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* DOCUMENT CHECKLIST */}
            {step.type === "document-checklist" && (
              <div className="space-y-6">
                <p className="text-sm font-medium">{step.label}</p>

                {step.documents.map((doc) => {
                  const selectedDocs =
                    excludedTradelineValidation[step.docsStoreKey] || [];
                  const isDocSelected = selectedDocs.includes(doc.value);

                  const checklist =
                    excludedTradelineValidation[step.checklistStoreKey] || {};

                  return (
                    <div key={doc.value} className="space-y-3">
                      {/* Document checkbox */}
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDocSelected}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...selectedDocs, doc.value]
                              : selectedDocs.filter((d) => d !== doc.value);

                            setExcludedTradelineValidation({
                              [step.docsStoreKey]: updated,
                            });
                          }}
                          className="w-4 h-4 rounded"
                        />
                        {doc.label}
                      </label>

                      {/* Checklist */}
                      {isDocSelected && (
                        <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
                          {doc.checklist.map((item, idx) => {
                            const itemKey = `${doc.value}_${idx}`;
                            const isChecked = !!checklist[itemKey];

                            return (
                              <label
                                key={itemKey}
                                className="flex items-start gap-2 text-sm cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    setExcludedTradelineValidation({
                                      [step.checklistStoreKey]: {
                                        ...checklist,
                                        [itemKey]: e.target.checked,
                                      },
                                    })
                                  }
                                  className="w-4 h-4 mt-0.5"
                                />
                                <span>{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* CONTINUE */}
                <button
                  onClick={() => handleContinue(step)}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer shadow-2xl"
                >
                  Continue
                </button>

                {/* CONDITION */}
                {excludedTradelineValidation[
                  `conditionTriggered_branch${step.conditionBranch}`
                ] && (
                  <div className="space-y-3">
                    <EditableCondition
                      type="condition"
                      value={
                        excludedTradelineValidation.conditionMessages?.[
                          `branch${step.conditionBranch}`
                        ] ||
                        `Condition required for Branch ${step.conditionBranch}`
                      }
                      onChange={(v) =>
                        setExcludedTradelineValidation({
                          conditionMessages: {
                            ...(excludedTradelineValidation.conditionMessages ||
                              {}),
                            [`branch${step.conditionBranch}`]: v,
                          },
                        })
                      }
                    />

                    <select
                      className="w-full border rounded-md p-2 text-sm"
                      value={
                        excludedTradelineValidation[
                          `conditionAccount_branch${step.conditionBranch}`
                        ] || ""
                      }
                      onChange={(e) =>
                        setExcludedTradelineValidation({
                          [`conditionAccount_branch${step.conditionBranch}`]:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">Select account</option>
                      {excludedTradelineValidation.accounts?.map((acc, i) => (
                        <option
                          key={i}
                          value={`${acc.creditorName}-${acc.accountNumber}`}
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
                value={resolveLabel(step.label, excludedTradelineValidation)}
              />
            )}

            {/* SELECT */}
            {step.type === "select" && (
              <div>
                <label className="text-sm font-medium">
                  {resolveLabel(step.label, excludedTradelineValidation)}
                </label>
                <select
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                  value={excludedTradelineValidation[step.storeKey] || ""}
                  onChange={(e) =>
                    setExcludedTradelineValidation({
                      [step.storeKey]: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  {excludedTradelineValidation.accounts?.map((acc, i) => (
                    <option
                      key={i}
                      value={`${acc.creditorName}-${acc.accountNumber}`}
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
