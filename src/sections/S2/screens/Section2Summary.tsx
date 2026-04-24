import { useState, useEffect, useMemo } from "react";
import { useS2Store } from "../../../store/useS2Store";
import { useAppStore } from "../../../store/useAppStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  AlertTriangle,
  CheckCircle,
  Clipboard,
  FileWarning,
  ShieldAlert,
} from "lucide-react";

const Section2Summary = () => {
  const { coreIdentity, currentAddress, previousAddress } = useS2Store();
  const { setSectionStatus } = useAppStore();

  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const [copiedConditions, setCopiedConditions] = useState<string[]>([]);

  const { firstLastName, middleName, suffix, ssn, dob, akaSsn } = coreIdentity;

  /* ---------------- CONDITIONS ---------------- */

  const conditions = useMemo(() => {
    const list: string[] = [];

    if (firstLastName !== "Matches")
      list.push("Borrower first/last name mismatch");

    if (suffix === "Does Not Match") list.push("Borrower suffix mismatch");

    if (ssn !== "Matches") list.push("SSN mismatch or missing");

    if (dob !== "Matches") list.push("Date of Birth discrepancy");

    if (akaSsn === "Yes") list.push("Additional / AKA SSN detected");

    if (currentAddress.addressMatch === "Does not match")
      list.push(
        "Credit report reflects borrower’s current address as [[Address on Credit Report]]",
      );

    if (currentAddress.addressMatch === "Missing")
      list.push("Borrower current address missing on credit report");

    if (
      previousAddress.addressMatch === "No" &&
      previousAddress.requireUpdatedReport === "Yes"
    )
      list.push(
        "Updated credit report required due to previous address mismatch",
      );

    return list;
  }, [
    firstLastName,
    suffix,
    ssn,
    dob,
    akaSsn,
    currentAddress,
    previousAddress,
  ]);

  /* ---------------- ALERTS ---------------- */

  const alerts = useMemo(() => {
    const list: string[] = [];

    if (middleName !== "Matches") list.push("Borrower middle name mismatch");

    if (suffix === "Missing") list.push("Borrower suffix missing");

    return list;
  }, [middleName, suffix]);

  /* ---------------- LOCAL STATE ---------------- */

  const { section2Summary, setSection2Summary } = useS2Store();

  const { raisedConditions } = section2Summary;

  const toggleCondition = (condition: string) => {
    const updated = raisedConditions.includes(condition)
      ? raisedConditions.filter((c) => c !== condition)
      : [...raisedConditions, condition];

    setSection2Summary({ raisedConditions: updated });
  };

  const allConditionsRaised = conditions.every((c) =>
    raisedConditions.includes(c),
  );

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!allConditionsRaised)
      return toast.error("Please mark all required conditions.");

    setSectionStatus((prev) => ({
      ...prev,
      S2: "completed",
      S3: "active",
    }));

    if (conditions.length > 0) {
      toast("Section Complete – Identity Conditions Present", { icon: "⚠️" });
    } else {
      toast.success("Borrower Identity Cleared – Proceed to Section 3");
    }

    navigate("/s3/score-availability");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/previous-address"),
    });
  }, [raisedConditions, conditions]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Section 2 Summary
          </h2>
        </div>

        {/* ALERTS */}

        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-yellow-700 font-semibold">
              <ShieldAlert className="w-5 h-5" />
              Alerts
            </h3>

            {alerts.map((alert) => (
              <div
                key={alert}
                className="flex justify-between items-center bg-white border rounded-lg p-4"
              >
                <span className="text-sm">{alert}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(alert);
                    toast.success("Copied to LOS");
                  }}
                  className="flex items-center gap-1 text-xs bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  <Clipboard className="w-3 h-3" />
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}

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

                      if (!raisedConditions.includes(condition)) {
                        setSection2Summary({
                          raisedConditions: [...raisedConditions, condition],
                        });
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
        {/* COMPLETION STATUS */}

        <div className="text-center">
          {allConditionsRaised ? (
            conditions.length > 0 ? (
              <div className="inline-flex items-center gap-2 border border-yellow-500 bg-yellow-50 px-5 py-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <strong>Section Complete – File Progression Gated</strong>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 border border-green-500 bg-green-50 px-5 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <strong>
                  Borrower Identity Cleared – Proceed to Section 3
                </strong>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">
              Complete all conditions to finish Section 2
            </p>
          )}
        </div>

        {/* If everything fine */}
        {alerts.length === 0 && conditions.length === 0 && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-lg font-semibold text-green-700 mb-2">
              No Issues Found
            </h3>

            <p className="text-sm text-gray-600">
              All the verification step is completed successfully without
              raising any issue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Section2Summary;
