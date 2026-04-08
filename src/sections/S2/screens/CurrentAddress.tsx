import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import {
  // HelpCircle,
  // CheckCircle,
  // XCircle,
  AlertTriangle,
  MapPin,
  FileCheck,
} from "lucide-react";

const CurrentAddress = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const { currentAddress, setCurrentAddress } = useSectionStore();

  const { addressMatch } = currentAddress;

  const handleContinue = () => {
    if (!addressMatch) {
      toast.error("Please answer the Current Address prompt.");
      return;
    }

    navigate("/s2/current-address-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/core-identity-summary"),
    });
  }, [addressMatch]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Current Address Verification
          </h2>
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <MapPin className="w-5 h-5 text-gray-600" />
            Borrower Address Verification
          </div>

          {/* QUESTION */}
          <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
            {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
            <p className="text-md text-black font-semibold">
              Does the borrower’s current address on the credit report match the
              loan application?
            </p>
          </div>

          {/* OPTIONS */}
          <div className="flex gap-10">
            {["Matches", "Does not match", "Missing"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={addressMatch === opt}
                  onChange={() => setCurrentAddress({ addressMatch: opt })}
                  className="accent-blue-500"
                />

                {/* {opt === "Matches" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}

                {opt === "Does not match" && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}

                {opt === "Missing" && (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )} */}

                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>

          {/* ENGINE FEEDBACK */}
          {addressMatch !== "Matches" && addressMatch !== "Missing" && (
            <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Condition Generated: Address mismatch
            </div>
          )}

          {addressMatch === "Missing" && (
            <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-700">
              <AlertTriangle className="w-4 h-4" />
              Alert : Address missing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentAddress;
