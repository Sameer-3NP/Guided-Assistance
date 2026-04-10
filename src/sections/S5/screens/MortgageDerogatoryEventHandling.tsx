import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";
import { MortgageConstants } from "../constants/MortgageConstants";

import { AlertTriangle, FileWarning } from "lucide-react";

const MortgageDerogatoryEventHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const {
    mortgageDerogatoryEventHandling,
    setMortgageDerogatoryEventHandling,
  } = useSectionStore();

  const {
    derogatoryTypes,
    foreclosureDocsAvailable,
    foreclosureDocTypes,
    preForeclosureDocsAvailable,
    chargeOffDocsAvailable,
    trusteesDeedChecklist,
    propertyProfileChecklist,
    shortSaleChecklist,
    settlementChecklist,
    cancellationChecklist,
    lenderLetterChecklist,
    foreclosureWaitingPeriod,
    preForeclosureWaitingPeriod,
    chargeOffWaitingPeriod,
  } = mortgageDerogatoryEventHandling;

  const [showPopup, setShowPopup] = useState(false);

  /* CONTINUE */

  const handleContinue = () => {
    if (derogatoryTypes.length === 0) {
      navigate("/s5/collections");
      return;
    }

    toast.success("Mortgage derogatory event validated.");
    navigate("/s5/collections");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/bankruptcy-waiting"),
    });
  }, [derogatoryTypes]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl border shadow-sm space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold">
            Mortgage Derogatory Event Handling
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <CheckboxGroup
            label="Does credit report reflect any mortgage with the keywords below?"
            options={[
              "Foreclosure",
              "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
              "Mortgage Charge-Off",
            ]}
            values={derogatoryTypes}
            onChange={(v) =>
              setMortgageDerogatoryEventHandling({
                derogatoryTypes: v,
              })
            }
          />

          {derogatoryTypes.length === 0 && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ Proceed to next screen 5.4
            </div>
          )}

          {derogatoryTypes.length > 0 && (
            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-400 text-white px-3 py-1 rounded-xl"
            >
              Add Account
            </button>
          )}
        </div>

        {/* POPUP */}

        <PopUp
          open={showPopup}
          title="Add Mortgage Account"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Continue"
          onConfirm={() => setShowPopup(false)}
        >
          <AccountForm />
        </PopUp>

        {/* FORECLOSURE FLOW */}

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
              <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm">
                Condition appears as per Branch 4 of decision logic A
              </div>
            )}

            {foreclosureDocsAvailable === "Yes" && (
              <CheckboxGroup
                label="What documents are available in file?"
                options={["Trustee’s deed", "Property Profile"]}
                values={foreclosureDocTypes}
                onChange={(v) =>
                  setMortgageDerogatoryEventHandling({
                    foreclosureDocTypes: v,
                  })
                }
              />
            )}
          </div>
        )}

        {foreclosureDocTypes.includes("Trustee’s deed") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <CheckboxGroup
              label="If Trustee’s deed is available:"
              options={MortgageConstants.trusteesDeedOptions}
              values={trusteesDeedChecklist}
              onChange={(v) =>
                setMortgageDerogatoryEventHandling({
                  trusteesDeedChecklist: v,
                })
              }
            />

            {trusteesDeedChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
                Condition appears as per Branch 2 for decision logic A
              </div>
            )}
          </div>
        )}

        {/* PRE FORECLOSURE FLOW */}

        {derogatoryTypes.includes(
          "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
        ) && (
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
              <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm">
                Condition appears as per Branch 4 for decision logic B
              </div>
            )}
          </div>
        )}

        {foreclosureDocTypes.includes("Property Profile") && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <CheckboxGroup
              label="If Property profile is available:"
              options={MortgageConstants.propertyProfileOptions}
              values={propertyProfileChecklist}
              onChange={(v) =>
                setMortgageDerogatoryEventHandling({
                  propertyProfileChecklist: v,
                })
              }
            />

            {propertyProfileChecklist.length > 0 && (
              <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
                Condition appears as per Branch 2 for decision logic A
              </div>
            )}
          </div>
        )}

        {foreclosureDocsAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
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
              <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
                Condition appears as per Branch 3 for decision logic A
              </div>
            )}
          </div>
        )}

        <CheckboxGroup
          label="If Short Sale Approval Letter is available:"
          options={MortgageConstants.shortSaleOptions}
          values={shortSaleChecklist}
          onChange={(v) =>
            setMortgageDerogatoryEventHandling({
              shortSaleChecklist: v,
            })
          }
        />

        {shortSaleChecklist.length > 0 && (
          <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
            Condition appears as per Branch 2 for decision logic B
          </div>
        )}

        <CheckboxGroup
          label="If Settlement Statement is available:"
          options={MortgageConstants.settlementOptions}
          values={settlementChecklist}
          onChange={(v) =>
            setMortgageDerogatoryEventHandling({
              settlementChecklist: v,
            })
          }
        />

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
          <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
            Condition appears as per Branch 3 for decision logic B
          </div>
        )}

        {/* CHARGE OFF FLOW */}

        {derogatoryTypes.includes("Mortgage Charge-Off") && (
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
              <div className="border border-red-400 bg-red-50 rounded-xl p-4 text-sm">
                Condition appears as per Branch 4 for decision logic C
              </div>
            )}
          </div>
        )}
        <CheckboxGroup
          label="If Cancellation of debt is available:"
          options={MortgageConstants.cancellationOptions}
          values={cancellationChecklist}
          onChange={(v) =>
            setMortgageDerogatoryEventHandling({
              cancellationChecklist: v,
            })
          }
        />
        <CheckboxGroup
          label="If lender letter confirming disposition is available:"
          options={MortgageConstants.lenderLetterOptions}
          values={lenderLetterChecklist}
          onChange={(v) =>
            setMortgageDerogatoryEventHandling({
              lenderLetterChecklist: v,
            })
          }
        />
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
          <div className="border border-red-400 bg-red-50 rounded-xl p-3 text-sm">
            Condition appears as per Branch 3 for decision logic C
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageDerogatoryEventHandling;

/* ACCOUNT FORM */

const AccountForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Creditor Name</label>
        <input type="text" className="w-full border rounded-xl p-2 text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium">Account Number</label>
        <input type="number" className="w-full border rounded-xl p-2 text-sm" />
      </div>
    </div>
  );
};
