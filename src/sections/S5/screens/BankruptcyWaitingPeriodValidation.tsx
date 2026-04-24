import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS5Store } from "../../../store/useS5Store";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const BankruptcyWaitingPeriodValidation = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { bankruptcyWaitingValidation, setBankruptcyWaitingValidation } =
    useS5Store();

  const {
    hasInactiveBankruptcy,
    bankruptcyType,
    caseNumber,
    dischargedDate,

    waitingPeriod4Years,
    waitingPeriod2Years,

    lenderRequirement,
    bankruptcyDocumentAvailable,

    extenuatingDocuments,

    dismissedOrDischarged,
  } = bankruptcyWaitingValidation;

  const [showPopup, setShowPopup] = useState(false);

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!hasInactiveBankruptcy) {
      toast.error("Please answer Prompt 1.");
      return;
    }

    if (hasInactiveBankruptcy === "No") {
      navigate("/s5/mortgage-derogatory-event");
      return;
    }

    if (!bankruptcyType) {
      toast.error("Please select bankruptcy type.");
      return;
    }

    if (!caseNumber || !dischargedDate) {
      toast.error("Please add bankruptcy case details.");
      return;
    }

    toast.success("Bankruptcy waiting validation completed.");
    navigate("/s5/mortgage-derogatory-event");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/active-bankruptcy"),
    });
  }, [hasInactiveBankruptcy, bankruptcyType, caseNumber, dischargedDate]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold">
            Bankruptcy Waiting Period Validation
          </h2>
        </div>
        {/* PROMPT 1 */}
        <div className="border rounded-xl p-6 bg-gray-50">
          <PromptRadio
            label="Does credit report reflect inactive bankruptcy?"
            value={hasInactiveBankruptcy}
            options={["Yes", "No"]}
            onChange={(v) =>
              setBankruptcyWaitingValidation({
                hasInactiveBankruptcy: v,
              })
            }
          />

          {hasInactiveBankruptcy === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 mt-4 rounded-xl">
              ✔ Proceed to screen 5.3
            </div>
          )}
        </div>
        {/* PROMPT 2 */}
        {hasInactiveBankruptcy === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4 ">
            <PromptRadio
              label="Select bankruptcy type reflected in credit report?"
              value={bankruptcyType}
              options={[
                "Chapter 7 Bankruptcy",
                "Chapter 13 Bankruptcy",
                "Chapter 11 Bankruptcy",
              ]}
              onChange={(v) => {
                setBankruptcyWaitingValidation({
                  bankruptcyType: v,
                });
                setShowPopup(true);
              }}
            />
          </div>
        )}
        {/* POPUP */}
        <PopUp
          open={showPopup}
          title="Bankruptcy Case Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Continue"
          onConfirm={() => setShowPopup(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Case Number</label>
              <input
                type="text"
                value={caseNumber ?? ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setBankruptcyWaitingValidation({
                    caseNumber: value,
                  });
                }}
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Discharged / Dismissed Date
              </label>
              <input
                type="date"
                value={dischargedDate ?? ""}
                onChange={(e) =>
                  setBankruptcyWaitingValidation({
                    dischargedDate: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>
        {/* ---------------- CHAPTER 7 FLOW ---------------- */}
        {bankruptcyType === "Chapter 7 Bankruptcy" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            {/* Prompt 2a */}

            <PromptRadio
              label="Is 4 years waiting period met from estimated closing date and discharged/dismissed date?"
              value={waitingPeriod4Years}
              options={["Yes", "No"]}
              onChange={(v) =>
                setBankruptcyWaitingValidation({
                  waitingPeriod4Years: v,
                })
              }
            />

            {/* Prompt 2b */}

            {waitingPeriod4Years === "Yes" && (
              <div className="space-y-6">
                <PromptRadio
                  label="Check lender requirements if a bankruptcy document is required?"
                  value={lenderRequirement}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      lenderRequirement: v,
                    })
                  }
                />

                {/* Prompt 2c */}

                {lenderRequirement === "Yes" && (
                  <PromptRadio
                    label="Is the Bankruptcy document available in file?"
                    value={bankruptcyDocumentAvailable}
                    options={["Yes", "No"]}
                    onChange={(v) =>
                      setBankruptcyWaitingValidation({
                        bankruptcyDocumentAvailable: v,
                      })
                    }
                  />
                )}

                {/* Alert Branch 8 */}

                {bankruptcyDocumentAvailable === "Yes" && (
                  <div className="border border-yellow-400 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
                    ⚠ Alert appears as per Branch 8. Escalate alert to
                    management for review before proceeding.
                  </div>
                )}

                {/* Condition Branch 1 */}

                {bankruptcyDocumentAvailable === "No" && (
                  <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    ❗ Condition appears as per Branch 1.
                  </div>
                )}
              </div>
            )}

            {/* Prompt 2d */}

            {waitingPeriod4Years === "No" && (
              <div className="space-y-6">
                <PromptRadio
                  label="Is 2 years waiting period met from estimated closing date and discharged/dismissed date?"
                  value={waitingPeriod2Years}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      waitingPeriod2Years: v,
                    })
                  }
                />

                {/* Condition Branch 4 */}

                {waitingPeriod2Years === "No" && (
                  <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    ❗ Condition appears as per Branch 4.
                  </div>
                )}

                {/* Prompt 2e */}

                {waitingPeriod2Years === "Yes" && (
                  <div className="space-y-6">
                    <PromptRadio
                      label="Check if we have received any documents supporting extenuating circumstances?"
                      value={extenuatingDocuments}
                      options={["Yes", "No"]}
                      onChange={(v) =>
                        setBankruptcyWaitingValidation({
                          extenuatingDocuments: v,
                        })
                      }
                    />

                    {/* Alert Branch 9 */}

                    {extenuatingDocuments === "Yes" && (
                      <div className="border border-yellow-400 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
                        ⚠ Alert appears as per Branch 9. Escalate alert to
                        management for review.
                      </div>
                    )}

                    {/* Condition Branch 4 */}

                    {extenuatingDocuments === "No" && (
                      <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                        ❗ Condition appears as per Branch 4.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* ---------------- CHAPTER 13 FLOW ---------------- */}
        {bankruptcyType === "Chapter 13 Bankruptcy" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            {/* Prompt 3a */}

            <PromptRadio
              label="Is Chapter 13 bankruptcy discharged or dismissed?"
              value={dismissedOrDischarged}
              options={["Dismissed", "Discharged"]}
              onChange={(v) =>
                setBankruptcyWaitingValidation({
                  dismissedOrDischarged: v,
                })
              }
            />

            {/* ---------------- DISMISSED FLOW ---------------- */}

            {dismissedOrDischarged === "Dismissed" && (
              <div className="space-y-6">
                {/* Prompt 3b */}

                <PromptRadio
                  label="Have 4 years waiting period met from dismissed date and estimated closing date?"
                  value={waitingPeriod4Years}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      waitingPeriod4Years: v,
                    })
                  }
                />

                {/* Prompt 3c */}

                {waitingPeriod4Years === "Yes" && (
                  <PromptRadio
                    label="Check out lender requirements if a bankruptcy document is required? "
                    value={lenderRequirement}
                    options={["Yes", "No"]}
                    onChange={(v) =>
                      setBankruptcyWaitingValidation({
                        lenderRequirement: v,
                      })
                    }
                  />
                )}

                {/* Condition Branch 3 */}

                {waitingPeriod4Years === "Yes" &&
                  lenderRequirement === "Yes" && (
                    <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                      ❗ Condition appears as per Branch 3
                    </div>
                  )}

                {/* Prompt 3d */}

                {waitingPeriod4Years === "No" && (
                  <div className="space-y-6">
                    <PromptRadio
                      label="Have 2 years waiting period met from dismissed date and estimated closing date?"
                      value={waitingPeriod2Years}
                      options={["Yes", "No"]}
                      onChange={(v) =>
                        setBankruptcyWaitingValidation({
                          waitingPeriod2Years: v,
                        })
                      }
                    />

                    {/* Condition Branch 6 */}

                    {waitingPeriod2Years === "No" && (
                      <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                        ❗ Condition appears as per Branch 6
                      </div>
                    )}

                    {/* Prompt 3e */}

                    {waitingPeriod2Years === "Yes" && (
                      <div className="space-y-6">
                        <PromptRadio
                          label="Check if we have received any documents supporting extenuating circumstances?"
                          value={extenuatingDocuments}
                          options={["Yes", "No"]}
                          onChange={(v) =>
                            setBankruptcyWaitingValidation({
                              extenuatingDocuments: v,
                            })
                          }
                        />

                        {/* Alert Branch 9 */}

                        {extenuatingDocuments === "Yes" && (
                          <div className="border border-yellow-400 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
                            ⚠ Alert appears as per Branch 9. Escalate to
                            management for review.
                          </div>
                        )}

                        {/* Condition Branch 6 */}

                        {extenuatingDocuments === "No" && (
                          <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                            ❗ Condition appears as per Branch 6
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- DISCHARGED FLOW ---------------- */}

            {dismissedOrDischarged === "Discharged" && (
              <div className="space-y-6">
                {/* Prompt 3f */}

                <PromptRadio
                  label="Have 2 years waiting period met from discharged date and estimated closing date?"
                  value={waitingPeriod2Years}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      waitingPeriod2Years: v,
                    })
                  }
                />

                {/* Condition Branch 5 */}

                {waitingPeriod2Years === "No" && (
                  <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    ❗ Condition appears as per Branch 5
                  </div>
                )}

                {/* Prompt 3g */}

                {waitingPeriod2Years === "Yes" && (
                  <div className="space-y-6">
                    <PromptRadio
                      label="Check if we have received any documents supporting extenuating circumstances? "
                      value={lenderRequirement}
                      options={["Yes", "No"]}
                      onChange={(v) =>
                        setBankruptcyWaitingValidation({
                          lenderRequirement: v,
                        })
                      }
                    />

                    {/* Condition Branch 2 */}

                    {lenderRequirement === "Yes" && (
                      <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                        ❗ Condition appears as per Branch 2
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------- CHAPTER 11 FLOW ---------------- */}
        {bankruptcyType === "Chapter 11 Bankruptcy" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            {/* Prompt 4a */}

            <PromptRadio
              label="Is 4 years waiting period met from estimated closing date and discharged/dismissed date?"
              value={waitingPeriod4Years}
              options={["Yes", "No"]}
              onChange={(v) =>
                setBankruptcyWaitingValidation({
                  waitingPeriod4Years: v,
                })
              }
            />

            {/* ---------------- 4 YEARS MET ---------------- */}

            {waitingPeriod4Years === "Yes" && (
              <div className="space-y-6">
                {/* Prompt 4b */}

                <PromptRadio
                  label="Check out lender requirements if a bankruptcy document is required?"
                  value={lenderRequirement}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      lenderRequirement: v,
                    })
                  }
                />

                {/* Prompt 4c */}

                {lenderRequirement === "Yes" && (
                  <PromptRadio
                    label="Is the Bankruptcy document available in file?"
                    value={bankruptcyDocumentAvailable}
                    options={["Yes", "No"]}
                    onChange={(v) =>
                      setBankruptcyWaitingValidation({
                        bankruptcyDocumentAvailable: v,
                      })
                    }
                  />
                )}

                {/* Alert Branch 8 */}

                {bankruptcyDocumentAvailable === "Yes" && (
                  <div className="border border-yellow-400 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
                    ⚠ Alert appears as per Branch 8. Escalate alert to
                    management for review.
                  </div>
                )}

                {/* Condition Branch 10 */}

                {bankruptcyDocumentAvailable === "No" && (
                  <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    ❗ Condition appears as per Branch 10
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 4 YEARS NOT MET ---------------- */}

            {waitingPeriod4Years === "No" && (
              <div className="space-y-6">
                {/* Prompt 4d */}

                <PromptRadio
                  label="Is 2 years waiting period met from estimated closing date and discharged/dismissed date?"
                  value={waitingPeriod2Years}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setBankruptcyWaitingValidation({
                      waitingPeriod2Years: v,
                    })
                  }
                />

                {/* Condition Branch 11 */}

                {waitingPeriod2Years === "No" && (
                  <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    ❗ Condition appears as per Branch 11
                  </div>
                )}

                {/* Prompt 4e */}

                {waitingPeriod2Years === "Yes" && (
                  <div className="space-y-6">
                    <PromptRadio
                      label="Check if we have received any documents supporting extenuating circumstances?"
                      value={extenuatingDocuments}
                      options={["Yes", "No"]}
                      onChange={(v) =>
                        setBankruptcyWaitingValidation({
                          extenuatingDocuments: v,
                        })
                      }
                    />

                    {/* Alert Branch 9 */}

                    {extenuatingDocuments === "Yes" && (
                      <div className="border border-yellow-400 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
                        ⚠ Alert appears as per Branch 9. Escalate alert to
                        management for review.
                      </div>
                    )}

                    {/* Condition Branch 11 */}

                    {extenuatingDocuments === "No" && (
                      <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm text-red-700">
                        ❗ Condition appears as per Branch 11
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankruptcyWaitingPeriodValidation;
