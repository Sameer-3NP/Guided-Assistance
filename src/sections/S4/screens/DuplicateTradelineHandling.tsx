import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";
import DynamicChecklist from "../../../components/DynamicChecklist";

const DuplicateTradelineHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { duplicateTradelineHandling, setDuplicateTradelineHandling } =
    useS4Store();

  const [accountRows, setAccountRows] = useState([
    {
      accountName: "",
      accountNumber: "",
    },
  ]);
  const {
    duplicateAccount,
    qualifiesWithBothAccounts,
    creditSupplementAvailable,
    supplementFailures = [],
    otherSupplementFailures = [],
  } = duplicateTradelineHandling;

  const [showPopup, setShowPopup] = useState(false);

  const setOtherSupplementFailures = (
    updater: string[] | ((prev: string[]) => string[]),
  ) => {
    const next =
      typeof updater === "function"
        ? updater(otherSupplementFailures)
        : updater;

    setDuplicateTradelineHandling({
      otherSupplementFailures: next,
    });
  };

  const handleRowChange = (
    index: number,
    field: "accountName" | "accountNumber",
    value: string,
  ) => {
    const updated = [...accountRows];
    updated[index][field] = value;
    setAccountRows(updated);
  };

  const addRow = () => {
    setAccountRows([...accountRows, { accountName: "", accountNumber: "" }]);
  };

  const removeRow = (index: number) => {
    setAccountRows(accountRows.filter((_, i) => i !== index));
  };

  /* ---------- POPUP SUBMIT ---------- */

  const handleAccountSave = () => {
    const validRows = accountRows.filter(
      (r) => r.accountName.trim() && r.accountNumber.trim(),
    );

    if (validRows.length === 0) {
      toast.error("Please add at least one account.");
      return;
    }

    setDuplicateTradelineHandling({
      accounts: validRows,
    });

    setShowPopup(false);
  };

  const accountText = duplicateTradelineHandling.accounts?.length
    ? duplicateTradelineHandling.accounts
        .map((a) => `${a.accountName}_${a.accountNumber}`)
        .join(", ")
    : "[Account Name_Number]";
  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!duplicateAccount)
      return toast.error("Please answer the first prompt.");

    if (duplicateAccount === "No") {
      navigate("/s4/past-due");
      return;
    }

    if (!qualifiesWithBothAccounts)
      return toast.error("Please answer prompt 2.");

    if (qualifiesWithBothAccounts === "Yes") {
      navigate("/s4/past-due");
      return;
    }

    if (!creditSupplementAvailable)
      return toast.error("Please answer prompt 2a.");

    if (creditSupplementAvailable === "No") {
      toast.error("Condition appears as per Branch 2");
    }

    if (supplementFailures.length > 0) {
      toast.error("Condition appears as per Branch 3");
    }

    navigate("/s4/past-due");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/authorized-user-account"),
    });
  }, [
    duplicateAccount,
    qualifiesWithBothAccounts,
    creditSupplementAvailable,
    supplementFailures,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Duplicate Tradeline Handling
          </h2>
        </div>

        {/* ACCOUNT DETAILS POPUP */}

        <PopUp
          open={showPopup}
          title="Duplicate Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSave}
          confirmText="Continue"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Mortgage Accounts
              </h3>

              <button
                type="button"
                onClick={addRow}
                className="text-blue-600 text-xs font-medium"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
              {accountRows.map((row, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Account {index + 1}
                    </h3>

                    {accountRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-500 text-xs font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Account name"
                      value={row.accountName}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "accountName",
                          e.target.value.replace(/[^A-Za-z\s]/g, ""),
                        )
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />

                    <input
                      type="text"
                      placeholder="Account number"
                      value={row.accountNumber}
                      onChange={(e) =>
                        handleRowChange(index, "accountNumber", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopUp>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any duplicate account?"
            value={duplicateAccount}
            options={["Yes", "No"]}
            onChange={(v) =>
              setDuplicateTradelineHandling({
                duplicateAccount: v,
              })
            }
          />

          {duplicateAccount === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
              ✔ Proceed to screen 4.11
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {duplicateAccount === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if borrower qualifies after including both duplicate accounts in LOS?"
              value={qualifiesWithBothAccounts}
              options={["Yes", "No"]}
              onChange={(v) => {
                setDuplicateTradelineHandling({
                  qualifiesWithBothAccounts: v,
                });
                if (v === "No") {
                  setShowPopup(true);
                }
              }}
            />

            {qualifiesWithBothAccounts === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
                ✔ Proceed to screen 4.11
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2a */}

        {qualifiesWithBothAccounts === "No" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if any credit supplement available to exclude the duplicate tradeline?"
              value={creditSupplementAvailable}
              options={["Yes", "No"]}
              onChange={(v) =>
                setDuplicateTradelineHandling({
                  creditSupplementAvailable: v,
                })
              }
            />

            {creditSupplementAvailable === "No" && (
              <EditableCondition
                type="condition"
                value={`${accountText} seem to be duplicate and to qualify the borrower ${accountText} has been excluded from DTI. Provide credit supplement to confirm that both accounts are duplicate.`}
              />
            )}
          </div>
        )}

        {/* PROMPT 2b */}

        {creditSupplementAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <DynamicChecklist
              items={[
                "Credit supplement received reflects incorrect borrower name, SSN, DOB",
                "Credit supplement provided does not verify that one of the duplicate accounts is deleted.",
                "Credit supplement reflects another tradeline which was not reported on original credit report and after including this payment, ratios will exceed 50%",
              ]}
              selectedItems={supplementFailures}
              customItems={otherSupplementFailures}
              onToggle={(item) => {
                const updated = supplementFailures.includes(item)
                  ? supplementFailures.filter((i) => i !== item)
                  : [...supplementFailures, item];

                setDuplicateTradelineHandling({
                  supplementFailures: updated,
                });
              }}
              onCustomChange={setOtherSupplementFailures}
            />

            {(supplementFailures.length > 0 ||
              otherSupplementFailures.some((o) => o.trim())) && (
              <div className="border rounded-xl bg-white shadow-sm space-y-4 overflow-hidden">
                <EditableCondition
                  type="condition"
                  value={(() => {
                    const allItems = [
                      ...(supplementFailures ?? []),
                      ...otherSupplementFailures.filter((o) => o.trim()),
                    ];

                    const lettered = allItems
                      .map(
                        (item, i) => `${String.fromCharCode(97 + i)}) ${item}`,
                      )
                      .join("\n");

                    return `${accountText} seem to be duplicate and to qualify the borrower ${accountText} has been excluded from DTI. Credit supplement received in file has below issues:\n\n${lettered}`;
                  })()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateTradelineHandling;
