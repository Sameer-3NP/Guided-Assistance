import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";

import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const DelinquencyLateHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { delinquencyLateHandling, setDelinquencyLateHandling } = useS4Store();

  const {
    latePaymentLast12Months,
    lateAccountTypes,
    lenderRequireExplanation,
    conditionMsg,
  } = delinquencyLateHandling;

  const [showPopup, setShowPopup] = useState(false);

  const [accountRows, setAccountRows] = useState([
    {
      accountName: "",
      accountNumber: "",
    },
  ]);

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

    setDelinquencyLateHandling({
      accounts: validRows,
    });

    setShowPopup(false);
  };

  const accountText = delinquencyLateHandling.accounts?.length
    ? delinquencyLateHandling.accounts
        .map((a) => `${a.accountName}_${a.accountNumber}`)
        .join(", ")
    : "[Account Name_Number]";
  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!latePaymentLast12Months)
      return toast.error("Please answer the first prompt.");

    if (latePaymentLast12Months === "No") {
      navigate("/s4/authorized-user-account"); // screen 4.9
      return;
    }

    if (lateAccountTypes.length === 0)
      return toast.error("Please select account type.");

    if (lateAccountTypes.includes("Mortgage account")) {
      if (!lenderRequireExplanation)
        return toast.error("Please answer prompt 2a.");
    }

    navigate("/s4/authorized-user-account");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/payment-history-recency"),
    });
  }, [latePaymentLast12Months, lateAccountTypes, lenderRequireExplanation]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Delinquency & 30/60/90 Late Handling
          </h2>
        </div>

        {/* ACCOUNT DETAILS POPUP */}

        <PopUp
          open={showPopup}
          title="Update Mortgage Accounts"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Save"
          onClose={() => setShowPopup(false)}
          onConfirm={handleAccountSave}
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
            label="Does credit report reflect any late payment of more than 30 days in the last12 months from the current date?"
            value={latePaymentLast12Months}
            options={["Yes", "No"]}
            onChange={(v) =>
              setDelinquencyLateHandling({
                latePaymentLast12Months: v,
              })
            }
          />

          {latePaymentLast12Months === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
              ✔ Proceed to next screen 4.9
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {latePaymentLast12Months === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <CheckboxGroup
              label="Does late payment reflect on Mortgage account or non-mortgage account? (select all that apply)"
              options={["Mortgage account", "Non-Mortgage account"]}
              values={lateAccountTypes}
              onChange={(v) => {
                setDelinquencyLateHandling({
                  lateAccountTypes: v,
                });

                // 👉 OPEN POPUP WHEN MORTGAGE IS SELECTED
                if (v.includes("Mortgage account")) {
                  setShowPopup(true);
                }
              }}
            />
          </div>
        )}

        {lateAccountTypes.includes("Mortgage account") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Does lender require explanation for delinquencies noted in the last 12 months?"
              value={lenderRequireExplanation}
              options={["Yes", "No"]}
              onChange={(v) =>
                setDelinquencyLateHandling({
                  lenderRequireExplanation: v,
                })
              }
            />

            {lenderRequireExplanation === "Yes" && (
              <EditableCondition
                type="condition"
                value={
                  conditionMsg ||
                  `Mortgage Lien ${accountText} has more than 30 days lates reported and explanation from borrower is required for multiple lates noted in last 12 months.`
                }
                onChange={(v) =>
                  setDelinquencyLateHandling({
                    conditionMsg: v,
                  })
                }
              />
            )}

            {lenderRequireExplanation === "No" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
                ✔ Proceed to next screen 4.9
              </div>
            )}
          </div>
        )}

        {lateAccountTypes.includes("Non-Mortgage account") && (
          <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
            ✔ Proceed to next screen 4.9
          </div>
        )}
      </div>
    </div>
  );
};

export default DelinquencyLateHandling;
