import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFlowContext } from "../../../store/FlowContext";
import { useS4Store } from "../../../store/useS4Store";
import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";
import DocumentChecklist from "../../../components/DocumentChecklist";

import { Clock, AlertCircle } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const PaymentHistoryRecencyValidation = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const {
    paymentHistoryRecencyValidation,
    setPaymentHistoryRecencyValidation,
  } = useS4Store();

  const {
    hasDLA,
    lienTypes,
    mortgagePropertyType,
    subjectProperty,
    reoProperty,
    nonMortgageLien,
  } = paymentHistoryRecencyValidation;

  const [showPopup, setShowPopup] = useState(false);

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  /* ---------------- PROMPT VISIBILITY ---------------- */

  const showPrompt2 = hasDLA === "Yes";

  const mortgageSelected = lienTypes.includes("Mortgage Lien");
  const nonMortgageSelected = lienTypes.includes("Non-Mortgage Lien");

  const subjectSelected = mortgagePropertyType.includes("Subject Property");
  const reoSelected = mortgagePropertyType.includes("REO property");

  /* ---------------- POPUP SUBMIT ---------------- */

  const handleAccountSubmit = () => {
    if (!accountName || !accountNumber)
      return toast.error("Please enter account details.");

    setPaymentHistoryRecencyValidation({
      accounts: [
        {
          type: lienTypes.join(","),
          accountName,
          accountNumber,
        },
      ],
    });

    setShowPopup(false);
  };

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!hasDLA) return toast.error("Please answer the first prompt.");

    if (hasDLA === "No") {
      navigate("/s4/delinquency-late");
      return;
    }

    if (lienTypes.length === 0) return toast.error("Please select lien type.");

    navigate("/s4/delinquency-late");
  };

  /* ---------------- REGISTER ACTIONS ---------------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/utility-telecom-account"),
    });
  }, [hasDLA, lienTypes, mortgagePropertyType]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <Clock className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Payment History Recency Validation
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <PromptRadio
            label="Does credit report reflect DLA prior to application date for any tradeline?"
            value={hasDLA}
            options={["Yes", "No"]}
            onChange={(v) =>
              setPaymentHistoryRecencyValidation({
                hasDLA: v,
                lienTypes: [],
              })
            }
          />

          {hasDLA === "No" && (
            <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ No DLA prior to application date reflected.
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="font-semibold text-gray-800">
              Is DLA prior to application date noted on mortgage or non-mortgage
              lien?
            </div>

            <div className="flex flex-col gap-2">
              {["Mortgage Lien", "Non-Mortgage Lien"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lienTypes.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...lienTypes, option]
                        : lienTypes.filter((o) => o !== option);

                      setPaymentHistoryRecencyValidation({
                        lienTypes: updated,
                      });

                      if (e.target.checked) {
                        setShowPopup(true);
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* PROMPT 2a */}

        {mortgageSelected && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="font-semibold text-gray-800">
              Check if mortgage account is associated with subject property or
              REO property?
            </div>

            <div className="flex flex-col gap-2">
              {["Subject Property", "REO property"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mortgagePropertyType.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...mortgagePropertyType, option]
                        : mortgagePropertyType.filter((o) => o !== option);

                      setPaymentHistoryRecencyValidation({
                        mortgagePropertyType: updated,
                      });
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )}

        {subjectSelected && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <PromptRadio
              label="Is DLA reflected on credit report covers the closing date minus 1 month?"
              value={subjectProperty.coversClosingMinus1Month}
              options={["Yes", "No"]}
              onChange={(v) =>
                setPaymentHistoryRecencyValidation({
                  subjectProperty: {
                    ...subjectProperty,
                    coversClosingMinus1Month: v,
                  },
                })
              }
            />

            {subjectProperty.coversClosingMinus1Month === "No" && (
              <PromptRadio
                label="Do we have any other supporting documents available to verify payment history till closing date?"
                value={subjectProperty.hasSupportingDocs}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setPaymentHistoryRecencyValidation({
                    subjectProperty: {
                      ...subjectProperty,
                      hasSupportingDocs: v,
                    },
                  })
                }
              />
            )}

            {subjectProperty.hasSupportingDocs === "No" && (
              <EditableCondition
                type="condition"
                value={`Obtain credit supplement to verify the payment history of mortgage account [[Account Name_Number]] to be current as of closing date [[Closing date]] as payment history is verified till [DLA:MM/YY] and closing date is [[Closing date]].`}
              />
            )}

            {subjectProperty.hasSupportingDocs === "Yes" && (
              <div className="border rounded-xl p-6 bg-blue-50 shadow-sm space-y-6">
                <div className="font-semibold text-gray-800">
                  Check if any other documents are available to verify DLA
                  covering closing date minus 1 month?
                </div>

                {[
                  "Credit supplement",
                  "Mortgage statement",
                  "Payoff statement",
                  "Bank statement/transaction history",
                ].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subjectProperty.documents.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...subjectProperty.documents, doc]
                          : subjectProperty.documents.filter((d) => d !== doc);

                        setPaymentHistoryRecencyValidation({
                          subjectProperty: {
                            ...subjectProperty,
                            documents: updated,
                          },
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>
            )}

            {subjectProperty.documents.includes("Credit supplement") && (
              <DocumentChecklist
                title="Credit supplement validation"
                items={[
                  "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
                  "Mortgage Tradeline",
                  "Mortgage Tradeline does not reflect DLA covering the closing date minus 1 month.",
                  "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%",
                ]}
                selected={subjectProperty.discrepancies}
                onChange={(items) =>
                  setPaymentHistoryRecencyValidation({
                    subjectProperty: {
                      ...subjectProperty,
                      discrepancies: items,
                    },
                  })
                }
              />
            )}

            {subjectProperty.documents.includes("Mortgage statement") && (
              <DocumentChecklist
                title="Mortgage statement validation"
                items={[
                  "Mortgage statement does not reflect the subject property address.",
                  "Next due date on mortgage statement is not verified till closing date",
                  "The mortgage statement reflects late charges, which is higher and is a trigger for borrower making late payments.",
                  "Mortgage statements reflect inconsistent information.",
                ]}
                selected={subjectProperty.discrepancies}
                onChange={(items) =>
                  setPaymentHistoryRecencyValidation({
                    subjectProperty: {
                      ...subjectProperty,
                      discrepancies: items,
                    },
                  })
                }
              />
            )}

            {subjectProperty.documents.includes("Payoff statement") && (
              <DocumentChecklist
                title="Payoff statement validation"
                items={[
                  "Payoff statement does not reflect the subject property address. ",
                  "Next due date on payoff statement is not verified till closing date. ",
                  "The payoff statement reflects late charges, which is higher and is a trigger for borrowers making late payments. ",
                  "Payoff statements reflect inconsistent information. ",
                ]}
                selected={subjectProperty.discrepancies}
                onChange={(items) =>
                  setPaymentHistoryRecencyValidation({
                    subjectProperty: {
                      ...subjectProperty,
                      discrepancies: items,
                    },
                  })
                }
              />
            )}

            {subjectProperty.documents.includes(
              "Bank statement/transaction history",
            ) && (
              <DocumentChecklist
                title="Bank statement validation"
                items={[
                  "Bank statement/transaction history does not reflect any withdrawal which can cover the payment history till closing ",
                  "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required. ",
                  "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account. Hence, the source of funds required for the large deposit is noted. ",
                  "Bank statement/Transaction History provided reflects other discrepancy. ",
                ]}
                selected={subjectProperty.discrepancies}
                onChange={(items) =>
                  setPaymentHistoryRecencyValidation({
                    subjectProperty: {
                      ...subjectProperty,
                      discrepancies: items,
                    },
                  })
                }
              />
            )}
          </div>
        )}

        {subjectProperty.discrepancies.length > 0 && (
          <div className="border rounded-xl bg-white shadow-sm space-y-4 overflow-hidden">
            {/* Selected discrepancies */}
            <div className="px-6 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />

                <span className="text-sm font-medium text-gray-800">
                  Selected discrepancies
                </span>

                <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  {subjectProperty.discrepancies.length} item
                  {subjectProperty.discrepancies.length !== 1 ? "s" : ""}
                </span>
              </div>

              {(() => {
                const sections = [
                  {
                    title: "Credit supplement",
                    items: [
                      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
                      "Mortgage Tradeline",
                      "Mortgage Tradeline does not reflect DLA covering the closing date minus 1 month.",
                      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%",
                    ],
                  },

                  {
                    title: "Mortgage statement",
                    items: [
                      "Mortgage statement does not reflect the subject property address.",
                      "Next due date on mortgage statement is not verified till closing date",
                      "The mortgage statement reflects late charges, which is higher and is a trigger for borrower making late payments.",
                      "Mortgage statements reflect inconsistent information.",
                    ],
                  },

                  {
                    title: "Payoff statement",
                    items: [
                      "Payoff statement does not reflect the subject property address.",
                      "Next due date on payoff statement is not verified till closing date.",
                      "The payoff statement reflects late charges, which is higher and is a trigger for borrowers making late payments.",
                      "Payoff statements reflect inconsistent information.",
                    ],
                  },

                  {
                    title: "Bank statement/transaction history",
                    items: [
                      "Bank statement/transaction history does not reflect any withdrawal which can cover the payment history till closing",
                      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
                      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account. Hence, the source of funds required for the large deposit is noted.",
                      "Bank statement/Transaction History provided reflects other discrepancy.",
                    ],
                  },
                ];

                let globalIdx = 0;

                return sections.map((section, sectionIdx) => {
                  const matchedItems = section.items.filter((item) =>
                    subjectProperty.discrepancies.includes(item),
                  );

                  if (!matchedItems.length) return null;

                  return (
                    <div key={section.title} className="space-y-1">
                      {sectionIdx > 0 && (
                        <hr className="border-gray-100 mb-3" />
                      )}

                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {section.title}
                      </p>

                      {matchedItems.map((item) => {
                        const letter = String.fromCharCode(97 + globalIdx++);

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
                  );
                });
              })()}
            </div>

            {/* Generated condition */}
            <div className="border-t border-gray-100 px-6 pb-6 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Generated condition
              </p>

              <EditableCondition
                type="condition"
                value={(() => {
                  const lettered = subjectProperty.discrepancies
                    .map(
                      (item, idx) =>
                        `${String.fromCharCode(97 + idx)}) ${item}`,
                    )
                    .join("\n");

                  return `Supporting documents received for mortgage payment history validation have below discrepancies:\n\n${lettered}\n\nUpdated supporting documentation is required.`;
                })()}
              />
            </div>
          </div>
        )}
        {/* PROMPT 2e */}

        {reoSelected && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <PromptRadio
              label="Is DLA more than 45 days of application date?"
              value={reoProperty.dlaMoreThan45Days}
              options={["Yes", "No"]}
              onChange={(v) =>
                setPaymentHistoryRecencyValidation({
                  reoProperty: { dlaMoreThan45Days: v },
                })
              }
            />

            {reoProperty.dlaMoreThan45Days === "Yes" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                Condition appears as per Branch 2.
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3 */}

        {nonMortgageSelected && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <PromptRadio
              label="Is DLA more than 90 days of application date for non-mortgage lien?"
              value={nonMortgageLien.dlaMoreThan90Days}
              options={["Yes", "No"]}
              onChange={(v) =>
                setPaymentHistoryRecencyValidation({
                  nonMortgageLien: { dlaMoreThan90Days: v },
                })
              }
            />

            {nonMortgageLien.dlaMoreThan90Days === "Yes" && (
              <EditableCondition
                type="condition"
                value={`Obtain credit supplement to verify the current payment history for account [[Account Name_Number]] as DLA of the account is more than 90 days old from credit report date [[Credit report date]].`}
              />
            )}
          </div>
        )}

        {/* POPUP */}

        <PopUp
          open={showPopup}
          title="Account Details"
          icon={<AlertCircle className="w-5 h-5 text-blue-500" />}
          onClose={() => setShowPopup(false)}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Account Name</label>
              <input
                type="text"
                value={accountName ?? ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setAccountName(value);
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
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default PaymentHistoryRecencyValidation;
