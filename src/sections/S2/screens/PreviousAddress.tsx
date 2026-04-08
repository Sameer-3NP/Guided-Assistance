import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import {
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

const PreviousAddress = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const { previousAddress, setPreviousAddress } = useSectionStore();

  const { hasPreviousAddress, addressMatch, requireUpdatedReport } =
    previousAddress;

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

  const Radio = (value: string, field: string) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={(previousAddress as any)[field] === value}
        onChange={() => setPreviousAddress({ [field]: value })}
      />

      {/* {value === "Yes" && <CheckCircle className="w-4 h-4 text-green-500" />}
      {value === "No" && <XCircle className="w-4 h-4 text-red-500" />} */}

      <span className="text-sm">{value}</span>
    </label>
  );

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Previous Address Verification
          </h2>
        </div>

        {/* PROMPT 1 */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
            {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
            <p className="text-md text-black font-semibold">
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
            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
              <p className="text-md text-black font-semibold">
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
            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
              <p className="text-md text-black font-semibold">
                Per lender requirement, is an updated credit report required for
                previous address mismatch?
              </p>
            </div>

            <div className="flex gap-10">
              {Radio("Yes", "requireUpdatedReport")}
              {Radio("No", "requireUpdatedReport")}
            </div>

            {requireUpdatedReport === "Yes" && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Condition: Updated credit report required
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousAddress;
