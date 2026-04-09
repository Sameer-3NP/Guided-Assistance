import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import PromptRadio from "../../S3/components/PromptRadio";

import { Phone, AlertCircle } from "lucide-react";

const UtilityTelecomAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { utilityTelecomAccount, setUtilityTelecomAccount } = useSectionStore();

  const { hasUtilityAccount, paymentIncludedInDTI } = utilityTelecomAccount;

  /* ---------- BRANCH RULE ---------- */

  const showPrompt2 = hasUtilityAccount === "Yes";

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!hasUtilityAccount)
      return toast.error("Please answer the first prompt.");

    if (hasUtilityAccount === "No") {
      navigate("/s4/payment-history-recency"); // screen 4.7
      return;
    }

    if (!paymentIncludedInDTI)
      return toast.error("Please answer the second prompt.");

    navigate("/s4/payment-history-recency");
  };

  /* ---------- ACTION REGISTRATION ---------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/excluded-tradeline"),
    });
  }, [hasUtilityAccount, paymentIncludedInDTI]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <Phone className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Utility / Self-Reported / Telecom Account Handling
          </h2>
        </div>

        {/* INSTRUCTION */}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Review the credit report to determine whether any utility,
          self-reported, or telecom accounts are reflected and confirm whether
          their payments are included in the DTI calculation.
        </div>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <PromptRadio
            label="Check if credit report reflects any Utility/Self-reported/Telecom account?"
            value={hasUtilityAccount}
            options={["Yes", "No"]}
            onChange={(v) =>
              setUtilityTelecomAccount({
                hasUtilityAccount: v,
                paymentIncludedInDTI: "",
              })
            }
          />

          {hasUtilityAccount === "No" && (
            <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
              ✔ No Utility/Self-reported/Telecom account reflected.
            </div>
          )}
        </div>

        {/* PROMPT 2 */}

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <PromptRadio
              label="Does payment of Telecom/self-reported/utility account included DTI?"
              value={paymentIncludedInDTI}
              options={["Yes", "No"]}
              onChange={(v) =>
                setUtilityTelecomAccount({
                  paymentIncludedInDTI: v,
                })
              }
            />

            {paymentIncludedInDTI === "No" && (
              <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
                ✔ Payment is not included in DTI. No action required.
              </div>
            )}

            {paymentIncludedInDTI === "Yes" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                Update instruction appears as per Branch 1.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UtilityTelecomAccountHandling;
