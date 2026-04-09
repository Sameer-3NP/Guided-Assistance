import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../S3/components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const LiabilityPaidOffHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useSectionStore();

  const {
    accounts,
    debtPaidOff,
    accountTypes,
    supportingDocument,
    documentType,
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
      return;
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
      toast.error("Condition 1 appears as per Scenario");
      return;
    }

    if (discrepancies.length > 0) {
      toast.error(
        `Condition 2 appears (${selectedAccount?.creditorName} / ${selectedAccount?.accountNumber})`,
      );
    }

    navigate("/s4/section4-summary");
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
      accounts: [
        ...accounts,
        {
          creditorName,
          accountNumber,
        },
      ],
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
            <div className="border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
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
              className="text-sm text-blue-500 underline"
            >
              Add Account
            </button>
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

        {/* ACCOUNT DROPDOWN */}

        {accounts.length > 0 && debtPaidOff === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <label className="text-sm font-medium">
              Select account number/name
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

        {/* SUPPORTING DOCUMENT */}

        {accountTypes.length > 0 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Do we have any supporting documents for paying off the debt at closing?"
              value={supportingDocument}
              options={["Yes", "No"]}
              onChange={(v) =>
                setLiabilityPaidOffHandling({
                  supportingDocument: v,
                })
              }
            />

            {supportingDocument === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                Condition 1 appears
              </div>
            )}
          </div>
        )}

        {/* CHECKLISTS */}

        {supportingDocument === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            {accountTypes.includes("Revolving") && (
              <CheckboxGroup
                label="Checklist"
                options={[
                  "Credit card statements are received for different borrowers.",
                  "Credit card statement received reflects different account number and name.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setLiabilityPaidOffHandling({
                    discrepancies: v,
                  })
                }
              />
            )}

            {accountTypes.includes("Installment") && (
              <CheckboxGroup
                label="Checklist"
                options={[
                  "Payoff reflects incorrect account number and name",
                  "Payoff reflects the incorrect borrower's name.",
                  "Payoff provided is not latest and per diem interest is not provided.",
                  "Payoff provided has already expired.",
                  "The account statement reflects incorrect loan number and borrower name.",
                  "Account statement reflects the incorrect borrower’s name",
                  "Account statement provided does not reflect the exact payoff amount",
                  "The account statement available is not the latest statement.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setLiabilityPaidOffHandling({
                    discrepancies: v,
                  })
                }
              />
            )}

            {accountTypes.includes("Mortgage") && (
              <CheckboxGroup
                label="Checklist"
                options={[
                  "Payoff reflects incorrect account number and name",
                  "Payoff reflects the incorrect borrower's name.",
                  "Payoff provided is not latest and per diem interest is not provided.",
                  "Payoff provided has already expired.",
                  "Payoff reflects late charges.",
                  "Interest of more than 60 days is charged.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setLiabilityPaidOffHandling({
                    discrepancies: v,
                  })
                }
              />
            )}
          </div>
        )}
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
          className="w-full border rounded-md p-2 text-sm"
          value={creditorName}
          onChange={(e) => setCreditorName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Account Number</label>
        <input
          className="w-full border rounded-md p-2 text-sm"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => addAccount(creditorName, accountNumber)}
      >
        Add
      </button>
    </div>
  );
};
