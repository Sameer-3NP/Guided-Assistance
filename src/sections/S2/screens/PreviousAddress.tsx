import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

const PreviousAddress = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const { setSectionStatus } = useSectionStore();

  const [hasPreviousAddress, setHasPreviousAddress] = useState<string | null>(null);
  const [addressMatch, setAddressMatch] = useState<string | null>(null);
  const [requireUpdatedReport, setRequireUpdatedReport] = useState<string | null>(null);

  const handleContinue = () => {
    if (!hasPreviousAddress) {
      toast.error("Please answer if a previous address is reflected.");
      return;
    }

    if (hasPreviousAddress === "Yes") {
      if (!addressMatch) {
         toast.error("Please answer if previous address matches.");
         return;
      }

      if (addressMatch === "No" && !requireUpdatedReport) {
         toast.error("Please answer if updated credit report is required.");
         return;
      }
    }

    if (hasPreviousAddress === "No" || addressMatch === "Yes") {
      // Clean
      toast.success("Borrower Identity Cleared – Proceed to Section 3");
    } else {
      // Identity Conditions Present
      toast.success("Section 2 Complete. Review conditions noted.", { icon: "✅" });
    }

    // Complete S2, navigate S3
    setSectionStatus((prev) => ({
      ...prev,
      S2: "completed",
      S3: "active",
    }));

    navigate("/s3/score-availability");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/current-address"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPreviousAddress, addressMatch, requireUpdatedReport, navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">2.3 Previous Address Verification</h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <p className="text-sm font-medium mb-2">
          Is a previous address reflected on the credit report?
        </p>

        <div className="flex gap-4">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={hasPreviousAddress === opt}
                onChange={() => setHasPreviousAddress(opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>

        {hasPreviousAddress === "Yes" && (
           <div className="mt-4 border-t pt-4 space-y-4">
             <p className="text-sm font-medium mb-2">
               Does the previous address match the previous address on loan application?
             </p>

             <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
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

            {addressMatch === "No" && (
               <div className="mt-4 border-t pt-4 space-y-4">
                 <p className="text-sm font-medium mb-2">
                   Per lender requirement, is an updated credit report required for previous address mismatch?
                 </p>
    
                 <div className="flex gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={requireUpdatedReport === opt}
                        onChange={() => setRequireUpdatedReport(opt)}
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>

                {requireUpdatedReport === "Yes" && (
                    <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700 mt-4">
                      Condition Alert: Valid updated credit report required.
                    </div>
                )}
               </div>
            )}
           </div>
        )}
      </div>
    </div>
  );
};

export default PreviousAddress;
