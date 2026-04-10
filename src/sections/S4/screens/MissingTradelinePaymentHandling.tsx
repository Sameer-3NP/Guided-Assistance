import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import PromptRadio from "../../../components/PromptRadio";

import {
  FileCheck,
  CreditCard,
  GraduationCap,
  FileWarning,
} from "lucide-react";

import PopUp from "../../../components/PopUp";

const MissingTradelinePaymentHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { missingTradelinePayment, setMissingTradelinePayment } =
    useSectionStore();

  const { allPayments, accountType, loanType, creditorName, accountNumber } =
    missingTradelinePayment;

  const [showPopup, setShowPopup] = useState(false);

  const handleInstallmentSubmit = () => {
    if (!creditorName || !accountNumber) {
      toast.error("Please fill all fields.");
      return;
    }

    toast("Condition logged for missing installment payment", { icon: "⚠️" });

    setShowPopup(false);
  };

  /* ---------- BRANCH RULES ---------- */

  const showPrompt2 = allPayments === "No";

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!allPayments) return toast.error("Please answer the first prompt.");

    if (allPayments === "Yes") {
      navigate("/s4/collection-account");
      return;
    }

    if (!accountType) return toast.error("Please select the account type.");

    if (accountType === "Installment") {
      if (!creditorName || !accountNumber)
        return toast.error("Please complete installment account details.");
    }

    if (accountType === "Student loan" && !loanType)
      return toast.error("Please select the loan type.");

    navigate("/s4/collection-account");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/tradeline-structural-alignment"),
    });
  }, [allPayments, accountType, loanType, creditorName, accountNumber]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Missing Tradeline Payment Handling
          </h2>
        </div>

        {/* INSTRUCTION */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          Verify whether all tradelines reflect a monthly payment. If missing,
          determine the account type and apply the appropriate underwriting
          rule.
        </div>

        {/* PAYMENT CHECK */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <PromptRadio
            label="Does all tradelines reflect  payment?"
            value={allPayments}
            options={["Yes", "No"]}
            onChange={(v) => setMissingTradelinePayment({ allPayments: v })}
          />

          {allPayments === "Yes" && (
            <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ All tradelines reflect payments. No action required.
            </div>
          )}
        </div>

        {/* ACCOUNT TYPE */}

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="font-semibold text-gray-800">
              Identify Tradeline Without Payment
            </div>

            <PromptRadio
              label="Which account does not have a payment?"
              value={accountType}
              options={["Revolving", "Installment", "Student loan"]}
              onChange={(v) => {
                setMissingTradelinePayment({ accountType: v });

                // if (v === "Installment") {
                //   setShowPopup(true);
                // }

                if (v === "Installment") {
                  setMissingTradelinePayment({
                    accountType: v,
                    creditorName: "",
                    accountNumber: "",
                  });

                  setShowPopup(true);
                }
              }}
            />

            {accountType === "Revolving" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                <CreditCard className="w-4 h-4" />
                Action: Consider 5% of the outstanding balance or $10, whichever
                is higher.
              </div>
            )}

            {accountType === "Installment" && (
              <PopUp
                open={showPopup}
                title="Installment Tradeline Details"
                icon={<FileWarning className="w-5 h-5 text-blue-500" />}
                onClose={() => setShowPopup(false)}
                onConfirm={handleInstallmentSubmit}
                confirmText="Submit"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Creditor Name</label>
                    <input
                      type="text"
                      placeholder="Account Name"
                      value={creditorName ?? ""}
                      name="fullname"
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          "",
                        );
                        setMissingTradelinePayment({ creditorName: value });
                      }}
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Account Number
                    </label>
                    <input
                      type="number"
                      value={accountNumber ?? " "}
                      onChange={(e) =>
                        setMissingTradelinePayment({
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full mt-1 border rounded-md p-2 text-sm"
                    />
                  </div>
                </div>
              </PopUp>
            )}

            {accountType === "Student loan" && (
              <div className="border rounded-xl p-6 bg-white shadow-sm space-y-6">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <GraduationCap className="w-4 h-4" />
                  Student Loan Handling
                </div>

                <PromptRadio
                  label="Is this a FNMA loan or FHLMC loan?"
                  value={loanType}
                  options={["FNMA", "FHLMC"]}
                  onChange={(v) => setMissingTradelinePayment({ loanType: v })}
                />

                {loanType === "FHLMC" && (
                  <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                    Update LOS based on FHLMC student loan guidelines.
                  </div>
                )}

                {loanType === "FNMA" && (
                  <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                    Update LOS based on FNMA student loan guidelines.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingTradelinePaymentHandling;
