import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import PromptRadio from "../../../components/PromptRadio";

import { FileCheck, GraduationCap, FileWarning } from "lucide-react";

import PopUp from "../../../components/PopUp";
import EditableCondition from "../../../components/EditableCondition";

const MissingTradelinePaymentHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { missingTradelinePayment, setMissingTradelinePayment } = useS4Store();

  const {
    allPayments,
    accountType = [],
    loanType,
    accounts = [],
    selectedAccount,
  } = missingTradelinePayment;

  const [showPopup, setShowPopup] = useState(false);
  const [accountRows, setAccountRows] = useState([
    { creditorName: "", accountNumber: "" },
  ]);

  const handleRowChange = (
    index: number,
    field: "creditorName" | "accountNumber",
    value: string,
  ) => {
    const updated = [...accountRows];
    updated[index][field] = value;
    setAccountRows(updated);
  };

  const addRow = () => {
    setAccountRows([...accountRows, { creditorName: "", accountNumber: "" }]);
  };

  const removeRow = (index: number) => {
    const updated = accountRows.filter((_, i) => i !== index);
    setAccountRows(updated);
  };

  const handleInstallmentSubmit = () => {
    // if (!selectedAccount)
    //   return toast.error("Please select installment account.");

    const hasEmpty = accountRows.some(
      (row) => !row.creditorName || !row.accountNumber,
    );

    if (hasEmpty) {
      toast.error("Please fill all account details.");
      return;
    }

    const condition = `Payment for installment account ${accountRows[0].creditorName}=${accountRows[0].accountNumber} is not reflected on credit report. Obtain account statement reflecting monthly payment.`;

    const formattedAccounts = accountRows.map((row) => ({
      creditorName: row.creditorName,
      accountNumber: row.accountNumber,
    }));

    setMissingTradelinePayment({
      installmentCondition: condition,
      accounts: formattedAccounts,
      selectedAccount: `${formattedAccounts[0].creditorName}#${formattedAccounts[0].accountNumber}`,
    });

    setShowPopup(false);
  };

  /* ---------- BRANCH RULES ---------- */

  const showPrompt2 = allPayments === "No";

  const handleAccountTypeChange = (type: string) => {
    let updatedTypes = [...accountType];

    if (updatedTypes.includes(type)) {
      updatedTypes = updatedTypes.filter((t) => t !== type);
    } else {
      updatedTypes.push(type);
    }

    setMissingTradelinePayment({
      accountType: updatedTypes,
    });

    // Open popup only for Installment
    if (type === "Installment" && !accountType.includes("Installment")) {
      setShowPopup(true);
    }
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!allPayments) return toast.error("Please answer the first prompt.");

    if (allPayments === "Yes") {
      navigate("/s4/collection-account");
      return;
    }

    if (!accountType) return toast.error("Please select the account type.");

    if (accountType === "Installment") {
      if (!selectedAccount)
        return toast.error("Please select installment account.");
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
  }, [allPayments, accountType, loanType, selectedAccount, accountRows]);

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

            <div className="font-semibold items-start gap-3 bg-blue-100 border border-blue-200 rounded-xl p-3 ">
              Which account does not have a payment?
            </div>

            <div className="space-y-3">
              {["Revolving", "Installment", "Student loan"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={accountType.includes(type)}
                    onChange={() => handleAccountTypeChange(type)}
                    className="w-4 h-4"
                  />

                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            {accountType.includes("Revolving") && (
              <EditableCondition
                type="alert"
                value={
                  missingTradelinePayment.revolving ||
                  "Update the monthly payment in LOS as 5% of the outstanding balance or $10, whichever is higher, for [[Creditor Name, Account Number]]. "
                }
                onChange={(val) =>
                  setMissingTradelinePayment({ revolving: val })
                }
              />
            )}

            {accountType.includes("Installment") && (
              <PopUp
                open={showPopup}
                title="Installment Tradeline Details"
                icon={<FileWarning className="w-5 h-5 text-blue-500" />}
                onClose={() => setShowPopup(false)}
                onConfirm={handleInstallmentSubmit}
                confirmText="Continue"
              >
                <div className="space-y-4">
                  {accountRows.map((row, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      {/* Creditor Name */}
                      <div className="flex-1">
                        <label className="text-sm font-medium">
                          Creditor name
                        </label>
                        <input
                          type="text"
                          value={row.creditorName}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "creditorName",
                              e.target.value,
                            )
                          }
                          className="w-full mt-1 border rounded-md p-2 text-sm"
                        />
                      </div>

                      {/* Account Number */}
                      <div className="flex-1">
                        <label className="text-sm font-medium">
                          Account Number
                        </label>
                        <input
                          type="number"
                          value={row.accountNumber}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "accountNumber",
                              e.target.value,
                            )
                          }
                          className="w-full mt-1 border rounded-md p-2 text-sm"
                        />
                      </div>

                      {/* Remove Button */}
                      {accountRows.length > 1 && (
                        <button
                          onClick={() => removeRow(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Row Button */}
                  <button
                    onClick={addRow}
                    className="text-blue-600 text-sm font-medium"
                  >
                    + Add another account
                  </button>
                </div>
              </PopUp>
            )}

            {accountType.includes("Installment") && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Select account number/name
                  </label>

                  <select
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                    value={selectedAccount || ""}
                    onChange={(e) =>
                      setMissingTradelinePayment({
                        selectedAccount: e.target.value,
                        installmentCondition: `Payment for installment account ${e.target.value} is not reflected on credit report. Obtain account statement reflecting monthly payment.`,
                      })
                    }
                  >
                    <option value="">Select account</option>

                    {accounts.map((acc, index) => (
                      <option
                        key={index}
                        value={`${acc.creditorName}#${acc.accountNumber}`}
                      >
                        {acc.creditorName} - {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <EditableCondition
                  type="condition"
                  value={missingTradelinePayment.installmentCondition || ""}
                  onChange={(val) =>
                    setMissingTradelinePayment({
                      installmentCondition: val,
                    })
                  }
                />
              </div>
            )}

            {accountType.includes("Student loan") && (
              <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
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
                  <EditableCondition
                    type="alert"
                    value={
                      missingTradelinePayment.fhlmc ||
                      "Update the monthly payment in LOS as 0.5% of the outstanding balance for [[Account Name, Account Number]] as per FHLMC overlay."
                    }
                    onChange={(val) =>
                      setMissingTradelinePayment({ fhlmc: val })
                    }
                  />
                )}

                {loanType === "FNMA" && (
                  <EditableCondition
                    type="alert"
                    value={
                      missingTradelinePayment.fnma ||
                      "Update the monthly payment in LOS as 1% of the outstanding balance for [[Account Name, Account Number]] as per FNMA overlay. "
                    }
                    onChange={(val) =>
                      setMissingTradelinePayment({ fnma: val })
                    }
                  />
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
