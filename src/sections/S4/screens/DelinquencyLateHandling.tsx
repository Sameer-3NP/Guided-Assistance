import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const DelinquencyLateHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { delinquencyLateHandling, setDelinquencyLateHandling } =
    useSectionStore();

  const {
    creditorName,
    accountNumber,
    latePaymentLast12Months,
    lateAccountTypes,
    lenderRequireExplanation,
  } = delinquencyLateHandling;

  const [showPopup, setShowPopup] = useState(true);

  /* ---------- POPUP SUBMIT ---------- */

  const handleAccountSubmit = () => {
    if (!creditorName || !accountNumber) {
      toast.error("Please enter account details.");
      return;
    }

    setShowPopup(false);
  };

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
          title="Delinquent Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Creditor name</label>
              <input
                type="text"
                value={creditorName ?? ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setDelinquencyLateHandling({
                    creditorName: value,
                  });
                }}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="number"
                value={accountNumber ?? ""}
                onChange={(e) =>
                  setDelinquencyLateHandling({
                    accountNumber: e.target.value,
                  })
                }
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
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
              onChange={(v) =>
                setDelinquencyLateHandling({
                  lateAccountTypes: v,
                })
              }
            />

            {/* BRANCH ALERT */}

            {lateAccountTypes.includes("Mortgage account") && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                Alert appears as per Branch 1
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2a */}

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
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per branch 1
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelinquencyLateHandling;
