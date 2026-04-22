import { useState, useEffect, useMemo } from "react";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { AlertTriangle, Clipboard, CheckCircle } from "lucide-react";

const CoreIdentitySummary = () => {
  const { coreIdentity } = useSectionStore();
  const { coreIdentitySummary, setCoreIdentitySummary } = useSectionStore();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const [copiedConditions, setCopiedConditions] = useState<string[]>([]);
  const [copiedAlerts, setCopiedAlerts] = useState<string[]>([]);

  const { firstLastName, middleName, suffix, ssn, dob, akaSsn } = coreIdentity;
  const { conditions: raisedConditions, alerts: raisedAlerts } =
    coreIdentitySummary;

  const conditions = useMemo(() => {
    const list: string[] = [];

    if (firstLastName !== "Matches")
      list.push("Borrower first/last name mismatch");

    if (ssn !== "Matches") list.push("SSN mismatch or missing");

    if (dob !== "Matches" && dob !== "Missing")
      list.push("Date of Birth discrepancy");

    if (akaSsn === "Yes") list.push("Additional / AKA SSN detected");

    if (suffix === "Does Not Match") list.push("Borrower suffix mismatch");

    return list;
  }, [firstLastName, suffix, ssn, dob, akaSsn]);

  const alerts = useMemo(() => {
    const list: string[] = [];

    if (middleName !== "Matches") list.push("Middle name mismatch");

    if (suffix === "Missing") list.push("Borrower suffix missing");

    return list;
  }, [middleName, suffix]);

  const toggleCondition = (cond: string) => {
    const updated = raisedConditions.includes(cond)
      ? raisedConditions.filter((c) => c !== cond)
      : [...raisedConditions, cond];

    setCoreIdentitySummary({
      conditions: updated,
      alerts: raisedAlerts,
    });
  };

  const toggleAlert = (alert: string) => {
    const updated = raisedAlerts.includes(alert)
      ? raisedAlerts.filter((a) => a !== alert)
      : [...raisedAlerts, alert];

    setCoreIdentitySummary({
      conditions: raisedConditions,
      alerts: updated,
    });
  };

  const allConditionsRaised = conditions.every((c) =>
    raisedConditions.includes(c),
  );

  const handleContinue = () => {
    if (!allConditionsRaised) {
      toast.error("Please mark all conditions as raised.");
      return;
    }

    toast.success("Identity verification completed.");
    navigate("/s2/current-address");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/core-identity"),
    });
  }, [raisedConditions, navigate, registerActions]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-500" />
        Core Identity Review Summary
      </h2>

      {/* ALERTS */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-yellow-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alerts
          </h3>

          {alerts.map((alert) => (
            <div
              key={alert}
              className="border border-yellow-400 bg-yellow-50 p-3 rounded-xl space-y-2"
            >
              <div className="flex justify-between">
                <span>{alert}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(alert);
                    toast.success("Copied to LOS");

                    if (!copiedAlerts.includes(alert)) {
                      setCopiedAlerts((prev) => [...prev, alert]);
                    }

                    if (!raisedAlerts.includes(alert)) {
                      setCoreIdentitySummary({
                        alerts: [...raisedAlerts, alert],
                        conditions: raisedConditions,
                      });
                    }
                  }}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  <Clipboard className="w-4 h-4" />
                  Copy
                </button>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={raisedAlerts.includes(alert)}
                  disabled={!raisedAlerts.includes(alert)}
                  onChange={() => toggleAlert(alert)}
                  title="Do Copy to LOS before raising alert"
                  className="accent-yellow-400 disabled:opacity-40"
                />
                Mark Alert Raised
              </label>
            </div>
          ))}
        </div>
      )}

      {/* CONDITIONS */}
      {conditions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-red-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Conditions
          </h3>

          {conditions.map((condition) => (
            <div
              key={condition}
              className="border border-red-400 bg-red-50 p-3 rounded-xl space-y-2"
            >
              <div className="flex justify-between">
                <span>{condition}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(condition);
                    toast.success("Copied to LOS");

                    if (!copiedConditions.includes(condition)) {
                      setCopiedConditions((prev) => [...prev, condition]);
                    }

                    if (!raisedConditions.includes(condition)) {
                      setCoreIdentitySummary({
                        conditions: [...raisedConditions, condition],
                        alerts: raisedAlerts,
                      });
                    }
                  }}
                  className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                >
                  <Clipboard className="w-4 h-4" />
                  Copy
                </button>
              </div>

              <label className="flex items-center gap-2">
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

      {alerts.length === 0 && conditions.length === 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow-sm text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="text-lg font-semibold text-green-700 mb-2">
            No Issues Found
          </h3>

          <p className="text-sm text-gray-600">
            No alerts or conditions were identified during the credit review.
            You can proceed to the next section.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoreIdentitySummary;
