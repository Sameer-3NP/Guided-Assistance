import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFlowContext } from "../../../store/FlowContext";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";

const TaxLienHandling = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const { taxLienHandling, setTaxLienHandling } = useSectionStore();

  const {
    taxLienDetected,
    lienStatus,
    releasedCreditorName,
    releasedCaseNumber,
    releasedDate,
    losUpdatedForTaxLien,
    releaseDateBeforeAppDate,
    taxLienSourceDocTypes,
    taxLienSourceDocsProvided,
    taxLienAdditionalDocsProvided,
    payoffInFileAvailable,
  } = taxLienHandling;

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!taxLienDetected) {
      toast.error("Please answer Prompt 1.");
      return;
    }

    if (taxLienDetected === "No") {
      navigate("/s5/judgment");
      return;
    }

    navigate("/s5/judgment");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/mortgage-derogatory-event"),
    });
  }, [taxLienDetected]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Tax Lien Handling (Released & Not Released)
        </h2>

        {/* PROMPT 1 */}
        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does Credit Report/Lien and judgment reflect Tax lien ?"
            value={taxLienDetected}
            options={["Yes", "No"]}
            onChange={(v) =>
              setTaxLienHandling({
                taxLienDetected: v,
              })
            }
          />
        </div>

        {/* PROMPT 2 */}
        {taxLienDetected === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <div className="text-md font-medium">
              Is the tax lien released or not released?
            </div>

            {["Released", "Not Released"].map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={lienStatus.includes(option)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...lienStatus, option]
                      : lienStatus.filter((i) => i !== option);

                    setTaxLienHandling({
                      lienStatus: updated,
                    });
                  }}
                />
                {option}
              </label>
            ))}

            {/* ================= RELEASED ================= */}
            {lienStatus.includes("Released") && (
              <div className="space-y-4 border p-4 rounded-xl bg-white">
                {/* Creditor Name */}
                <div>
                  <label className="text-sm font-medium">Creditor Name</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm"
                    value={releasedCreditorName}
                    onChange={(e) =>
                      setTaxLienHandling({
                        releasedCreditorName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Case Number */}
                <div>
                  <label className="text-sm font-medium">Case Number</label>
                  <input
                    className="w-full border rounded-md p-2 text-sm"
                    value={releasedCaseNumber}
                    onChange={(e) =>
                      setTaxLienHandling({
                        releasedCaseNumber: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Released Date */}
                <div>
                  <label className="text-sm font-medium">Released Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 text-sm"
                    value={releasedDate}
                    onChange={(e) =>
                      setTaxLienHandling({
                        releasedDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= NOT RELEASED ================= */}
        {lienStatus.includes("Released") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Is the release date before the application date?"
              value={releaseDateBeforeAppDate}
              options={["Yes", "No"]}
              onChange={(v) =>
                setTaxLienHandling({
                  releaseDateBeforeAppDate: v,
                })
              }
            />

            {releaseDateBeforeAppDate === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to screen 5.5
              </div>
            )}

            {releaseDateBeforeAppDate === "No" && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Proceed to prompt 2b
              </div>
            )}
          </div>
        )}

        {lienStatus.includes("Released") &&
          releaseDateBeforeAppDate === "No" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Has the borrower provided documents in file to verify the source of funds used to pay tax lien?"
                value={taxLienSourceDocsProvided}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setTaxLienHandling({
                    taxLienSourceDocsProvided: v,
                  })
                }
              />

              {taxLienSourceDocsProvided === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition 2 appears as per branch A3 for decision logic A
                </div>
              )}
            </div>
          )}

        {lienStatus.includes("Released") &&
          releaseDateBeforeAppDate === "No" &&
          taxLienSourceDocsProvided === "Yes" && (
            <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
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
                      checked={taxLienSourceDocTypes.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...taxLienSourceDocTypes, doc]
                          : taxLienSourceDocTypes.filter((d) => d !== doc);

                        setTaxLienHandling({
                          taxLienSourceDocTypes: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {taxLienSourceDocTypes.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  If no document selected → Proceed to Prompt 3
                </div>
              )}
            </div>
          )}

        {taxLienSourceDocTypes.includes("Bank statement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-5">
            <div className="text-md font-medium">
              If Bank statement is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Bank statement provided does not reflect borrower’s name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the tax lien and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.bankStatementChecklist2.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.bankStatementChecklist2, item]
                        : taxLienHandling.bankStatementChecklist2.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        bankStatementChecklist2: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.bankStatementChecklist2.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}
          </div>
        )}

        {taxLienSourceDocTypes.includes("Cancelled check/cashier’s check") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Cancelled Check/cashier’s check is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against tax lien.",
                "The check provided reflects payor name different than the borrower’s name which is considered a gift; however, gift documents are missing in file.",
                "Cashier’s check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.cancelledCheckChecklist2.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.cancelledCheckChecklist2, item]
                        : taxLienHandling.cancelledCheckChecklist2.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        cancelledCheckChecklist2: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.cancelledCheckChecklist2.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}
          </div>
        )}

        {taxLienSourceDocTypes.includes("Gift letter") && (
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
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.giftLetterChecklist2.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.giftLetterChecklist2, item]
                        : taxLienHandling.giftLetterChecklist2.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        giftLetterChecklist2: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.giftLetterChecklist2.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition 1 appears as per Branch A3 for decision logic A
              </div>
            )}
          </div>
        )}

        {/* PROMPT 3 */}
        {lienStatus.includes("Not Released") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Has any other supporting document reflecting tax lien has been paid off and released provided by borrower?"
              value={taxLienAdditionalDocsProvided}
              options={["Yes", "No"]}
              onChange={(v) =>
                setTaxLienHandling({
                  taxLienAdditionalDocsProvided: v,
                })
              }
            />

            {taxLienAdditionalDocsProvided === "No" && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Proceed to prompt 4
              </div>
            )}

            {taxLienAdditionalDocsProvided === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to Prompt 3a
              </div>
            )}
          </div>
        )}

        {lienStatus.includes("Not Released") &&
          taxLienAdditionalDocsProvided === "Yes" && (
            <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
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
                      checked={taxLienHandling.additionalDocTypes.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...taxLienHandling.additionalDocTypes, doc]
                          : taxLienHandling.additionalDocTypes.filter(
                              (d) => d !== doc,
                            );

                        setTaxLienHandling({
                          additionalDocTypes: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {taxLienHandling.additionalDocTypes.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  If None selected → Proceed to Prompt 4
                </div>
              )}
            </div>
          )}

        {lienStatus.includes("Not Released") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Is LOS updated for tax lien being paid off at closing?"
              value={losUpdatedForTaxLien}
              options={["Yes", "No"]}
              onChange={(v) =>
                setTaxLienHandling({
                  losUpdatedForTaxLien: v,
                })
              }
            />

            {losUpdatedForTaxLien === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B1 for decision logic B
              </div>
            )}

            {losUpdatedForTaxLien === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                Proceed to Prompt 4a
              </div>
            )}
          </div>
        )}

        {taxLienHandling.additionalDocTypes.includes(
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
                "Letter from creditor reflects pending amount matching with the one reflected on credit report and the same is not acceptable as it should reflect $0 balance.",
                "Letter from creditor is expired and not latest.",
                "Letter from creditor is available reflecting tax lien is released however complete source of funds used to pay off the lien is not available.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.creditorLetterChecklist.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.creditorLetterChecklist, item]
                        : taxLienHandling.creditorLetterChecklist.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        creditorLetterChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.creditorLetterChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {taxLienHandling.additionalDocTypes.includes("Bank statement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Bank statement is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Bank statement provided does not reflect borrower’s name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the tax lien and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
                "Bank statement provided reflects withdrawal towards the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting tax lien is released has not been received.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.bankStatementChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.bankStatementChecklist3, item]
                        : taxLienHandling.bankStatementChecklist3.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        bankStatementChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.bankStatementChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {taxLienHandling.additionalDocTypes.includes(
          "Cancelled check/cashier’s check",
        ) && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Cancelled Check/cashier’s check is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against tax lien.",
                "The check provided reflects payor name different than the borrower’s name which is considered a gift; however, gift documents are missing in file.",
                "Cashier’s check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
                "Cancelled check/cashier’s check provided reflects payment to the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting tax lien is released has not been received.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.cancelledCheckChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.cancelledCheckChecklist3, item]
                        : taxLienHandling.cancelledCheckChecklist3.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        cancelledCheckChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.cancelledCheckChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {taxLienHandling.additionalDocTypes.includes("Gift letter") && (
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
                "Only gift letter is provided along with the bank statement/check reflecting payment made to the creditor however, letter from creditor reflecting tax lien is released is not available.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.giftLetterChecklist3.includes(
                      item,
                    )}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.giftLetterChecklist3, item]
                        : taxLienHandling.giftLetterChecklist3.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        giftLetterChecklist3: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.giftLetterChecklist3.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B2 for decision logic B
              </div>
            )}
          </div>
        )}

        {/* PROMPT 4 */}
        {lienStatus.includes("Not Released") &&
          losUpdatedForTaxLien === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Do we have payoff in file for tax liens getting paid off at closing?"
                value={payoffInFileAvailable}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setTaxLienHandling({
                    payoffInFileAvailable: v,
                  })
                }
              />

              {payoffInFileAvailable === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch B6 for decision logic B
                </div>
              )}

              {payoffInFileAvailable === "Yes" && (
                <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                  Proceed to Prompt 4b
                </div>
              )}
            </div>
          )}

        {payoffInFileAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              Validate the checkpoint to review payoff and select all that
              apply:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Payoff statement provided different case number.",
                "Payoff statement provided different creditor name",
                "Payoff statement is for different borrower.",
                "Payoff statement provided is not the latest copy.",
                "Payoff statement provided does not reflect payoff amount.",
              ].map((item) => (
                <label key={item} className="flex items-centre gap-2">
                  <input
                    type="checkbox"
                    checked={taxLienHandling.payoffChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...taxLienHandling.payoffChecklist, item]
                        : taxLienHandling.payoffChecklist.filter(
                            (i) => i !== item,
                          );

                      setTaxLienHandling({
                        payoffChecklist: updated,
                      });
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {taxLienHandling.payoffChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch B7 for decision logic B
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxLienHandling;
