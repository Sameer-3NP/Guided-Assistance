import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../S3/components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";

import { AlertTriangle, FileWarning } from "lucide-react";

const DuplicateTradelineHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { duplicateTradelineHandling, setDuplicateTradelineHandling } =
    useSectionStore();

  const {
    creditorName,
    accountNumber,
    duplicateAccount,
    qualifiesWithBothAccounts,
    creditSupplementAvailable,
    supplementFailures,
  } = duplicateTradelineHandling;

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
    if (!duplicateAccount)
      return toast.error("Please answer the first prompt.");

    if (duplicateAccount === "No") {
      navigate("/s4/past-due");
      return;
    }

    if (!qualifiesWithBothAccounts)
      return toast.error("Please answer prompt 2.");

    if (qualifiesWithBothAccounts === "Yes") {
      navigate("/s4/past-due");
      return;
    }

    if (!creditSupplementAvailable)
      return toast.error("Please answer prompt 2a.");

    if (creditSupplementAvailable === "No") {
      toast.error("Condition appears as per Branch 2");
      return;
    }

    if (supplementFailures.length > 0) {
      toast.error("Condition appears as per Branch 3");
      return;
    }

    navigate("/s4/past-due");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/authorized-user-account"),
    });
  }, [
    duplicateAccount,
    qualifiesWithBothAccounts,
    creditSupplementAvailable,
    supplementFailures,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Duplicate Tradeline Handling
          </h2>
        </div>

        {/* ACCOUNT DETAILS POPUP */}

        <PopUp
          open={showPopup}
          title="Duplicate Account Details"
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
                  setDuplicateTradelineHandling({
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
                  setDuplicateTradelineHandling({
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
            label="Does credit report reflect any duplicate account?"
            value={duplicateAccount}
            options={["Yes", "No"]}
            onChange={(v) =>
              setDuplicateTradelineHandling({
                duplicateAccount: v,
              })
            }
          />

          {duplicateAccount === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
              ✔ Proceed to screen 4.11
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {duplicateAccount === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if borrower qualifies after including both duplicate accounts in LOS?"
              value={qualifiesWithBothAccounts}
              options={["Yes", "No"]}
              onChange={(v) =>
                setDuplicateTradelineHandling({
                  qualifiesWithBothAccounts: v,
                })
              }
            />

            {qualifiesWithBothAccounts === "Yes" && (
              <div className="border border-green-400 bg-green-50 p-3 rounded-2xl text-sm text-green-700">
                ✔ Proceed to screen 4.11
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2a */}

        {qualifiesWithBothAccounts === "No" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if any credit supplement available to exclude the duplicate tradeline?"
              value={creditSupplementAvailable}
              options={["Yes", "No"]}
              onChange={(v) =>
                setDuplicateTradelineHandling({
                  creditSupplementAvailable: v,
                })
              }
            />

            {creditSupplementAvailable === "No" && (
              <div className="border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                Condition appears as per Branch 2
              </div>
            )}
          </div>
        )}

        {/* PROMPT 2b */}

        {creditSupplementAvailable === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="If credit supplement is available, then check if any of the below points fails?"
              options={[
                "Credit supplement received reflects incorrect borrower name, SSN, DOB",
                "Credit supplement provided does not verify that one of the duplicate accounts is deleted.",
                "Credit supplement reflects another tradeline which was not reported on original credit report and after including this payment, ratios will exceed 50%",
              ]}
              values={supplementFailures}
              onChange={(v) =>
                setDuplicateTradelineHandling({
                  supplementFailures: v,
                })
              }
            />

            {supplementFailures.length > 0 && (
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

export default DuplicateTradelineHandling;
