import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const ChildSupportHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { childSupportHandling, setChildSupportHandling, s1 } =
    useSectionStore();

  const {
    hasChildSupportTradeline,
    supportingDocument,
    documentType,
    discrepancies,
    lenderRequirement,
    accounts,
    selectedAccount,
    dlaLessThan7Years,
  } = childSupportHandling;

  const creditReports = s1;

  /* ---------- LOCAL POPUP STATE ---------- */

  const [showPopup, setShowPopup] = useState(false);
  const [creditorName, setCreditorName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  /* ---------- POPUP SUBMIT ---------- */

  const handleAccountSubmit = () => {
    if (!creditorName || !accountNumber) {
      toast.error("Please enter account details.");
      return;
    }

    setChildSupportHandling({
      accounts: [
        ...accounts,
        {
          creditorName,
          accountNumber,
          balance,
        },
      ],
    });

    setShowPopup(false);
    setCreditorName("");
    setAccountNumber("");
    setBalance("");
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!hasChildSupportTradeline)
      return toast.error("Please answer the first prompt.");

    if (hasChildSupportTradeline === "No") {
      navigate("/S5");
      return;
    }

    if (!selectedAccount) return toast.error("Please select account.");

    if (!dlaLessThan7Years)
      return toast.error("Please answer the DLA question.");

    if (dlaLessThan7Years === "No") {
      navigate("/S5");
      return;
    }

    if (!supportingDocument) return toast.error("Please answer prompt 3.");

    if (supportingDocument === "No") {
      if (!lenderRequirement)
        return toast.error("Please answer lender requirement prompt.");

      if (lenderRequirement === "Yes") {
        toast.error("Condition appears as per Branch 3");
      }

      navigate("/S5");
      return;
    }

    if (documentType.length === 0) {
      toast.error(
        "No document selected. Escalate documentation for manager review.",
      );
      return;
    }

    if (discrepancies.length > 0) {
      toast.error(
        `Condition appears as per Branch 4 (${selectedAccount.creditorName} / ${selectedAccount.accountNumber})`,
      );
    }

    navigate("/S5");
  };

  useEffect(() => {
    if (hasChildSupportTradeline === "No" || dlaLessThan7Years === "No") {
      if (creditReports.length > 0) {
        navigate("/S1");
      } else {
        navigate("/S5");
      }
    }
  }, [hasChildSupportTradeline, creditReports, navigate]);

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/liability-paid-off"),
    });
  }, [
    hasChildSupportTradeline,
    dlaLessThan7Years,
    supportingDocument,
    documentType,
    discrepancies,
    lenderRequirement,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Child Support Handling
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any tradeline with remarks as Child support / Support / Alimony?"
            value={hasChildSupportTradeline}
            options={["Yes", "No"]}
            onChange={(v) => {
              setChildSupportHandling({
                hasChildSupportTradeline: v,
              });

              if (v === "Yes") setShowPopup(true);
            }}
          />

          {hasChildSupportTradeline === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
              ✔ Proceed to final screen
            </div>
          )}
        </div>

        {/* ACCOUNT DROPDOWN */}

        {accounts.length > 0 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <label className="text-sm font-medium">
              Select account number/name
            </label>

            <select
              className="border rounded-md p-2 text-sm w-full"
              onChange={(e) =>
                setChildSupportHandling({
                  selectedAccount: accounts.find(
                    (a) => a.accountNumber === e.target.value,
                  ),
                })
              }
            >
              <option>Select account</option>

              {accounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.creditorName} - {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PROMPT 2 */}

        {selectedAccount && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Does child support account have DLA of less than 7 years?"
              value={dlaLessThan7Years}
              options={["Yes", "No"]}
              onChange={(v) =>
                setChildSupportHandling({
                  dlaLessThan7Years: v,
                })
              }
            />
          </div>
        )}

        {/* PROMPT 3 */}

        {dlaLessThan7Years === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if we have divorce decree or child support agreement available in file"
              value={supportingDocument}
              options={["Yes", "No"]}
              onChange={(v) =>
                setChildSupportHandling({
                  supportingDocument: v,
                })
              }
            />
          </div>
        )}

        {/* DOCUMENT TYPE */}

        {supportingDocument === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="What document is provided for child support tradeline?"
              options={["Child support agreement", "Divorce decree"]}
              values={documentType}
              onChange={(v) =>
                setChildSupportHandling({
                  documentType: v,
                })
              }
            />
          </div>
        )}

        {/* CHILD SUPPORT AGREEMENT CHECKLIST */}

        {documentType.includes("Child support agreement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="Child support agreement checklist"
              options={[
                "Case# and creditor name does not match with tradeline",
                "Monthly payment different from credit report",
                "Payment active in document but inactive on credit report",
                "Document not executed/notarized",
                "Missing pages",
                "Account in collection but document shows no delinquency",
              ]}
              values={discrepancies}
              onChange={(v) =>
                setChildSupportHandling({
                  discrepancies: v,
                })
              }
            />
          </div>
        )}

        {/* DIVORCE DECREE CHECKLIST */}

        {documentType.includes("Divorce decree") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="Divorce decree checklist"
              options={[
                "Case# and creditor name does not match with tradeline",
                "Monthly payment different from credit report",
                "Payment active in document but inactive on credit report",
                "Document not executed/notarized",
                "Missing pages",
                "Account in collection but document shows no delinquency",
                "Additional debt assigned not included in DTI",
                "Additional real estate assigned not included in PITIA",
              ]}
              values={discrepancies}
              onChange={(v) =>
                setChildSupportHandling({
                  discrepancies: v,
                })
              }
            />
          </div>
        )}

        {/* PROMPT 4 */}

        {supportingDocument === "No" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check out lender requirements for child support/divorce decree?"
              value={lenderRequirement}
              options={["Yes", "No"]}
              onChange={(v) =>
                setChildSupportHandling({
                  lenderRequirement: v,
                })
              }
            />

            {lenderRequirement === "Yes" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                Condition appears as per Branch 3
              </div>
            )}
          </div>
        )}

        {/* POPUP */}

        <PopUp
          open={showPopup}
          title="Child Support Account Details"
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
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setCreditorName(value);
                }}
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

            <div>
              <label className="text-sm font-medium">Balance</label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default ChildSupportHandling;
