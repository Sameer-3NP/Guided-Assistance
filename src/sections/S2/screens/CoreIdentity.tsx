import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const CoreIdentity = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  // Field states
  const [firstLastName, setFirstLastName] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [suffix, setSuffix] = useState<string | null>(null);

  const [ssn, setSsn] = useState<string | null>(null);
  const [dob, setDob] = useState<string | null>(null);
  const [akaSsn, setAkaSsn] = useState<string | null>(null);

  const handleContinue = () => {
    if (!firstLastName) {
      toast.error("Please answer the First/Last Name prompt.");
      return;
    }

    if (!middleName) {
      toast.error("Please answer the Middle Name prompt.");
      return;
    }

    if (!suffix) {
      toast.error("Please answer the Suffix prompt.");
      return;
    }

    if (!ssn) {
      toast.error("Please answer the SSN prompt.");
      return;
    }

    if (!dob) {
      toast.error("Please answer the DOB prompt.");
      return;
    }

    if (dob === "Matches" && !akaSsn) {
      toast.error("Please answer the Additional / AKA SSN prompt.");
      return;
    }

    // Log logic conditions based on prompt mismatches
    const hasNameMismatch =
      firstLastName !== "Matches" ||
      middleName !== "Matches" ||
      suffix !== "Matches";
    const hasSsnMismatch = ssn !== "Matches";
    const hasDobMismatch = dob !== "Matches";
    const hasAkaSsn = akaSsn === "Yes";

    if (hasNameMismatch || hasSsnMismatch || hasDobMismatch || hasAkaSsn) {
      toast(
        "Identity Conditions noted. Please mark specific conditions as raised.",
        { icon: "⚠️" },
      );
    }

    navigate("/s2/current-address");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/screen1-summary"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstLastName,
    middleName,
    suffix,
    ssn,
    dob,
    akaSsn,
    navigate,
    registerActions,
  ]);

  const renderRadioGroup = (
    label: string,
    value: string | null,
    setter: (val: string) => void,
    options: string[] = ["Matches", "Does Not Match", "Missing"],
  ) => (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={value === opt}
              onChange={() => setter(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Borrower Core Identity Verification
      </h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <h3 className="font-medium text-blue-800">Prompt Group A — Name</h3>

        {renderRadioGroup(
          "Does the borrower First/Last name on the credit report match the loan application?",
          firstLastName,
          setFirstLastName,
        )}

        {firstLastName &&
          renderRadioGroup(
            "Does the borrower Middle Name on the credit report match the loan application?",
            middleName,
            setMiddleName,
          )}

        {middleName &&
          renderRadioGroup(
            "Does the borrower Suffix on the credit report match the loan application?",
            suffix,
            setSuffix,
          )}

        {firstLastName && firstLastName !== "Matches" && (
          <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
            Alert: Name Mismatch (Outcome A Condition)
          </div>
        )}
      </div>

      {suffix && (
        <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
          <h3 className="font-medium text-blue-800">Prompt Group B — SSN</h3>

          {renderRadioGroup(
            "Is SSN, if displayed on the credit report, matching with the loan application?",
            ssn,
            setSsn,
            ["Matches", "Does Not Match", "Missing"],
          )}

          {ssn && ssn !== "Matches" && (
            <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              Alert: SSN Mismatch/Missing
            </div>
          )}
        </div>
      )}

      {ssn && (
        <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
          <h3 className="font-medium text-blue-800">
            Prompt Group C & D — DOB / AKA
          </h3>

          {renderRadioGroup(
            "Does Date of Birth on the credit report match the loan application?",
            dob,
            setDob,
          )}

          {dob && dob !== "Matches" && (
            <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              Condition: DOB discrepancy
            </div>
          )}

          {dob &&
            renderRadioGroup(
              "Is any additional or AKA SSN reflected on the credit report?",
              akaSsn,
              setAkaSsn,
              ["No", "Yes"],
            )}

          {akaSsn === "Yes" && (
            <div className="border border-orange-400 bg-orange-50 p-3 rounded text-sm text-orange-800">
              Condition: Additional SSN requires verification
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoreIdentity;
