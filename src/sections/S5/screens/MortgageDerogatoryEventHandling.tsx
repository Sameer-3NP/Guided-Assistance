import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";
import PromptRadio from "../../../components/PromptRadio";

const MortgageDerogatoryEventHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const {
    mortgageDerogatoryEventHandling,
    setMortgageDerogatoryEventHandling,
  } = useSectionStore();

  const {
    derogatoryTypes,
    selectedAccount,
    foreclosureDocsAvailable,
    foreclosureDocTypes,
    accounts,
    trusteesDeedChecklist,
    propertyProfileChecklist,
    foreclosureWaitingPeriod,
    preForeclosureDocsAvailable,
    preForeclosureDocTypes,
    shortSaleChecklist,
    settlementChecklist,
    propertyProfileChecklistB,
    preForeclosureWaitingPeriod,
    chargeOffDocsAvailable,
    chargeOffDocTypes,
    cancellationChecklist,
    lenderLetterChecklist,
    chargeOffWaitingPeriod,
  } = mortgageDerogatoryEventHandling;

  const [showPopup, setShowPopup] = useState(false);

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    /* ---------------- PROMPT 1 CHECK ---------------- */

    if (!derogatoryTypes || derogatoryTypes.length === 0) {
      navigate("/s5/tax-lien");
      return;
    }

    /* ---------------- ACCOUNT CHECK (global) ---------------- */

    if (!selectedAccount?.accountNumber) {
      toast.error("Please add account number and name.");
      return;
    }

    /* =======================================================
     FORECLOSURE FLOW (Decision Logic A)
  ======================================================= */

    if (derogatoryTypes.includes("Foreclosure")) {
      if (!foreclosureDocsAvailable) {
        toast.error("Please answer Prompt 2.");
      }

      if (foreclosureDocsAvailable === "No") {
        toast.error("Condition appears as per Branch 4 of decision logic A");
      }

      // TRUSTEE DEED CHECKLIST
      if (foreclosureDocTypes.includes("Trustee’s deed")) {
        if (trusteesDeedChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic A");
        }
      }

      // PROPERTY PROFILE CHECKLIST
      if (foreclosureDocTypes.includes("Property Profile")) {
        if (propertyProfileChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic A");
        }
      }

      // WAITING PERIOD 7 YEARS
      if (
        foreclosureDocsAvailable === "Yes" &&
        foreclosureDocTypes.length > 0 &&
        trusteesDeedChecklist.length === 0 &&
        propertyProfileChecklist.length === 0
      ) {
        if (!foreclosureWaitingPeriod) {
          toast.error("Please answer Prompt 2d.");
        }

        if (foreclosureWaitingPeriod === "No") {
          toast.error("Condition appears as per Branch 3 for decision logic A");
        }
      }
    }

    /* =======================================================
     PRE-FORECLOSURE FLOW (Decision Logic B)
  ======================================================= */

    if (
      derogatoryTypes.includes("Pre-Foreclosure / Short Sale / Deed-in-Lieu")
    ) {
      if (!preForeclosureDocsAvailable) {
        toast.error("Please answer Prompt 3.");
        return;
      }

      if (preForeclosureDocsAvailable === "No") {
        toast.error("Condition appears as per Branch 4 for decision logic B");
      }

      // SHORT SALE CHECKLIST
      if (preForeclosureDocTypes.includes("Short Sale Approval Letter")) {
        if (shortSaleChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic B");
          return;
        }
      }

      // SETTLEMENT CHECKLIST
      if (
        preForeclosureDocTypes.includes(
          "Settlement Statement (HUD-1 / Closing Disclosure)",
        )
      ) {
        if (settlementChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic B");
          return;
        }
      }

      // PROPERTY PROFILE CHECKLIST
      if (preForeclosureDocTypes.includes("Property Profile")) {
        if (propertyProfileChecklistB.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic B");
          return;
        }
      }

      // WAITING PERIOD 4 YEARS
      if (
        preForeclosureDocsAvailable === "Yes" &&
        preForeclosureDocTypes.length > 0 &&
        shortSaleChecklist.length === 0 &&
        settlementChecklist.length === 0 &&
        propertyProfileChecklistB.length === 0
      ) {
        if (!preForeclosureWaitingPeriod) {
          toast.error("Please answer Prompt 3e.");
          return;
        }

        if (preForeclosureWaitingPeriod === "No") {
          toast.error("Condition appears as per Branch 3 for decision logic B");
        }
      }
    }

    /* =======================================================
     MORTGAGE CHARGE-OFF FLOW (Decision Logic C)
  ======================================================= */

    if (derogatoryTypes.includes("Mortgage Charge-Off")) {
      if (!chargeOffDocsAvailable) {
        toast.error("Please answer Prompt 4.");
        return;
      }

      if (chargeOffDocsAvailable === "No") {
        toast.error("Condition appears as per Branch 4 for decision logic C");
      }

      // CANCELLATION OF DEBT CHECKLIST
      if (chargeOffDocTypes.includes("Cancellation of debt")) {
        if (cancellationChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic C");
          return;
        }
      }

      // LENDER LETTER CHECKLIST
      if (chargeOffDocTypes.includes("Lender Letter Confirming disposition")) {
        if (lenderLetterChecklist.length > 0) {
          toast.error("Condition appears as per Branch 2 for decision logic C");
          return;
        }
      }

      // WAITING PERIOD 4 YEARS
      if (
        chargeOffDocsAvailable === "Yes" &&
        chargeOffDocTypes.length > 0 &&
        cancellationChecklist.length === 0 &&
        lenderLetterChecklist.length === 0
      ) {
        if (!chargeOffWaitingPeriod) {
          toast.error("Please answer Prompt 4d.");
          return;
        }

        if (chargeOffWaitingPeriod === "No") {
          toast.error("Condition appears as per Branch 3 for decision logic C");
        }
      }
    }

    /* ---------------- FINAL SUCCESS ---------------- */

    toast.success("Proceeding to next screen 5.4");
    navigate("/s5/tax-lien");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/bankruptcy-waiting-period"),
    });
  }, [derogatoryTypes, selectedAccount]);

  /* ---------------- TOGGLE CHECKBOX ---------------- */

  const toggleType = (type) => {
    const exists = derogatoryTypes.includes(type);

    let updated;

    if (exists) {
      updated = derogatoryTypes.filter((t) => t !== type);
    } else {
      updated = [...derogatoryTypes, type];
    }

    setMortgageDerogatoryEventHandling({
      derogatoryTypes: updated,
    });

    if (updated.length > 0) setShowPopup(true);
  };

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Mortgage Derogatory Event Handling
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <div className=" bg-blue-100 p-3 rounded-xl text-md text-black font-semibold">
            Does credit report reflect any mortgage with the keywords below?
            (Select all that apply)
          </div>

          <div className="space-y-3 text-sm">
            {[
              "Foreclosure",
              "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
              "Mortgage Charge-Off",
            ].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={derogatoryTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            ))}
          </div>

          {derogatoryTypes.length === 0 && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ Proceed to next screen 5.4
            </div>
          )}
        </div>

        {/* PROMPT 2 */}
        {derogatoryTypes.includes("Foreclosure") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if we have any documents available in file to validate the property associated with the mortgage?"
              value={foreclosureDocsAvailable}
              options={["Yes", "No"]}
              onChange={(v) =>
                setMortgageDerogatoryEventHandling({
                  foreclosureDocsAvailable: v,
                })
              }
            />

            {foreclosureDocsAvailable === "No" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 4 of decision logic A
              </div>
            )}
          </div>
        )}

        {derogatoryTypes.includes("Foreclosure") &&
          foreclosureDocsAvailable === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <div className=" bg-blue-100 p-3 rounded-xl text-md text-black font-semibold">
                What documents are available in file? (Select all that apply)
              </div>

              <div className="space-y-3 text-sm">
                {["Trustee’s deed", "Property Profile"].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={foreclosureDocTypes.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...foreclosureDocTypes, doc]
                          : foreclosureDocTypes.filter((d) => d !== doc);

                        setMortgageDerogatoryEventHandling({
                          foreclosureDocTypes: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {/* ACCOUNT DROPDOWN */}

              {accounts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select account number/name
                  </label>

                  <select
                    className="border rounded-md p-2 text-sm w-full"
                    value={selectedAccount?.accountNumber || ""}
                    onChange={(e) =>
                      setMortgageDerogatoryEventHandling({
                        selectedAccount: accounts.find(
                          (acc) => acc.accountNumber === e.target.value,
                        ),
                      })
                    }
                  >
                    <option value="">Select account</option>

                    {accounts.map((acc) => (
                      <option key={acc.accountNumber} value={acc.accountNumber}>
                        {acc.creditorName} - {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* NONE SELECTED ALERT */}

              {foreclosureDocTypes.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  Alert appears as per Branch 5 and alert will have the option
                  to escalate it to management review.
                </div>
              )}
            </div>
          )}

        {foreclosureDocTypes.includes("Trustee’s deed") && (
          <div className="border space-y-6  bg-blue-50 p-6 rounded-xl text-md text-black font-semibold">
            <div className="text-sm font-medium">
              If Trustee’s deed is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name does not match tradeline hence clarification is required",
                "Property addresses is not available.",
                "High Balance on tradeline does not match the amount mentioned on trustee's deed.",
                "Document is not executed/notarized (if applicable)",
                "Disposition / recording / transfer date is not clearly identifiable",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={trusteesDeedChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...trusteesDeedChecklist, item]
                        : trusteesDeedChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        trusteesDeedChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {trusteesDeedChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic A
              </div>
            )}
          </div>
        )}

        {foreclosureDocTypes.includes("Property Profile") && (
          <div className="border space-y-6  bg-blue-50 p-6 rounded-xl text-md text-black font-semibold">
            <div className="text-sm font-medium">
              If Property profile is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name does not match tradeline",
                "Property addresses is not available.",
                "High Balance on tradeline does not match the amount mentioned on property profile as mortgage amount/loan amount.",
                "Disposition / recording / transfer date not clearly identifiable",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={propertyProfileChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...propertyProfileChecklist, item]
                        : propertyProfileChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        propertyProfileChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {propertyProfileChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic A
              </div>
            )}
          </div>
        )}

        {derogatoryTypes.includes("Foreclosure") &&
          foreclosureDocsAvailable === "Yes" &&
          (foreclosureDocTypes.includes("Trustee’s deed") ||
            foreclosureDocTypes.includes("Property Profile")) &&
          trusteesDeedChecklist.length === 0 &&
          propertyProfileChecklist.length === 0 && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="From the available document, has the waiting period of 7 years met?"
                value={foreclosureWaitingPeriod}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    foreclosureWaitingPeriod: v,
                  })
                }
              />

              {foreclosureWaitingPeriod === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch 3 for decision logic A
                </div>
              )}
            </div>
          )}

        {derogatoryTypes.includes(
          "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
        ) &&
          foreclosureWaitingPeriod === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Check if we have any documents available in file to validate the property associated with the mortgage?"
                value={preForeclosureDocsAvailable}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    preForeclosureDocsAvailable: v,
                  })
                }
              />

              {preForeclosureDocsAvailable === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch 4 for decision logic B
                </div>
              )}
            </div>
          )}

        {derogatoryTypes.includes(
          "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
        ) &&
          preForeclosureDocsAvailable === "Yes" && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <div className=" bg-blue-100 p-3 rounded-xl text-md text-black font-semibold">
                What documents are available in file? (Select all that apply)
              </div>

              <div className="space-y-3 text-sm">
                {[
                  "Short Sale Approval Letter",
                  "Settlement Statement (HUD-1 / Closing Disclosure)",
                  "Property Profile",
                ].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preForeclosureDocTypes.includes(doc)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...preForeclosureDocTypes, doc]
                          : preForeclosureDocTypes.filter((d) => d !== doc);

                        setMortgageDerogatoryEventHandling({
                          preForeclosureDocTypes: updated,
                        });
                      }}
                    />
                    {doc}
                  </label>
                ))}
              </div>

              {/* ACCOUNT DROPDOWN */}

              {accounts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select account number/name
                  </label>

                  <select
                    className="border rounded-md p-2 text-sm w-full"
                    value={selectedAccount?.accountNumber || ""}
                    onChange={(e) =>
                      setMortgageDerogatoryEventHandling({
                        selectedAccount: accounts.find(
                          (acc) => acc.accountNumber === e.target.value,
                        ),
                      })
                    }
                  >
                    <option value="">Select account</option>

                    {accounts.map((acc) => (
                      <option key={acc.accountNumber} value={acc.accountNumber}>
                        {acc.creditorName} - {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ALERT */}

              {preForeclosureDocTypes.length === 0 && (
                <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                  Alert appears as per Branch 5 for decision logic B and alert
                  will have the option to escalate it to management review.
                </div>
              )}
            </div>
          )}

        {preForeclosureDocTypes.includes("Short Sale Approval Letter") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="rounded-xl text-md text-black font-semibold">
              If Short Sale Approval letter is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name on short sale letter do not match tradeline",
                "Property addresses is not available.",
                "Document is not executed/notarized (if applicable)",
                "Short sale / recording / transfer date not clearly identifiable",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shortSaleChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...shortSaleChecklist, item]
                        : shortSaleChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        shortSaleChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {shortSaleChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic B
              </div>
            )}
          </div>
        )}

        {preForeclosureDocTypes.includes(
          "Settlement Statement (HUD-1 / Closing Disclosure)",
        ) && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="rounded-xl text-md text-black font-semibold">
              If settlement Statement (HUD-1 / Closing Disclosure) is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name on closing disclosure on seller side does not match tradeline",
                "Property addresses is not available.",
                "Document is not executed (if applicable)",
                "Disposition/ closing date not clearly identifiable",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settlementChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...settlementChecklist, item]
                        : settlementChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        settlementChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {settlementChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic B
              </div>
            )}
          </div>
        )}

        {preForeclosureDocTypes.includes("Property Profile") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className=" text-md text-black font-semibold">
              If Property profile is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name does not match tradeline",
                "Property addresses is not available.",
                "Disposition / recording / transfer date not clearly identifiable",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={propertyProfileChecklistB.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...propertyProfileChecklistB, item]
                        : propertyProfileChecklistB.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        propertyProfileChecklistB: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {propertyProfileChecklistB.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic B
              </div>
            )}
          </div>
        )}

        {preForeclosureDocsAvailable === "Yes" &&
          preForeclosureDocTypes.length > 0 &&
          shortSaleChecklist.length === 0 &&
          settlementChecklist.length === 0 &&
          propertyProfileChecklistB.length === 0 && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="From the available document, has the waiting period of 4 years met?"
                value={preForeclosureWaitingPeriod}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    preForeclosureWaitingPeriod: v,
                  })
                }
              />

              {preForeclosureWaitingPeriod === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch 3 for decision logic B
                </div>
              )}
            </div>
          )}

        {/* PROMPT 4 */}
        {derogatoryTypes.includes("Mortgage Charge-Off") &&
          derogatoryTypes.length > 1 && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="Check if we have any documents available in file to validate the property associated with the mortgage?"
                value={chargeOffDocsAvailable}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    chargeOffDocsAvailable: v,
                  })
                }
              />

              {chargeOffDocsAvailable === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch 4 for decision logic C
                </div>
              )}
            </div>
          )}

        {chargeOffDocsAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              What documents are available in file? (Select all that apply)
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Cancellation of debt",
                "Lender Letter Confirming disposition",
              ].map((doc) => (
                <label key={doc} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={chargeOffDocTypes.includes(doc)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...chargeOffDocTypes, doc]
                        : chargeOffDocTypes.filter((d) => d !== doc);

                      setMortgageDerogatoryEventHandling({
                        chargeOffDocTypes: updated,
                      });
                    }}
                  />
                  {doc}
                </label>
              ))}
            </div>

            {/* ACCOUNT DROPDOWN */}

            {accounts.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select account number/name
                </label>

                <select
                  className="border rounded-md p-2 text-sm w-full"
                  value={selectedAccount?.accountNumber || ""}
                  onChange={(e) =>
                    setMortgageDerogatoryEventHandling({
                      selectedAccount: accounts.find(
                        (acc) => acc.accountNumber === e.target.value,
                      ),
                    })
                  }
                >
                  <option value="">Select account</option>

                  {accounts.map((acc) => (
                    <option key={acc.accountNumber} value={acc.accountNumber}>
                      {acc.creditorName} - {acc.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ALERT */}

            {chargeOffDocTypes.length === 0 && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-700">
                Alert appears as per Branch 5 for decision logic C and alert
                will have the option to escalate it to management review.
              </div>
            )}
          </div>
        )}

        {chargeOffDocTypes.includes("Cancellation of debt") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If Cancellation of debt is available:
            </div>
            <div className="space-y-3 text-sm">
              {[
                "Party name i.e creditor name and account number on 1099-C does not matches tradeline",
                "Property addresses are not available.",
                "Date of identifiable event not clearly identifiable",
                "Debt Description does not reflect Mortgage",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cancellationChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...cancellationChecklist, item]
                        : cancellationChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        cancellationChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {cancellationChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic C
              </div>
            )}
          </div>
        )}

        {chargeOffDocTypes.includes("Lender Letter Confirming disposition") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="text-md font-medium">
              If lender letter confirming disposition is available:
            </div>

            <div className="space-y-3 text-sm">
              {[
                "Party name i.e lender name on document available does not matches tradeline",
                "Property addresses is not available.",
                "Document is not executed/notarized (if applicable)",
                "Recording / transfer date not clearly identifiable",
                "No information provided for Debt cancelled account",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lenderLetterChecklist.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...lenderLetterChecklist, item]
                        : lenderLetterChecklist.filter((i) => i !== item);

                      setMortgageDerogatoryEventHandling({
                        lenderLetterChecklist: updated,
                      });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>

            {lenderLetterChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Condition appears as per Branch 2 for decision logic C
              </div>
            )}
          </div>
        )}

        {chargeOffDocsAvailable === "Yes" &&
          chargeOffDocTypes.length > 0 &&
          cancellationChecklist.length === 0 &&
          lenderLetterChecklist.length === 0 && (
            <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
              <PromptRadio
                label="From the available document, has the waiting period of 4 years met?"
                value={chargeOffWaitingPeriod}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    chargeOffWaitingPeriod: v,
                  })
                }
              />

              {chargeOffWaitingPeriod === "No" && (
                <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                  Condition appears as per Branch 3 for decision logic C
                </div>
              )}
            </div>
          )}

        {/* POPUP */}

        <PopUp
          open={showPopup}
          title="Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Continue"
          onConfirm={() => setShowPopup(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Creditor Name</label>
              <input
                type="text"
                value={selectedAccount?.creditorName ?? ""}
                onChange={(e) =>
                  setMortgageDerogatoryEventHandling({
                    selectedAccount: {
                      ...selectedAccount,
                      creditorName: e.target.value,
                    },
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="text"
                value={selectedAccount?.accountNumber ?? ""}
                onChange={(e) =>
                  setMortgageDerogatoryEventHandling({
                    selectedAccount: {
                      ...selectedAccount,
                      accountNumber: e.target.value,
                    },
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default MortgageDerogatoryEventHandling;
