import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../S3/components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const PastAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { pastDueAccountHandling, setPastDueAccountHandling } =
    useSectionStore();

  const {
    creditorName,
    accountNumber,
    pastDueAccount,
    supportingDocument,
    documentType,
    discrepancies,
  } = pastDueAccountHandling;

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
    if (!pastDueAccount) return toast.error("Please answer the first prompt.");

    if (pastDueAccount === "No") {
      navigate("/s4/liability-paid-off");
      return;
    }

    if (!supportingDocument) return toast.error("Please answer prompt 2.");

    if (supportingDocument === "No") {
      toast.error("Condition appears as per Branch 1");
      navigate("/s4/liability-paid-off");
      return;
    }

    if (!documentType) return toast.error("Please select document type.");

    if (discrepancies.length > 0) {
      toast.error(
        `Condition appears as per Branch 2 (${creditorName} / ${accountNumber})`,
      );
    }

    navigate("/s4/liability-paid-off");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/duplicate-trade"),
    });
  }, [pastDueAccount, supportingDocument, documentType, discrepancies]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Past Due Account Handling
          </h2>
        </div>

        {/* ACCOUNT DETAILS POPUP */}

        <PopUp
          open={showPopup}
          title="Past Due Account Details"
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
                onChange={(e) =>
                  setPastDueAccountHandling({
                    creditorName: e.target.value,
                  })
                }
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="text"
                value={accountNumber ?? ""}
                onChange={(e) =>
                  setPastDueAccountHandling({
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
            label="Does credit report reflect any account which has past due balance but not in collection or charged off?"
            value={pastDueAccount}
            options={["Yes", "No"]}
            onChange={(v) =>
              setPastDueAccountHandling({
                pastDueAccount: v,
              })
            }
          />

          {pastDueAccount === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
              ✔ Proceed to screen 4.12
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {pastDueAccount === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if we have a supporting document in file reflecting the past due amount is $0 and current?"
              value={supportingDocument}
              options={["Yes", "No"]}
              onChange={(v) =>
                setPastDueAccountHandling({
                  supportingDocument: v,
                })
              }
            />

            {supportingDocument === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                Condition appears as per Branch 1
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2a */}

        {supportingDocument === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="What document is received for a past due account?"
              options={[
                "Credit supplement",
                "Bank statement/transaction history reflecting source of funds",
                "Credit card statement",
              ]}
              values={documentType}
              onChange={(v) =>
                setPastDueAccountHandling({
                  documentType: v,
                })
              }
            />

            {/* CREDIT SUPPLEMENT CHECKLIST */}

            {documentType.includes("Credit supplement") && (
              <CheckboxGroup
                label="If credit supplement is available, review below checklist and select all that is applicable:"
                options={[
                  "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
                  "Past due account on credit report still reflects the same past due amount on credit supplement and it is not reflecting as $0.",
                  "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
                  "Other supporting documents reflecting the source of funds is not available.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setPastDueAccountHandling({
                    discrepancies: v,
                  })
                }
              />
            )}

            {/* BANK STATEMENT CHECKLIST */}

            {documentType.includes(
              "Bank statement/transaction history reflecting source of funds",
            ) && (
              <CheckboxGroup
                label="If bank statement/transaction history is available, review below checklist and select all that is applicable:"
                options={[
                  "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the past due amount.",
                  "Bank statement/Transaction History reflects withdrawal amount similar to past due amount , but description does not reflect creditor details.",
                  "Bank statement/Transaction History provided reflects other discrepancy.",
                  "Credit supplement /other supporting document not available reflecting past due amount is paid with $0 balance.",
                  "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
                  "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account. Hence, the source of funds required for the large deposit is noted.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setPastDueAccountHandling({
                    discrepancies: v,
                  })
                }
              />
            )}

            {/* CREDIT CARD CHECKLIST */}

            {documentType.includes("Credit card statement") && (
              <CheckboxGroup
                label="If credit card statement is available, review below checklist and select all that is applicable:"
                options={[
                  "Credit card statement available in file is for some other account and not for the one whose past due amount was reflected on credit report.",
                  "Credit card statement does not reflect past due amount as $0 but has amount.",
                  "Credit card statement reflected different borrower’s name.",
                ]}
                values={discrepancies}
                onChange={(v) =>
                  setPastDueAccountHandling({
                    discrepancies: v,
                  })
                }
              />
            )}

            {discrepancies.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                Condition appears as per branch 3
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastAccountHandling;
