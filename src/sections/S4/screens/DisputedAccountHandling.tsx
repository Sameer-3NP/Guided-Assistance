import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import PromptRadio from "../../../components/PromptRadio";

import { FileCheck, FileWarning, FileSearch } from "lucide-react";

import PopUp from "../../../components/PopUp";
import ConditionBanner from "../../../components/ConditionBanner";

const DisputedAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { disputedHandling, setDisputedHandling } = useS4Store();

  const {
    hasDispute,
    ausEligible,
    disputeDueToAccount,
    accountName,
    accountNumber,
    supplementAvailable,
    checklist,
  } = disputedHandling;

  const [showPopup, setShowPopup] = useState(true);

  const checklistItems = [
    "Credit supplement reflects incorrect borrower name.",
    "Credit supplement reflects incorrect borrower SSN",
    "Credit supplements reflect an incorrect date of birth.",
    "Credit supplement reflect the tradeline still in dispute and not resolved.",
    "Credit supplement reflect additional tradeline which was not reported on original credit report and after including the payment in DTI ratios will exceed the 50%",
    "Credit supplement is not the latest but reflects dispute has been removed. Updated credit supplement is required.",
  ];

  /* ---------- BRANCH VISIBILITY ---------- */

  const showPrompt2 = hasDispute === "Yes";
  const showPrompt3 = showPrompt2 && ausEligible === "No";
  const showPrompt3a = showPrompt3 && disputeDueToAccount === "Yes";
  const showPrompt3b = showPrompt3a && supplementAvailable === "Yes";

  /* ---------- POPUP SAVE ---------- */

  const handleAccountSave = () => {
    if (!accountName || !accountNumber) {
      toast.error("Please enter account name and number.");
      return;
    }

    setShowPopup(false);
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!hasDispute) return toast.error("Please answer the first prompt.");

    if (hasDispute === "No") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!ausEligible) return toast.error("Please confirm AUS recommendation.");

    if (ausEligible === "Yes") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!disputeDueToAccount)
      return toast.error("Please review DU/LPA recommendation.");

    if (disputeDueToAccount === "No") {
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (!accountName || !accountNumber)
      return toast.error("Please update disputed account details.");

    if (!supplementAvailable)
      return toast.error("Please confirm credit supplement availability.");

    if (supplementAvailable === "No") {
      toast.error("Condition appears as per Branch 2.");
      navigate("/s4/excluded-tradeline");
      return;
    }

    if (supplementAvailable === "Yes" && checklist?.length > 0) {
      toast.error("Condition appears as per Branch 3.");
    }

    navigate("/s4/excluded-tradeline");
  };

  /* ---------- REGISTER FLOW ---------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/collection-account"),
    });
  }, [
    hasDispute,
    ausEligible,
    disputeDueToAccount,
    supplementAvailable,
    checklist,
  ]);

  /* ---------- CHECKLIST HANDLER ---------- */

  const toggleChecklist = (item: string) => {
    const updated = checklist.includes(item)
      ? checklist.filter((i: string) => i !== item)
      : [...checklist, item];

    setDisputedHandling({ checklist: updated });
  };

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Disputed Account Handling
          </h2>
        </div>

        {/* INSTRUCTION */}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Review disputed accounts and determine whether they impact the AUS
          recommendation or require underwriting conditions.
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any active disputed account?"
            value={hasDispute}
            options={["Yes", "No"]}
            onChange={(v) => setDisputedHandling({ hasDispute: v })}
          />
        </div>

        {/* PROMPT 2 */}

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Does AUS give Approve/Eligible or Accept/Eligible?"
              value={ausEligible}
              options={["Yes", "No"]}
              onChange={(v) => setDisputedHandling({ ausEligible: v })}
            />
          </div>
        )}

        {/* PROMPT 3 */}

        {showPrompt3 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Review DU/LPA and check if ineligible/refer recommendations are due to disputed accounts?"
              value={disputeDueToAccount}
              options={["Yes", "No"]}
              onChange={(v) => {
                setDisputedHandling({ disputeDueToAccount: v });

                if (v === "Yes") {
                  setShowPopup(true);
                }
              }}
            />
          </div>
        )}

        {/* POPUP FOR ACCOUNT UPDATE */}

        <PopUp
          open={showPopup}
          title="Update Disputed Account"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Save"
          onClose={() => setShowPopup(false)}
          onConfirm={handleAccountSave}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Account Name"
              value={accountName ?? ""}
              name="fullname"
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                setDisputedHandling({ accountName: value });
              }}
              className="w-full border rounded-md p-2 text-sm"
            />

            <input
              type="number"
              placeholder="Account Number"
              value={accountNumber ?? ""}
              onChange={(e) =>
                setDisputedHandling({ accountNumber: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
        </PopUp>

        {/* PROMPT 3A */}

        {showPrompt3a && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Has borrower provided updated credit supplement removing dispute?"
              value={supplementAvailable}
              options={["Yes", "No"]}
              onChange={(v) => setDisputedHandling({ supplementAvailable: v })}
            />

            {supplementAvailable === "No" && (
              <ConditionBanner
                type="condition"
                message={" Condition appears as per Branch 2."}
              />
            )}
          </div>
        )}

        {/* PROMPT 3B */}

        {showPrompt3b && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <FileSearch className="w-4 h-4" />
              Credit Supplement Validation
            </div>

            {checklistItems.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checklist?.includes(item)}
                  onChange={() => toggleChecklist(item)}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}

            {checklist?.length > 0 && (
              <ConditionBanner
                type="condition"
                message={"Condition appear as per branch 3"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputedAccountHandling;
