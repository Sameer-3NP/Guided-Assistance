import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../../store/useS4Store";

import RevolvingHandling from "./RevolvingHandling";
import InstallmentHandling from "./InstallmentHandling";
import MortgageHandling from "./MortgageHandling";

import PromptRadio from "../../../../components/PromptRadio";
import CheckboxGroup from "../../../../components/CheckboxGroup";
import PopUp from "../../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const LiabilityPaidOffHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useS4Store();

  const {
    accounts,
    debtPaidOff,
    accountTypes,
    supportingDocument,
    discrepancies,
    selectedAccount,
  } = liabilityPaidOffHandling;

  const [showPopup, setShowPopup] = useState(false);

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!debtPaidOff) {
      toast.error("Please answer the first prompt.");
      return;
    }

    if (debtPaidOff === "No") {
      navigate("/s5/active-bankruptcy");
    }

    if (accountTypes.length === 0) {
      toast.error("Please select account type.");
      return;
    }

    if (!supportingDocument) {
      toast.error("Please answer supporting document prompt.");
      return;
    }

    if (supportingDocument === "No") {
      toast.error("Condition 1 appears as per Scenario A");
    }

    if (discrepancies.length > 0) {
      toast.error(
        `Condition 2 appears (${selectedAccount?.creditorName} / ${selectedAccount?.accountNumber})`,
      );
    }

    navigate("/s4/child-support");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/past-due"),
    });
  }, [debtPaidOff, accountTypes, supportingDocument, discrepancies]);

  /* ---------------- ACCOUNT ADD ---------------- */

  const addAccount = (creditorName: string, accountNumber: string) => {
    setLiabilityPaidOffHandling({
      ...liabilityPaidOffHandling,
      accounts: [...accounts, { creditorName, accountNumber }],
    });
  };

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Liability being paid off Handling
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Check in LOS, if any debt is getting paid off at closing?"
            value={debtPaidOff}
            options={["Yes", "No"]}
            onChange={(v) =>
              setLiabilityPaidOffHandling({
                debtPaidOff: v,
              })
            }
          />

          {debtPaidOff === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ Proceed to next section 5
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {debtPaidOff === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <CheckboxGroup
              label="Select the account type which is getting paid off at closing?"
              options={["Revolving", "Installment", "Mortgage"]}
              values={accountTypes}
              onChange={(v) =>
                setLiabilityPaidOffHandling({
                  accountTypes: v,
                })
              }
            />

            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-400 text-white px-2 py-1 rounded-xl cursor-pointer"
            >
              Add Account
            </button>

            {/* ACCOUNT DROPDOWN */}

            {accountTypes.length > 0 && debtPaidOff === "Yes" && (
              <div>
                <label className="text-sm font-medium mb-2">
                  Select account number or name
                </label>

                <select
                  className="border rounded-md p-2 text-sm w-full"
                  onChange={(e) =>
                    setLiabilityPaidOffHandling({
                      selectedAccount: accounts.find(
                        (a) => a.accountNumber === e.target.value,
                      ),
                    })
                  }
                >
                  <option>Select account</option>

                  {accounts.map((a, i) => (
                    <option key={i} value={a.accountNumber}>
                      {a.creditorName} - {a.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT POPUP */}

        <PopUp
          open={showPopup}
          title="Add Account"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="continue"
          onConfirm={() => setShowPopup(false)}
        >
          <AccountForm addAccount={addAccount} />
        </PopUp>

        {/* SUPPORTING DOCUMENT FOR REVOLVING */}
        {accountTypes.includes("Revolving") && <RevolvingHandling />}

        {/* SUPPORTING DOCUMENT FOR INSTALLMENT   */}
        {accountTypes.includes("Installment") && <InstallmentHandling />}

        {/* SUPPORTING DOCUMENT FOR MORTGAGRE */}

        {accountTypes.includes("Mortgage") && <MortgageHandling />}
      </div>
    </div>
  );
};

export default LiabilityPaidOffHandling;

/* ---------------- ACCOUNT FORM ---------------- */

const AccountForm = ({ addAccount }: any) => {
  const [creditorName, setCreditorName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Creditor name</label>
        <input
          type="text"
          className="w-full border rounded-md p-2 text-sm"
          value={creditorName}
          onChange={(e) => {
            const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
            setCreditorName(value);
          }}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Account Number</label>
        <input
          type="number"
          className="w-full border rounded-md p-2 text-sm"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        onClick={() => addAccount(creditorName, accountNumber)}
      >
        Add
      </button>
    </div>
  );
};
