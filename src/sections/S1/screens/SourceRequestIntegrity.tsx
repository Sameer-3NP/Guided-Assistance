import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useSectionStore } from "../../../store/SectionStore";
import { useNavigate } from "react-router-dom";

const SourceRequestIntegrity = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { sourceRequestIntegrity, setSourceRequestIntegrity } =
    useSectionStore();

  const {
    agencyName,
    agencyAddress,
    agencyPhone,
    lenderName,
    requestedRole,
    lastNameMatch,
    loanMatch,
  } = sourceRequestIntegrity;

  const allAgencyPresent =
    agencyName === "yes" &&
    agencyAddress === "yes" &&
    agencyPhone === "yes" &&
    lenderName === "yes";

  const requestedByBorrower = requestedRole === "Borrower";
  const lastNameMatches = lastNameMatch === "yes";

  const handleContinue = () => {
    if (!agencyName || !agencyAddress || !agencyPhone || !lenderName) {
      toast.error("Please answer all Agency Information fields");
      return;
    }

    if (allAgencyPresent) {
      if (!requestedRole || !lastNameMatch) {
        toast.error("Please complete Requested By section");
        return;
      }
    }

    if (allAgencyPresent && !requestedByBorrower && !lastNameMatches) {
      if (!loanMatch) {
        toast.error("Please confirm LOS loan number alignment");
        return;
      }
    }

    if (loanMatch === "yes") {
      navigate("/s1/system-alignment-review");
      return;
    }

    if (loanMatch === "no") {
      toast.error("Loan number mismatch with LOS.");
      navigate("/s1/system-alignment-review");
      return;
    }

    navigate("/s1/system-alignment-review");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/credit-report-validity"),
    });
  }, [sourceRequestIntegrity, navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Credit Report Source & Request Integrity
      </h2>

      {/* GROUP A */}

      <div className="border p-4 rounded-md space-y-3">
        <h3 className="font-medium">Agency Information</h3>

        {[
          ["Agency Name present?", "agencyName"],
          ["Agency Address present?", "agencyAddress"],
          ["Agency Phone present?", "agencyPhone"],
          ["Lender Name present?", "lenderName"],
        ].map(([label, field]) => (
          <div key={field}>
            <p className="text-sm mb-1">{label}</p>

            <label className="mr-4">
              <input
                type="radio"
                checked={sourceRequestIntegrity[field] === "yes"}
                onChange={() => setSourceRequestIntegrity({ [field]: "yes" })}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                checked={sourceRequestIntegrity[field] === "no"}
                onChange={() => setSourceRequestIntegrity({ [field]: "no" })}
              />
              No
            </label>
          </div>
        ))}
      </div>

      {/* Agency Missing */}

      {!allAgencyPresent &&
        agencyName &&
        agencyAddress &&
        agencyPhone &&
        lenderName && (
          <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
            Condition Required: Missing agency information on credit report.
          </div>
        )}

      {/* GROUP B */}

      {allAgencyPresent && (
        <div className="border p-4 rounded-md space-y-3">
          <h3 className="font-medium">Requested By</h3>

          <div>
            <label className="block text-sm mb-1">Requested By Role</label>

            <select
              value={requestedRole}
              onChange={(e) =>
                setSourceRequestIntegrity({
                  requestedRole: e.target.value,
                })
              }
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select</option>
              <option value="Loan Officer">Loan Officer</option>
              <option value="Loan Processor">Loan Processor</option>
              <option value="Borrower">Borrower</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-1">
              Does Requested By last name match borrower last name?
            </p>

            {["yes", "no", "unknown"].map((value) => (
              <label key={value} className="mr-4">
                <input
                  type="radio"
                  checked={lastNameMatch === value}
                  onChange={() =>
                    setSourceRequestIntegrity({
                      lastNameMatch: value,
                    })
                  }
                />
                {value === "unknown"
                  ? "Unable to determine"
                  : value.charAt(0).toUpperCase() + value.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      {(requestedByBorrower || lastNameMatches) && (
        <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
          Condition Required: Credit report requested by borrower or matching
          borrower name.
        </div>
      )}

      {/* GROUP C */}

      {allAgencyPresent && !requestedByBorrower && !lastNameMatches && (
        <div className="border p-4 rounded-md space-y-3">
          <h3 className="font-medium">LOS Alignment</h3>

          <p>Loan Number matches with LOS?</p>

          <label className="mr-4">
            <input
              type="radio"
              checked={loanMatch === "yes"}
              onChange={() => setSourceRequestIntegrity({ loanMatch: "yes" })}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              checked={loanMatch === "no"}
              onChange={() => setSourceRequestIntegrity({ loanMatch: "no" })}
            />
            No
          </label>
        </div>
      )}

      {loanMatch === "no" && (
        <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
          Condition Required: Loan number mismatch with LOS.
        </div>
      )}
    </div>
  );
};

export default SourceRequestIntegrity;
