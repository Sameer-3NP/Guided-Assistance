import { useState, useEffect, useMemo } from "react";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  // AlertTriangle,
  Clipboard,
  CheckCircle,
  FileWarning,
} from "lucide-react";

const CurrentAddressSummary = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();
  const [copiedConditions, setCopiedConditions] = useState<string[]>([]);

  const { currentAddress, currentAddressSummary, setCurrentAddressSummary } =
    useSectionStore();

  const { addressMatch } = currentAddress;

  const { conditions: raisedConditions } = currentAddressSummary;

  const conditions = useMemo(() => {
    const list: string[] = [];

    if (addressMatch === "Does not match") {
      list.push(
        "Credit report reflects borrower’s current address as [[Address on Credit Report]]. Address does not match the loan application.",
      );
    }

    if (addressMatch === "Missing") {
      list.push(
        "Credit report does not reflect borrower’s current address. Address verification required.",
      );
    }

    return list;
  }, [addressMatch]);

  const toggleCondition = (cond: string) => {
    const updated = raisedConditions.includes(cond)
      ? raisedConditions.filter((c) => c !== cond)
      : [...raisedConditions, cond];

    setCurrentAddressSummary({
      conditions: updated,
    });
  };

  const allConditionsRaised = conditions.every((c) =>
    raisedConditions.includes(c),
  );

  const handleContinue = () => {
    if (conditions.length > 0 && !allConditionsRaised) {
      toast.error("Please mark condition as raised.");
      return;
    }

    navigate("/s2/previous-address");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/current-address"),
    });
  }, [raisedConditions]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-500" />
        Current Address Review Summary
      </h2>

      {/* CONDITIONS */}
      {conditions.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-red-700 font-semibold">
            <FileWarning className="w-5 h-5" />
            Conditions
          </h3>

          {conditions.map((condition) => (
            <div
              key={condition}
              className="bg-white border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-700">{condition}</p>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(condition);
                    toast.success("Copied to LOS");

                    if (!copiedConditions.includes(condition)) {
                      setCopiedConditions((prev) => [...prev, condition]);
                    }
                  }}
                  className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  <Clipboard className="w-3 h-3" />
                  Copy
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={raisedConditions.includes(condition)}
                  disabled={!copiedConditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                  title="Do Copy to LOS before raising condition"
                  className="accent-red-500 disabled:opacity-40"
                />
                Condition Raised
              </label>
            </div>
          ))}
        </div>
      )}

      {/* If everything fine */}
      {conditions.length === 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow-sm text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="text-lg font-semibold text-green-700 mb-2">
            No Issues Found
          </h3>

          <p className="text-sm text-gray-600">
            All the verification step is completed successfully without raising
            any issue
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentAddressSummary;
