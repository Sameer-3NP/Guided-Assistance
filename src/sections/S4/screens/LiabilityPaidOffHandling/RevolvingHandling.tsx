import PromptRadio from "../../../../components/PromptRadio";
import { useS4Store } from "../../../../store/useS4Store";
import EditableCondition from "../../../../components/EditableCondition";
import DynamicChecklist from "../../../../components/DynamicChecklist";

const RevolvingHandling = () => {
  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useS4Store();

  const revolvingChecklistItems = [
    "Credit card statements are received for different borrowers.",
    "Credit card statement received reflects different account number and name.",
  ];

  const {
    accounts = [],
    supportingDocument,
    latestCreditReport,
    conditionMsg,
    checklist = [],
    otherChecklist = [],
    selectedAccount,
  } = liabilityPaidOffHandling;

  const accountText = (acc: typeof selectedAccount) =>
    acc?.creditorName && acc?.accountNumber
      ? `${acc.creditorName}_${acc.accountNumber}`
      : "[Account Name_Number]";

  // All selected: static checked + non-empty custom items
  const allSelectedItems = [
    ...checklist,
    ...otherChecklist.filter((i) => i.trim()),
  ];

  const hasDiscrepancies = allSelectedItems.length > 0;

  const setOtherChecklist = (
    updater: string[] | ((prev: string[]) => string[]),
  ) => {
    const next =
      typeof updater === "function" ? updater(otherChecklist) : updater;
    setLiabilityPaidOffHandling({ otherChecklist: next });
  };

  const toggleChecklist = (item: string) => {
    const updated = checklist.includes(item)
      ? checklist.filter((i: string) => i !== item)
      : [...checklist, item];
    setLiabilityPaidOffHandling({ checklist: updated });
  };

  return (
    <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
      {/* PROMPT 2a */}
      <PromptRadio
        label="Do we have any supporting documents for paying off the debt at closing?"
        value={supportingDocument}
        options={["Yes", "No"]}
        onChange={(v) =>
          setLiabilityPaidOffHandling({
            supportingDocument: v,
            latestCreditReport: null,
            checklist: [],
            otherChecklist: [],
            selectedAccount: null,
          })
        }
      />

      {/* ACCOUNT SELECT */}
      {supportingDocument && (
        <div>
          <label className="text-sm font-medium text-gray-700">
            Select account number or name
          </label>
          <select
            className="border rounded-md p-2 text-sm w-full mt-1 bg-white"
            value={selectedAccount?.accountNumber ?? ""}
            onChange={(e) =>
              setLiabilityPaidOffHandling({
                selectedAccount:
                  accounts.find((a) => a.accountNumber === e.target.value) ??
                  null,
              })
            }
          >
            <option value="">Select account</option>
            {accounts.map((a, i) => (
              <option key={i} value={a.accountNumber}>
                {a.creditorName} - {a.accountNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* IF NO → CONDITION 1 */}
      {supportingDocument === "No" && (
        <EditableCondition
          type="condition"
          value={
            conditionMsg ||
            `Tradeline ${accountText(selectedAccount)} is a revolving account and getting paid off at closing. The latest credit card statement is not available. Provide updated credit card statement for ${accountText(selectedAccount)}.`
          }
          onChange={(v) => setLiabilityPaidOffHandling({ conditionMsg: v })}
        />
      )}

      {/* PROMPT 2b */}
      {supportingDocument === "Yes" && (
        <PromptRadio
          label="Do we have the latest credit card statement?"
          options={["Yes", "No"]}
          value={latestCreditReport}
          onChange={(v) =>
            setLiabilityPaidOffHandling({
              latestCreditReport: v,
              checklist: [],
              otherChecklist: [],
            })
          }
        />
      )}

      {/* IF 2b = NO → CONDITION 1 */}
      {latestCreditReport === "No" && (
        <EditableCondition
          type="condition"
          value={
            conditionMsg ||
            `Tradeline ${accountText(selectedAccount)} is a revolving account and latest credit card statement is missing. Provide updated statement for ${accountText(selectedAccount)}.`
          }
          onChange={(v) => setLiabilityPaidOffHandling({ conditionMsg: v })}
        />
      )}

      {/* CHECKLIST */}
      {latestCreditReport === "Yes" && (
        <DynamicChecklist
          items={revolvingChecklistItems}
          selectedItems={checklist}
          customItems={otherChecklist}
          onToggle={toggleChecklist}
          onCustomChange={setOtherChecklist}
        />
      )}

      {/* CONDITION 2 — any static checked or non-empty custom item */}
      {latestCreditReport === "Yes" && hasDiscrepancies && (
        <EditableCondition
          type="condition"
          value={`Tradeline ${accountText(selectedAccount)} is revolving account. Latest credit card statement is available but reflects discrepancies:\n\n${allSelectedItems
            .map((d, i) => `${String.fromCharCode(97 + i)}) ${d}`)
            .join(
              "\n",
            )}\n\nProvide updated credit card statement for validation.`}
          onChange={(v) => setLiabilityPaidOffHandling({ conditionMsg: v })}
        />
      )}
    </div>
  );
};

export default RevolvingHandling;
