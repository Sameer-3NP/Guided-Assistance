import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import { MapPin, FileCheck } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

type CurrentAddressState = {
  addressMatch: string | null;
};

const buildAddressMessage = (value: string | null) => {
  if (!value || value === "Matches") return "";

  if (value === "Does not match") {
    return `Credit report reflects borrower’s current address as [[Street Address, City, State, Zip]] which does not match the current address reflected in the loan application as [[Street Address, City, State, Zip]]. Please provide an updated credit report reflecting the correct current address.`;
  }

  if (value === "Missing") {
    return `Current address on credit report is missing and same is required. Please provide updated credit reflecting current address`;
  }
  return "";
};

const CurrentAddress = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const {
    currentAddress,
    setCurrentAddress,
    currentAddressConditions,
    setCurrentAddressConditions,
  } = useSectionStore();

  const { addressMatch } = currentAddress;

  const ctx: CurrentAddressState = {
    addressMatch,
  };

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
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
              <p className="text-md text-black font-semibold">
                Does the borrower’s current address on the credit report match
                the loan application?
              </p>
            </div>

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
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>

            {/* ✅ CONDITION (NEW) */}
            {ctx.addressMatch && ctx.addressMatch !== "Matches" && (
              <EditableCondition
                type="condition"
                value={
                  currentAddressConditions.addressMatch ||
                  buildAddressMessage(ctx.addressMatch)
                }
                onChange={(val) =>
                  setCurrentAddressConditions({
                    addressMatch: val,
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAddress;
