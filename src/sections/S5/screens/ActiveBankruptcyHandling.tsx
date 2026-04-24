import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS5Store } from "../../../store/useS5Store";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const ActiveBankruptcyHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { activeBankruptcyHandling, setActiveBankruptcyHandling } =
    useS5Store();

  const {
    hasActiveBankruptcy,
    bankruptcyType,
    selectedCase,
    supportingDocument,
  } = activeBankruptcyHandling;

  const caseNumber = selectedCase?.caseNumber;
  const bankruptcyDate = selectedCase?.bankruptcyDate;

  const [showPopup, setShowPopup] = useState(false);

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!hasActiveBankruptcy) {
      toast.error("Please answer Prompt 1.");
      return;
    }

    if (hasActiveBankruptcy === "No") {
      navigate("/s5/bankruptcy-waiting-period");
      return;
    }

    if (!bankruptcyType) {
      toast.error("Please select bankruptcy type.");
      return;
    }

    if (!caseNumber || !bankruptcyDate) {
      toast.error("Please add case number and bankruptcy date.");
      return;
    }

    if (!supportingDocument) {
      toast.error("Please answer supporting document prompt.");
      return;
    }

    if (supportingDocument === "Yes") {
      toast("Alert appears as per Branch 2. Escalate to management.", {
        icon: "⚠️",
      });
    }

    if (supportingDocument === "No") {
      toast.error("Condition appears as per Branch 1.");
    }

    navigate("/s5/bankruptcy-waiting-period");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/child-support"),
    });
  }, [
    hasActiveBankruptcy,
    bankruptcyType,
    caseNumber,
    bankruptcyDate,
    supportingDocument,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Active Bankruptcy Handling
          </h2>
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any active Bankruptcy?"
            value={hasActiveBankruptcy}
            options={["Yes", "No"]}
            onChange={(v) =>
              setActiveBankruptcyHandling({
                hasActiveBankruptcy: v,
              })
            }
          />

          {hasActiveBankruptcy === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
              ✔ Proceed to next screen 5.2
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {hasActiveBankruptcy === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Which bankruptcy is active on credit report?"
              value={bankruptcyType}
              options={[
                "Chapter 7 Bankruptcy",
                "Chapter 13 Bankruptcy",
                "Chapter 11 Bankruptcy",
              ]}
              onChange={(v) => {
                setActiveBankruptcyHandling({
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
          title="Bankruptcy Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Continue"
          onConfirm={() => setShowPopup(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Case Number</label>
              <input
                type="number"
                value={selectedCase?.caseNumber ?? ""}
                onChange={(e) =>
                  setActiveBankruptcyHandling({
                    selectedCase: {
                      ...selectedCase,
                      caseNumber: e.target.value,
                    },
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Bankruptcy Date</label>
              <input
                type="date"
                value={selectedCase?.bankruptcyDate ?? ""}
                onChange={(e) =>
                  setActiveBankruptcyHandling({
                    selectedCase: {
                      ...selectedCase,
                      bankruptcyDate: e.target.value,
                    },
                  })
                }
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>

        {/* PROMPT 2A */}

        {bankruptcyType && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="If Bankruptcy / another supporting document is provided in file?"
              value={supportingDocument}
              options={["Yes", "No"]}
              onChange={(v) =>
                setActiveBankruptcyHandling({
                  supportingDocument: v,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveBankruptcyHandling;
