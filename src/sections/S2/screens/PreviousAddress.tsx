import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS2Store } from "../../../store/useS2Store";
import EditableCondition from "../../../components/EditableCondition";
import { FileCheck } from "lucide-react";

type PreviousAddressState = {
  hasPreviousAddress: string | null;
  addressMatch: string | null;
  requireUpdatedReport: string | null;
};

const buildPreviousAddressMessage = (ctx: PreviousAddressState) => {
  if (ctx.requireUpdatedReport === "Yes") {
    return `Borrower’s previous address on the credit report does not match the previous address reflected in the loan application. Please provide an updated credit report reflecting the correct previous address.`;
  }

  return "";
};

const PreviousAddress = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const {
    previousAddress,
    setPreviousAddress,
    previousAddressConditions,
    setPreviousAddressConditions,
  } = useS2Store();

  const { hasPreviousAddress, addressMatch, requireUpdatedReport } =
    previousAddress;

  const ctx: PreviousAddressState = {
    hasPreviousAddress,
    addressMatch,
    requireUpdatedReport,
  };

  const handleContinue = () => {
    if (!hasPreviousAddress) {
      toast.error("Please answer if a previous address is reflected.");
      return;
    }

    if (hasPreviousAddress === "Yes" && !addressMatch) {
      toast.error("Please answer if previous address matches.");
      return;
    }

    if (addressMatch === "No" && !requireUpdatedReport) {
      toast.error("Please answer if updated credit report is required.");
      return;
    }

    navigate("/s2/section2-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/current-address-summary"),
    });
  }, [hasPreviousAddress, addressMatch, requireUpdatedReport]);

  const Radio = (value: string, field: keyof PreviousAddressState) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={previousAddress[field] === value}
        onChange={() => setPreviousAddress({ [field]: value })}
        className="accent-blue-500"
      />
      <span className="text-sm">{value}</span>
    </label>
  );

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Previous Address Verification
          </h2>
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          {/* PROMPT 1 */}
          <div className="space-y-4">
            <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
              <p className="text-md font-semibold">
                Is a previous address reflected on the credit report?
              </p>
            </div>

            <div className="flex gap-10">
              {Radio("Yes", "hasPreviousAddress")}
              {Radio("No", "hasPreviousAddress")}
            </div>
          </div>

          {/* PROMPT 2 */}
          {hasPreviousAddress === "Yes" && (
            <div className="space-y-4">
              <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
                <p className="text-md font-semibold">
                  Does the previous address match the previous address on loan
                  application?
                </p>
              </div>

              <div className="flex gap-10">
                {Radio("Yes", "addressMatch")}
                {Radio("No", "addressMatch")}
              </div>
            </div>
          )}

          {/* PROMPT 3 */}
          {addressMatch === "No" && (
            <div className="space-y-4">
              <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
                <p className="text-md font-semibold">
                  Per lender requirement, is an updated credit report required
                  for previous address mismatch?
                </p>
              </div>

              <div className="flex gap-10">
                {Radio("Yes", "requireUpdatedReport")}
                {Radio("No", "requireUpdatedReport")}
              </div>

              {/* ✅ CONDITION (replaces hardcoded alert) */}
              {requireUpdatedReport === "Yes" && (
                <EditableCondition
                  type="condition"
                  value={
                    previousAddressConditions.requireUpdatedReport ||
                    buildPreviousAddressMessage(ctx)
                  }
                  onChange={(val) =>
                    setPreviousAddressConditions({
                      requireUpdatedReport: val,
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousAddress;
