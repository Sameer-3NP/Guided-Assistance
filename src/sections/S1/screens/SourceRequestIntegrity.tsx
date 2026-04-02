import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onContinue: () => void;
};

const SourceRequestIntegrity = ({ onContinue }: Props) => {
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const [agencyAddress, setAgencyAddress] = useState<string | null>(null);
  const [agencyPhone, setAgencyPhone] = useState<string | null>(null);
  const [lenderName, setLenderName] = useState<string | null>(null);

  const [requestedRole, setRequestedRole] = useState("");
  const [lastNameMatch, setLastNameMatch] = useState<string | null>(null);

  const [loanMatch, setLoanMatch] = useState<string | null>(null);

  const allAgencyPresent =
    agencyName === "yes" &&
    agencyAddress === "yes" &&
    agencyPhone === "yes" &&
    lenderName === "yes";

  const requestedByBorrower = requestedRole === "Borrower";
  const lastNameMatches = lastNameMatch === "yes";

  const handleContinue = () => {
    // Group A validation
    if (!agencyName || !agencyAddress || !agencyPhone || !lenderName) {
      toast.error("Please answer all Agency Information fields");
      return;
    }

    // Group B validation
    if (allAgencyPresent) {
      if (!requestedRole || !lastNameMatch) {
        toast.error("Please complete Requested By section");
        return;
      }
    }

    // Group C validation
    if (allAgencyPresent && !requestedByBorrower && !lastNameMatches) {
      if (!loanMatch) {
        toast.error("Please confirm LOS loan number alignment");
        return;
      }
    }

    if (loanMatch === "yes") {
      onContinue(); // go to Screen 6
      return;
    }

    if (loanMatch === "no") {
      toast.error("Loan number mismatch with LOS.");
      onContinue(); // still move to screen 6
    }

    onContinue();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Credit Report Source & Request Integrity
      </h2>

      {/* GROUP A */}

      <div className="border p-4 rounded-md space-y-3">
        <h3 className="font-medium">Agency Information</h3>

        {[
          ["Agency Name present?", setAgencyName],
          ["Agency Address present?", setAgencyAddress],
          ["Agency Phone present?", setAgencyPhone],
          ["Lender Name present?", setLenderName],
        ].map(([label, setter], i) => (
          <div key={i}>
            <p className="text-sm mb-1">{label}</p>

            <label className="mr-4">
              <input type="radio" name={label} onChange={() => setter("yes")} />
              Yes
            </label>

            <label>
              <input type="radio" name={label} onChange={() => setter("no")} />
              No
            </label>
          </div>
        ))}
      </div>

      {/* Condition if agency missing */}

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
              onChange={(e) => setRequestedRole(e.target.value)}
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

            <label className="mr-4">
              <input
                type="radio"
                name="lastname"
                onChange={() => setLastNameMatch("yes")}
              />
              Yes
            </label>

            <label className="mr-4">
              <input
                type="radio"
                name="lastname"
                onChange={() => setLastNameMatch("no")}
              />
              No
            </label>

            <label>
              <input
                type="radio"
                name="lastname"
                onChange={() => setLastNameMatch("unknown")}
              />
              Unable to determine
            </label>
          </div>
        </div>
      )}

      {/* Condition for borrower request */}

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
              name="loanMatch"
              onChange={() => setLoanMatch("yes")}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="loanMatch"
              onChange={() => setLoanMatch("no")}
            />
            No
          </label>
        </div>
      )}

      {/* LOS condition */}

      {loanMatch === "no" && (
        <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
          Condition Required: Loan number mismatch with LOS.
        </div>
      )}

      <button
        onClick={handleContinue}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Continue
      </button>
    </div>
  );
};

export default SourceRequestIntegrity;
