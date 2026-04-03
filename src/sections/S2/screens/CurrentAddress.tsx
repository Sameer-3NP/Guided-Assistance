import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const CurrentAddress = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const [addressMatch, setAddressMatch] = useState<string | null>(null);

  const handleContinue = () => {
    if (!addressMatch) {
      toast.error("Please answer the Current Address prompt.");
      return;
    }

    if (addressMatch !== "Matches") {
      toast("Current Address mismatch or missing. Condition logged.", { icon: "⚠️" });
    }

    navigate("/s2/previous-address");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/core-identity"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressMatch, navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">2.2 Current Address Verification</h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <p className="text-sm font-medium mb-2">
          Does the borrower’s current address on the credit report match the loan application?
        </p>

        <div className="flex gap-4">
          {["Matches", "Does not match", "Missing"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={addressMatch === opt}
                onChange={() => setAddressMatch(opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>

        {addressMatch === "Does not match" && (
           <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700 mt-4">
             Alert: Condition Mismatch Generated
           </div>
        )}

        {addressMatch === "Missing" && (
           <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700 mt-4">
             Alert: Condition Missing Generated
           </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAddress;
