import PromptRadio from "../../../../components/PromptRadio";
import { useS4Store } from "../../../../store/useS4Store";
import EditableCondition from "../../../../components/EditableCondition";
import DynamicChecklist from "../../../../components/DynamicChecklist";

const INSTALLMENT_PAYOFF_ITEMS = [
  "Payoff reflects incorrect account number and name",
  "Payoff reflects the incorrect borrower's name.",
  "Payoff provided is not latest and per diem interest is not provided.",
  "Payoff provided has already expired.",
];

const ACCOUNT_STATEMENT_ITEMS = [
  "The account statement reflects incorrect loan number and borrower name.",
  "Account statement reflects the incorrect borrower's name",
  "Account statement provided does not reflect the exact payoff amount",
  "The account statement available is not the latest statement.",
];

const InstallmentHandling = () => {
  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useS4Store();

  const {
    accounts = [],
    supportingDocument,
    documentType = [],
    checklist = [],
    otherChecklist = [],
    selectedAccount,
    noDocAccount,
    condition2Account,
  } = liabilityPaidOffHandling;

  const accountText = (acc: typeof selectedAccount) =>
    acc?.creditorName && acc?.accountNumber
      ? `${acc.creditorName}_${acc.accountNumber}`
      : "[Account Name_Number]";

  // All discrepancies: static checked + non-empty custom items
  const allDiscrepancies = [
    ...checklist,
    ...otherChecklist.filter((i) => i.trim()),
  ];

  const hasDiscrepancies = allDiscrepancies.length > 0;

  // Static items shown depend on which doc types are selected
  const activeStaticItems = [
    ...(documentType.includes("Installment payoff")
      ? INSTALLMENT_PAYOFF_ITEMS
      : []),
    ...(documentType.includes("Account statement")
      ? ACCOUNT_STATEMENT_ITEMS
      : []),
  ];

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
      {/* PROMPT 3a */}
      <PromptRadio
        label="Do we have any supporting documents for paying off the debt at closing?"
        options={["Yes", "No"]}
        value={supportingDocument}
        onChange={(v) =>
          setLiabilityPaidOffHandling({
            supportingDocument: v,
            documentType: [],
            checklist: [],
            otherChecklist: [],
            selectedAccount: null,
            noDocAccount: null,
            condition2Account: null,
          })
        }
      />

      {/* YES → account dropdown */}
      {supportingDocument === "Yes" && (
        <div>
          <label className="text-sm font-medium text-gray-700">
            Select account number / name for which supporting document is
            available
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

      {/* NO → account dropdown + Condition 1 */}
      {supportingDocument === "No" && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Select account number / name for which supporting document is not
              available
            </label>
            <select
              className="border rounded-md p-2 text-sm w-full mt-1 bg-white"
              value={noDocAccount?.accountNumber ?? ""}
              onChange={(e) =>
                setLiabilityPaidOffHandling({
                  noDocAccount:
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

          <EditableCondition
            type="condition"
            value={`Tradeline ${accountText(noDocAccount)} is an installment account getting paid off at closing. Supporting document for payoff is not available. Provide updated payoff/account statement for ${accountText(noDocAccount)}.`}
          />
        </>
      )}

      {/* PROMPT 3b — document type */}
      {supportingDocument === "Yes" && (
        <div className="border rounded-xl p-5 bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Please select the available document received?
          </p>
          <div className="flex flex-col gap-2">
            {["Installment payoff", "Account statement"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={documentType.includes(option)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...documentType, option]
                      : documentType.filter((d: string) => d !== option);
                    setLiabilityPaidOffHandling({
                      documentType: updated,
                      checklist: [],
                      otherChecklist: [],
                    });
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* CHECKLIST — rendered when any doc type selected */}
      {supportingDocument === "Yes" && activeStaticItems.length > 0 && (
        <DynamicChecklist
          items={activeStaticItems}
          selectedItems={checklist}
          customItems={otherChecklist}
          onToggle={toggleChecklist}
          onCustomChange={setOtherChecklist}
        />
      )}

      {/* CONDITION 2 — any discrepancy checked or non-empty custom */}
      {supportingDocument === "Yes" && hasDiscrepancies && (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Condition 2 — Select account
            </p>
            <select
              className="border rounded-md p-2 text-sm w-full bg-white"
              value={condition2Account?.accountNumber ?? ""}
              onChange={(e) =>
                setLiabilityPaidOffHandling({
                  condition2Account:
                    accounts.find((a) => a.accountNumber === e.target.value) ??
                    null,
                })
              }
            >
              <option value="">
                Select account for which condition is required
              </option>
              {accounts.map((a, i) => (
                <option key={i} value={a.accountNumber}>
                  {a.creditorName} - {a.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="px-5 py-4">
            <EditableCondition
              type="condition"
              value={`Tradeline ${accountText(condition2Account)} is an installment account. Supporting document received reflects below discrepancies:\n\n${allDiscrepancies
                .map((d, i) => `${String.fromCharCode(97 + i)}) ${d}`)
                .join(
                  "\n",
                )}\n\nProvide updated supporting documentation for validation.`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentHandling;
