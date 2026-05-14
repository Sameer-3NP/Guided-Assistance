import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../../store/useS4Store";
import AccountFlow from "./AccountFlow";
import PromptRadio from "../../../../components/PromptRadio";
import CheckboxGroup from "../../../../components/CheckboxGroup";
import PopUp from "../../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

/* account flow components */
import {
  InstallmentFlow,
  RevolvingFlow,
  MortgageFlow,
  HelocFlow,
  LeaseFlow,
  ChargeAccountFlow,
  TaxesFlow,
  TaxLienFlow,
} from "./AccountFlows";

const ExcludedOmittedTradelineValidation = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { excludedTradelineValidation, setExcludedTradelineValidation } =
    useS4Store();

  const {
    excludedFromVOL,
    accountTypes = [],
    accounts = [],
  } = excludedTradelineValidation;

  const [showPopup, setShowPopup] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  // const [selectedAccount, setSelectedAccount] = useState<string>("");
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

  /* ---------------- POPUP SUBMIT ---------------- */

  const handleAccountSubmit = () => {
    const hasEmpty = accountRows.some(
      (row) => !row.creditorName || !row.accountNumber,
    );

    if (hasEmpty) {
      toast.error("Please fill all account details.");
      return;
    }

    // ✅ Save to store
    setExcludedTradelineValidation({
      accounts: [
        ...accounts,
        ...accountRows.map((row) => ({
          type: currentType!, // safe because popup only opens when type exists
          creditorName: row.creditorName,
          accountNumber: row.accountNumber,
        })),
      ],
    });

    // reset
    setAccountRows([{ creditorName: "", accountNumber: "" }]);
    setShowPopup(false);
  };

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = useCallback(() => {
    if (!excludedFromVOL) return toast.error("Please answer prompt 1.");

    if (excludedFromVOL === "No") {
      navigate("/s4/utility-telecom-account");
      return;
    }

    if (accountTypes.length === 0)
      return toast.error("Please select account type.");

    navigate("/s4/utility-telecom-account");
  }, [excludedFromVOL, accountTypes, navigate]);

  /* ---------------- REGISTER ACTIONS ---------------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/disputed-account"),
    });
  }, [handleContinue, navigate, registerActions]);

  /* ---------------- ACCOUNT TYPE CHANGE ---------------- */

  const handleAccountTypeChange = (types: string[]) => {
    const previousTypes = accountTypes || [];

    // detect newly added type
    const addedType = types.find((t) => !previousTypes.includes(t));

    setExcludedTradelineValidation({
      accountTypes: types,
    });

    // ✅ Only open popup on NEW selection
    if (addedType && !accounts.find((a) => a.type === addedType)) {
      setCurrentType(addedType);
      setShowPopup(true);
    }
  };

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Excluded / Omitted Tradeline Validation
          </h2>
        </div>

        {/* POPUP */}
        <PopUp
          open={showPopup}
          title="Excluded Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
          onClose={() => setShowPopup(false)}
        >
          <div className="space-y-4">
            {accountRows.map((row, index) => (
              <div key={index} className="flex gap-3 items-end">
                {/* Creditor Name */}
                <div className="flex-1">
                  <label className="text-sm font-medium">Creditor name</label>
                  <input
                    type="text"
                    value={row.creditorName}
                    onChange={(e) =>
                      handleRowChange(index, "creditorName", e.target.value)
                    }
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                  />
                </div>

                {/* Account Number */}
                <div className="flex-1">
                  <label className="text-sm font-medium">Account Number</label>
                  <input
                    type="number"
                    value={row.accountNumber}
                    onChange={(e) =>
                      handleRowChange(index, "accountNumber", e.target.value)
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

        {/* PROMPT 1 */}
        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Check if any account is excluded from VOL?"
            value={excludedFromVOL ?? ""}
            options={["Yes", "No"]}
            onChange={(v) =>
              setExcludedTradelineValidation({
                excludedFromVOL: v,
              })
            }
          />

          {excludedFromVOL === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
              ✔ Proceed to screen 4.6
            </div>
          )}
        </div>

        {/* PROMPT 2 */}
        {excludedFromVOL === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <CheckboxGroup
              label="What account types are excluded in LOS?"
              options={[
                "Installment",
                "Revolving",
                "Mortgage",
                "HELOC",
                "Lease",
                "Open 30 days Charge account",
                "Taxes",
                "Tax lien",
              ]}
              values={accountTypes}
              onChange={handleAccountTypeChange}
            />
          </div>
        )}

        {/* ACCOUNT FLOWS */}
        {accountTypes.includes("Installment") && (
          <AccountFlow flow={InstallmentFlow} />
        )}

        {accountTypes.includes("Revolving") && (
          <AccountFlow flow={RevolvingFlow} />
        )}

        {accountTypes.includes("Mortgage") && (
          <AccountFlow flow={MortgageFlow} />
        )}

        {accountTypes.includes("HELOC") && <AccountFlow flow={HelocFlow} />}

        {accountTypes.includes("Lease") && <AccountFlow flow={LeaseFlow} />}

        {accountTypes.includes("Open 30 days Charge account") && (
          <AccountFlow flow={ChargeAccountFlow} />
        )}

        {accountTypes.includes("Taxes") && <AccountFlow flow={TaxesFlow} />}

        {accountTypes.includes("Tax lien") && (
          <AccountFlow flow={TaxLienFlow} />
        )}
      </div>
    </div>
  );
};

export default ExcludedOmittedTradelineValidation;
