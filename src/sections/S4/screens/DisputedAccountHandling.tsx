import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import PromptRadio from "../../../components/PromptRadio";
import { FileCheck, FileWarning, FileSearch } from "lucide-react";
import PopUp from "../../../components/PopUp";
import EditableCondition from "../../../components/EditableCondition";
import DynamicChecklist from "../../../components/DynamicChecklist";

const DisputedAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { disputedHandling, setDisputedHandling } = useS4Store();
  const [accountRows, setAccountRows] = useState([
    {
      accountName: "",
      accountNumber: "",
    },
  ]);

  const {
    hasDispute,
    ausEligible,
    disputeDueToAccount,
    accounts,
    supplementAvailable,
    checklist = [],
    disputedCondition,
    otherChecklist = [],
  } = disputedHandling;

  const [showPopup, setShowPopup] = useState(false);

  const checklistItems = [
    "Credit supplement reflects incorrect borrower name.",
    "Credit supplement reflects incorrect borrower SSN",
    "Credit supplements reflect an incorrect date of birth.",
    "Credit supplement reflect the tradeline still in dispute and not resolved.",
    "Credit supplement reflect additional tradeline which was not reported on original credit report and after including the payment in DTI ratios will exceed the 50%",
    "Credit supplement is not the latest but reflects dispute has been removed. Updated credit supplement is required.",
  ];

  const setOtherChecklist = (
    updater: string[] | ((prev: string[]) => string[]),
  ) => {
    const next =
      typeof updater === "function" ? updater(otherChecklist) : updater;
    setDisputedHandling({ otherChecklist: next });
  };

  /* ---------- BRANCH VISIBILITY ---------- */

  const showPrompt2 = hasDispute === "Yes";
  const showPrompt3 = showPrompt2 && ausEligible === "No";
  const showPrompt3a = showPrompt3 && disputeDueToAccount === "Yes";
  const showPrompt3b = showPrompt3a && supplementAvailable === "Yes";

  /* ---------- POPUP SAVE ---------- */

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
    setAccountRows([
      ...accountRows,
      {
        accountName: "",
        accountNumber: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = accountRows.filter((_, i) => i !== index);

    setAccountRows(updated);
  };

  const handleAccountSave = () => {
    const hasEmpty = accountRows.some(
      (acc) => !acc.accountName || !acc.accountNumber,
    );

    if (hasEmpty) {
      return toast.error("Please fill all account details.");
    }

    const formattedAccounts = accountRows.map((acc) => ({
      accountName: acc.accountName,
      accountNumber: acc.accountNumber,
    }));

    setDisputedHandling({
      accounts: formattedAccounts,
    });

    setShowPopup(false);
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = useCallback(() => {
    if (!hasDispute) return toast.error("Please answer the first prompt.");

    if (hasDispute === "No") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!ausEligible) return toast.error("Please confirm AUS recommendation.");

    if (ausEligible === "Yes") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!disputeDueToAccount)
      return toast.error("Please review DU/LPA recommendation.");

    if (disputeDueToAccount === "No") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!accounts?.length)
      return toast.error("Please update disputed account details.");

    if (!supplementAvailable)
      return toast.error("Please confirm credit supplement availability.");

    navigate("/s4/excluded-tradeline");
  }, [
    hasDispute,
    ausEligible,
    disputeDueToAccount,
    supplementAvailable,
    accounts,
    navigate,
  ]);

  /* ---------- REGISTER FLOW ---------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/collection-account"),
    });
  }, [handleContinue, navigate, registerActions]);

  /* ---------- CHECKLIST HANDLER ---------- */

  const toggleChecklist = (item: string) => {
    const updated = checklist.includes(item)
      ? checklist.filter((i: string) => i !== item)
      : [...checklist, item];

    setDisputedHandling({ checklist: updated });
  };

  const accountText =
    accounts
      ?.map((acc) => `${acc.accountName}#${acc.accountNumber}`)
      .join(", ") || "";

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Disputed Account Handling
          </h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Review disputed accounts and determine whether they impact the AUS
          recommendation or require underwriting conditions.
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any active disputed account?"
            value={hasDispute}
            options={["Yes", "No"]}
            onChange={(v) => setDisputedHandling({ hasDispute: v })}
          />
        </div>

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Does AUS give Approve/Eligible or Accept/Eligible?"
              value={ausEligible}
              options={["Yes", "No"]}
              onChange={(v) => setDisputedHandling({ ausEligible: v })}
            />
          </div>
        )}

        {showPrompt3 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Review DU/LPA and check if ineligible/refer recommendations are due to disputed accounts?"
              value={disputeDueToAccount}
              options={["Yes", "No"]}
              onChange={(v) => {
                setDisputedHandling({ disputeDueToAccount: v });
                if (v === "Yes") setShowPopup(true);
              }}
            />
          </div>
        )}

        <PopUp
          open={showPopup}
          title="Update Disputed Account"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Save"
          onClose={() => setShowPopup(false)}
          onConfirm={handleAccountSave}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Disputed Accounts
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
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">
                        Account Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter account name"
                        value={row.accountName}
                        onChange={(e) => {
                          handleRowChange(
                            index,
                            "accountName",
                            e.target.value.replace(/[^A-Za-z\s]/g, ""),
                          );
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">
                        Account Number
                      </label>

                      <input
                        type="text"
                        placeholder="Enter account number"
                        value={row.accountNumber}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "accountNumber",
                            e.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopUp>

        {showPrompt3a && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Has borrower provided updated credit supplement removing dispute?"
              value={supplementAvailable}
              options={["Yes", "No"]}
              onChange={(v) => setDisputedHandling({ supplementAvailable: v })}
            />

            {supplementAvailable === "No" && (
              <EditableCondition
                type="condition"
                value={
                  disputedCondition ||
                  `Credit report reflects disputed account(s): ${accountText} and DU/LPA does not give ‘Approve/Eligible’/‘Accept/Eligible’ recommendation because of the disputed account hence, need to confirm if borrower is responsible for the accounts or if the account information is accurate or complete. Supporting documentation might be needed based on the explanation received.`
                }
                onChange={(value) =>
                  setDisputedHandling({
                    disputedCondition: value,
                  })
                }
              />
            )}
          </div>
        )}

        {showPrompt3b && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <FileSearch className="w-4 h-4" />
              Credit Supplement Validation
            </div>

            <div className="space-y-4"> 
              <DynamicChecklist
                items={checklistItems}
                selectedItems={checklist}
                customItems={otherChecklist}
                onToggle={toggleChecklist}
                onCustomChange={setOtherChecklist}
              />

              {/* Preview condition */}
              {(checklist?.length > 0 ||
                otherChecklist.some((o) => o.trim())) && (
                <EditableCondition
                  type="condition"
                  value={(() => {
                    const allItems = [
                      ...(checklist ?? []),
                      ...otherChecklist.filter((o) => o.trim()),
                    ];

                    const lettered = allItems
                      .map(
                        (item, i) => `${String.fromCharCode(97 + i)}) ${item}`,
                      )
                      .join("\n");

                    return `Credit report reflects disputed account(s): ${accountText} and DU/LPA does not give 'Approve/Eligible'/'Accept/Eligible' recommendation because of the disputed account and credit supplement reflects below issues:\n\n${lettered}\n\nUpdated credit supplement is required.`;
                  })()}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputedAccountHandling;
