import { useEffect, useState } from "react";
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

  const { excludedFromVOL, accountTypes, accounts } =
    excludedTradelineValidation;

  const [showPopup, setShowPopup] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);

  const [creditorName, setCreditorName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  /* ---------------- POPUP SUBMIT ---------------- */

  const handleAccountSubmit = () => {
    if (!creditorName || !accountNumber) {
      toast.error("Please enter account details.");
      return;
    }

    // setExcludedTradelineValidation({
    //   accounts: [
    //     ...accounts,
    //     {
    //       type: currentType,
    //       creditorName,
    //       accountNumber,
    //     },
    //   ],
    // });

    setCreditorName("");
    setAccountNumber("");
    setShowPopup(false);
  };

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!excludedFromVOL) return toast.error("Please answer prompt 1.");

    if (excludedFromVOL === "No") {
      navigate("/s4/utility-telecom-account"); // screen 4.6
      return;
    }

    if (accountTypes.length === 0)
      return toast.error("Please select account type.");

    navigate("/s4/utility-telecom-account"); // screen 4.6
  };

  /* ---------------- REGISTER ACTIONS ---------------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/disputed-account"),
    });
  }, [excludedFromVOL, accountTypes]);

  /* ---------------- ACCOUNT TYPE CHANGE ---------------- */

  const handleAccountTypeChange = (types: string[]) => {
    setExcludedTradelineValidation({
      accountTypes: types,
    });

    if (types.length > 0) {
      const latest = types[types.length - 1];
      setCurrentType(latest);
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
        {/* ACCOUNT DETAILS POPUP */}
        <PopUp
          open={showPopup}
          title="Excluded Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Creditor name</label>
              <input
                type="text"
                value={creditorName}
                onChange={(e) => setCreditorName(e.target.value)}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
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
        )}{" "}
        {accountTypes.includes("Revolving") && (
          <AccountFlow flow={RevolvingFlow} />
        )}{" "}
        {accountTypes.includes("Mortgage") && (
          <AccountFlow flow={MortgageFlow} />
        )}{" "}
        {accountTypes.includes("HELOC") && <AccountFlow flow={HelocFlow} />}{" "}
        {accountTypes.includes("Lease") && <AccountFlow flow={LeaseFlow} />}{" "}
        {accountTypes.includes("Open 30 days Charge account") && (
          <AccountFlow flow={ChargeAccountFlow} />
        )}{" "}
        {accountTypes.includes("Taxes") && <AccountFlow flow={TaxesFlow} />}{" "}
        {accountTypes.includes("Tax lien") && (
          <AccountFlow flow={TaxLienFlow} />
        )}{" "}
      </div>
    </div>
  );
};

export default ExcludedOmittedTradelineValidation;
