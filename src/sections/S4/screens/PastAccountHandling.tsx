import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";

import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertCircle, AlertTriangle, FileWarning } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const PastAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { pastDueAccountHandling, setPastDueAccountHandling } = useS4Store();

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
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setPastDueAccountHandling({
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
              <EditableCondition
                type="condition"
                value="Tradeline [[Account name_Number]] is reflecting past due. Provide credit supplement to bring the past due account as current and also provide the source of funds."
              />
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
              <div className="border rounded-xl bg-white shadow-sm space-y-4 overflow-hidden">
                {/* Selected discrepancies */}
                <div className="px-6 pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />

                    <span className="text-sm font-medium text-gray-800">
                      Selected discrepancies
                    </span>

                    <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      {discrepancies.length} item
                      {discrepancies.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {discrepancies.map((item, idx) => {
                    const letter = String.fromCharCode(97 + idx);

                    return (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0"
                      >
                        <span className="min-w-[20px] h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500 mt-0.5 flex-shrink-0">
                          {letter}
                        </span>

                        <span className="text-sm text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Generated condition */}
                <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Generated condition
                  </p>

                  <EditableCondition
                    type="condition"
                    value={`Tradeline [[Account name_Number]] is reflecting past due and [credit supplement/bank statement/transaction history/credit card statement] is provided in file. However, document reflects below issues:\n\n${discrepancies
                      .map(
                        (item, idx) =>
                          `${String.fromCharCode(97 + idx)}) ${item}`,
                      )
                      .join(
                        "\n",
                      )}\n\nProvide updated supporting documentation along with the source of funds.`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastAccountHandling;
