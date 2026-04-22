import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFlowContext } from "../../../store/FlowContext";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";
import { AlertTriangle } from "lucide-react";

const JudgmentHandling = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();
  const [showCreditInventoryPopup, setShowCreditInventoryPopup] =
    useState(false);
  const { judgmentHandling, setJudgmentHandling, s1 } = useSectionStore();

  const { judgmentTypes, judgmentStatus } = judgmentHandling;

  const creditReports = s1;

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    const {
      judgmentTypes,
      judgmentStatus,
      selectedAccount,

      judgmentDocTypes3,

      bankStatementChecklist,
      checkChecklist,
      giftLetterChecklist,

      creditorLetterChecklist3,
      bankStatementChecklist3,
      checkChecklist3,
      giftLetterChecklist3,

      losUpdatedForJudgment,
      payoffAvailable,
      payoffChecklist,
    } = judgmentHandling;

    /* ================= VALIDATION 1 ================= */
    if (!judgmentTypes || judgmentTypes.length === 0) {
      toast.error("Please select Judgment type.");
    }

    /* ================= VALIDATION 2 ================= */
    if (!selectedAccount?.accountNumber) {
      toast.error("Please select account number and name.");
    }

    /* ================= PROMPT 1 CHECK ================= */
    if (!judgmentStatus) {
      toast.error("Please answer Prompt 1.");
      return;
    }

    /* ================= IF NO JUDGMENT ================= */
    if (judgmentStatus === "No") {
      navigate("/s5/last-screen");
    }

    /* ================= PROMPT 2 PATH VALIDATION ================= */
    const hasPrompt2Issue =
      bankStatementChecklist.length > 0 ||
      checkChecklist.length > 0 ||
      giftLetterChecklist.length > 0;

    if (hasPrompt2Issue) {
      toast.error("Condition triggered in Prompt 2 (Branch A3).");
    }

    /* ================= PROMPT 3 CHECK ================= */
    const hasPrompt3Docs =
      judgmentDocTypes3.includes("Letter from creditor") ||
      judgmentDocTypes3.includes("Bank statement") ||
      judgmentDocTypes3.includes("Cancelled check/cashier’s check") ||
      judgmentDocTypes3.includes("Gift letter");

    if (hasPrompt3Docs) {
      const hasPrompt3Issue =
        creditorLetterChecklist3.length > 0 ||
        bankStatementChecklist3.length > 0 ||
        checkChecklist3.length > 0 ||
        giftLetterChecklist3.length > 0;

      if (hasPrompt3Issue) {
        toast.error("Condition triggered in Prompt 3 (Branch B2).");
      }
    }

    /* ================= PROMPT 4 VALIDATION ================= */
    if (!losUpdatedForJudgment) {
      toast.error("Please answer Prompt 4.");
    }

    if (losUpdatedForJudgment === "No") {
      toast.error("Condition triggered (Branch B1).");
    }

    if (!payoffAvailable) {
      toast.error("Please answer Prompt 4a.");
    }

    if (payoffAvailable === "No") {
      toast.error("Condition triggered (Branch B6).");
    }

    /* ================= FINAL CHECKPOINT ================= */
    const hasPayoffIssue = payoffChecklist.length > 0;

    if (hasPayoffIssue) {
      toast.error("Condition triggered (Branch B7).");
    }

    /* ================= SUCCESS PATH ================= */
    toast.success("Judgment flow completed successfully.");

    navigate("/s5/last-screen");
  };

  const handleCreditInventoryConfirm = () => {
    setShowCreditInventoryPopup(false);

    if (creditReports.length > 0) {
      navigate("/S1/inventory");
    } else {
      navigate("/S5/last-screen");
    }
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/tax-lien"),
    });
  }, [judgmentTypes]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Judgment Handling (Released & Not Released)
        </h2>

        {/* PROMPT 1 */}
        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does Credit Report/lien and Judgment Report Reflect Judgment?"
            value={
              judgmentTypes.includes("Yes")
                ? "Yes"
                : judgmentTypes.includes("No")
                  ? "No"
                  : ""
            }
            options={["Yes", "No"]}
            onChange={(v) => {
              setJudgmentHandling({
                judgmentTypes: [v],
              });

              if (v === "No") {
                setShowCreditInventoryPopup(true);
              }
            }}
          />
        </div>

        {/* UI hint */}
        {judgmentTypes.includes("No") && (
          <div className=" bg-blue-50 p-3 rounded-xl text-sm text-black">
            Move to section 1 (if multiple credit report available) else final
            screen
          </div>
        )}

        {judgmentTypes.includes("Yes") && (
          <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
            Proceed to Prompt 2
          </div>
        )}

        {/* PROMPT 2 */}
        {judgmentTypes.includes("Yes") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <div className="text-md font-medium">
              Is the Judgment released or not released?
            </div>

            {["Released", "Not Released"].map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={judgmentStatus.includes(option)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...judgmentStatus, option]
                      : judgmentStatus.filter((i) => i !== option);

                    setJudgmentHandling({
                      judgmentStatus: updated,
                    });
                  }}
                />
                {option}
              </label>
            ))}

            {/* ================= RELEASED SECTION ================= */}
            {judgmentStatus.includes("Released") && (
              <div className="space-y-4 border p-4 rounded-xl bg-white">
                <div>
                  <label className="text-sm font-medium">Creditor Name</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm"
                    value={judgmentHandling.releasedCreditorName || ""}
                    onChange={(e) =>
                      setJudgmentHandling({
                        releasedCreditorName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Case Number</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm"
                    value={judgmentHandling.releasedCaseNumber || ""}
                    onChange={(e) =>
                      setJudgmentHandling({
                        releasedCaseNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Released Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 text-sm"
                    value={judgmentHandling.releasedDate || ""}
                    onChange={(e) =>
                      setJudgmentHandling({
                        releasedDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* ================= NOT RELEASED INFO ================= */}
            {judgmentStatus.includes("Not Released") && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Proceed to Prompt 3
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2a */}
        {judgmentStatus.includes("Released") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Is the release date before the application date?"
              value={judgmentHandling.releaseDateBeforeAppDate || ""}
              options={["Yes", "No"]}
              onChange={(v) => {
                setJudgmentHandling({
                  releaseDateBeforeAppDate: v,
                });

                if (v === "Yes") {
                  setShowCreditInventoryPopup(true);
                }
              }}
            />

            {/* ================= YES PATH ================= */}
            {judgmentHandling.releaseDateBeforeAppDate === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Move to section 1 (if multiple credit report is available) else
                move to final screen
              </div>
            )}

            {/* ================= NO PATH ================= */}
            {judgmentHandling.releaseDateBeforeAppDate === "No" && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Proceed to Prompt 2b
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2b */}
        {judgmentStatus.includes("Released") &&
          judgmentHandling.releaseDateBeforeAppDate === "No" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Has the borrower provided documents in file to verify the source of funds used to pay Judgment?"
                value={judgmentHandling.judgmentSourceDocsProvided || ""}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setJudgmentHandling({
                    judgmentSourceDocsProvided: v,
                  })
                }
              />

              {/* ================= NO CONDITION ================= */}
              {judgmentHandling.judgmentSourceDocsProvided === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition 2 appears as per branch A3 for decision logic A
                </div>
              )}

              {/* ================= YES PATH ================= */}
              {judgmentHandling.judgmentSourceDocsProvided === "Yes" && (
                <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                  Proceed to Prompt 2c
                </div>
              )}
            </div>
          )}

        {/* PROMPT 2c */}
        {judgmentStatus.includes("Released") &&
          judgmentHandling.releaseDateBeforeAppDate === "No" &&
          judgmentHandling.judgmentSourceDocsProvided === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <div className="text-md font-medium">
                What document has been received? (Select all that apply)
              </div>

              <div className="space-y-3 text-sm">
                {[
                  "Bank statement",
                  "Cancelled check/cashier’s check",
                  "Gift letter",
                ].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={judgmentHandling.judgmentDocTypes.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...judgmentHandling.judgmentDocTypes, doc]
                          : judgmentHandling.judgmentDocTypes.filter(
                              (d) => d !== doc,
                            );

                        setJudgmentHandling({
                          judgmentDocTypes: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {/* ================= NO SELECTION ================= */}
              {judgmentHandling.judgmentDocTypes.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  If no document selected → Proceed to Prompt 3
                </div>
              )}

              {/* ================= SELECTION INFO ================= */}
              {judgmentHandling.judgmentDocTypes.length > 0 && (
                <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                  Proceed to respective checklist (2d / 2e / 2f)
                </div>
              )}
            </div>
          )}

        {/* PROMPT 2d - Bank Statement Checklist */}
        {judgmentHandling.judgmentDocTypes.includes("Bank statement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-5">
            <div className="text-md font-medium">
              If Bank statement is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Bank statement provided does not reflect borrower’s name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the judgment and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.bankStatementChecklist.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.bankStatementChecklist, item]
                        : judgmentHandling.bankStatementChecklist.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        bankStatementChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.bankStatementChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}

            {/* ================= NO SELECTION ================= */}
            {judgmentHandling.bankStatementChecklist.length === 0 && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                If no checklist selected → Proceed to Prompt 3
              </div>
            )}
          </div>
        )}

        {judgmentHandling.bankStatementChecklist.length === 0 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Has any other supporting document reflecting tax lien has been paid off and released provided by borrower?"
              value={judgmentHandling.judgmentAdditionalDocsProvided || ""}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({
                  judgmentAdditionalDocsProvided: v,
                })
              }
            />

            {/* ================= NO PATH ================= */}
            {judgmentHandling.judgmentAdditionalDocsProvided === "No" && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Proceed to Prompt 4
              </div>
            )}

            {/* ================= YES PATH ================= */}
            {judgmentHandling.judgmentAdditionalDocsProvided === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to Prompt 3a
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2e - Cancelled Check / Cashier’s Check Checklist */}
        {judgmentHandling.judgmentDocTypes.includes(
          "Cancelled check/cashier’s check",
        ) && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Cancelled Check/cashier’s check is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against judgment.",
                "The check provided reflects payor name different than the borrower’s name which is considered a gift; however, gift documents are missing in file.",
                "Cashier’s check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.checkChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.checkChecklist, item]
                        : judgmentHandling.checkChecklist.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        checkChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.checkChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}

            {/* ================= NO SELECTION ================= */}
            {judgmentHandling.checkChecklist.length === 0 && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                If no checklist selected → Proceed to Prompt 3
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2f - Gift Letter Checklist */}
        {judgmentHandling.judgmentDocTypes.includes("Gift letter") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Gift letter is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Gift letter provided is not executed.",
                "Donor name on gift letter does not match with the check/bank statement available.",
                "Gift letter is not completely filled.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.giftLetterChecklist.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.giftLetterChecklist, item]
                        : judgmentHandling.giftLetterChecklist.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        giftLetterChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.giftLetterChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}

            {/* ================= NO SELECTION ================= */}
            {judgmentHandling.giftLetterChecklist.length === 0 && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                If no checklist selected → Proceed to Prompt 3
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3 */}
        {judgmentStatus.includes("Not Released") &&
          judgmentHandling.releaseDateBeforeAppDate === "No" &&
          judgmentHandling.judgmentSourceDocsProvided === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Has any other supporting document reflecting tax lien has been paid off and released provided by borrower?"
                value={judgmentHandling.judgmentAdditionalDocsProvided || ""}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setJudgmentHandling({
                    judgmentAdditionalDocsProvided: v,
                  })
                }
              />

              {/* ================= NO PATH ================= */}
              {judgmentHandling.judgmentAdditionalDocsProvided === "No" && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  Proceed to Prompt 4
                </div>
              )}

              {/* ================= YES PATH ================= */}
              {judgmentHandling.judgmentAdditionalDocsProvided === "Yes" && (
                <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                  Proceed to Prompt 3a
                </div>
              )}
            </div>
          )}

        {/* PROMPT 3a */}
        {judgmentStatus.includes("Not Released") ||
          (judgmentHandling.judgmentAdditionalDocsProvided === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <div className="text-md font-medium">
                What document has been received? (Select all that apply)
              </div>

              <div className="space-y-3 text-sm">
                {[
                  "Letter from creditor",
                  "Bank statement",
                  "Cancelled check/cashier’s check",
                  "Gift letter",
                ].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={judgmentHandling.judgmentDocTypes3.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...judgmentHandling.judgmentDocTypes3, doc]
                          : judgmentHandling.judgmentDocTypes3.filter(
                              (d) => d !== doc,
                            );

                        setJudgmentHandling({
                          judgmentDocTypes3: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {/* ================= NO SELECTION ================= */}
              {judgmentHandling.judgmentDocTypes3.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  If none selected → Proceed to Prompt 4
                </div>
              )}

              {/* ================= SELECTION INFO ================= */}
              {judgmentHandling.judgmentDocTypes3.length > 0 && (
                <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                  Proceed to respective checklist (3b / 3c / 3d / 3e)
                </div>
              )}
            </div>
          ))}

        {/* PROMPT 3b - Creditor Letter Checklist */}
        {judgmentHandling.judgmentDocTypes3.includes(
          "Letter from creditor",
        ) && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If letter from creditor is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Letter from creditor does not reflect case number matching with the one reflected on credit report",
                "Letter from creditor does not reflect creditor name matching with the one reflected on credit report",
                "Letter from creditor reflects pending amount matching with the one reflected on credit report and the same is not acceptable as it should reflect $0 balance",
                "Letter from creditor is expired and not latest",
                "Letter from creditor is available reflecting judgment is released however complete source of funds used to pay off the lien is not available",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.creditorLetterChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.creditorLetterChecklist3, item]
                        : judgmentHandling.creditorLetterChecklist3.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        creditorLetterChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.creditorLetterChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3c - Bank Statement Checklist (Judgment) */}
        {judgmentHandling.judgmentDocTypes3.includes("Bank statement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Bank statement is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Bank statement provided does not reflect borrower’s name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the Judgment and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
                "Bank statement provided reflects withdrawal towards the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting judgment is released has not been received.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.bankStatementChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.bankStatementChecklist3, item]
                        : judgmentHandling.bankStatementChecklist3.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        bankStatementChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.bankStatementChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3d - Cancelled Check / Cashier’s Check (Judgment) */}
        {judgmentHandling.judgmentDocTypes3.includes(
          "Cancelled check/cashier’s check",
        ) && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Cancelled Check/cashier’s check is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against Judgment.",
                "The check provided reflects payor name different than the borrower’s name which is considered a gift; however, gift documents are missing in file.",
                "Cashier’s check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
                "Cancelled check/cashier’s check provided reflects payment to the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting judgment is released has not been received.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.checkChecklist3.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.checkChecklist3, item]
                        : judgmentHandling.checkChecklist3.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        checkChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.checkChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3e - Gift Letter Checklist (Judgment) */}
        {judgmentHandling.judgmentDocTypes3.includes("Gift letter") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Gift letter is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Gift letter provided is not executed.",
                "Donor name on gift letter does not match with the check/bank statement available.",
                "Gift letter is not completely filled.",
                "Only gift letter is provided however, bank statement/check reflecting payment made to the creditor is not available.",
                "Only gift letter is provided along with the bank statement/check reflecting payment made to the creditor however, letter from creditor reflecting judgment is released is not available.",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.giftLetterChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.giftLetterChecklist3, item]
                        : judgmentHandling.giftLetterChecklist3.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        giftLetterChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION TRIGGER ================= */}
            {judgmentHandling.giftLetterChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {/* PROMPT 4 */}
        {judgmentHandling.judgmentDocTypes3.length > 0 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Is LOS updated for judgment being paid off at closing?"
              value={judgmentHandling.losUpdatedForJudgment}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({
                  losUpdatedForJudgment: v,
                })
              }
            />

            {/* ================= NO ================= */}
            {judgmentHandling.losUpdatedForJudgment === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B1 for decision logic B
              </div>
            )}

            {/* ================= YES ================= */}
            {judgmentHandling.losUpdatedForJudgment === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to Prompt 4a
              </div>
            )}
          </div>
        )}

        {/* PROMPT 4a */}
        {judgmentHandling.losUpdatedForJudgment === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Do we have payoff in file for judgment getting paid off at closing?"
              value={judgmentHandling.payoffAvailable}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({
                  payoffAvailable: v,
                })
              }
            />

            {/* ================= NO ================= */}
            {judgmentHandling.payoffAvailable === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B6 for decision logic B
              </div>
            )}

            {/* ================= YES ================= */}
            {judgmentHandling.payoffAvailable === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to Prompt 4b
              </div>
            )}
          </div>
        )}

        {/* PROMPT 4b - Payoff Checklist */}
        {judgmentHandling.payoffAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              Validate the checkpoint to review payoff and select all that
              apply:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Payoff statement provided different case number",
                "Payoff statement provided different creditor name",
                "Payoff statement is for different borrower",
                "Payoff statement provided is not the latest copy",
                "Payoff statement provided does not reflect payoff amount",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={judgmentHandling.payoffChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...judgmentHandling.payoffChecklist, item]
                        : judgmentHandling.payoffChecklist.filter(
                            (i) => i !== item,
                          );

                      setJudgmentHandling({
                        payoffChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* ================= CONDITION PATH ================= */}
            {judgmentHandling.payoffChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B7 for decision logic B
              </div>
            )}

            {/* ================= SUCCESS PATH ================= */}
            {judgmentHandling.payoffChecklist.length === 0 && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                No discrepancies → Proceed to final screen
              </div>
            )}
          </div>
        )}
        <PopUp
          open={showCreditInventoryPopup}
          title="Navigation Confirmation"
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          onConfirm={handleCreditInventoryConfirm}
          onClose={() => setShowCreditInventoryPopup(false)}
        >
          {/* Message Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium">No child support tradeline found.</p>

            <p className="mt-1">
              Do you want to move to{" "}
              <strong>Credit Inventory (Section-1)</strong>?
            </p>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default JudgmentHandling;
