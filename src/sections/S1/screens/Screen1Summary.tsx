import { useState, useEffect, useMemo } from "react";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Section1Summary = () => {
  const {
    s1,
    activeCreditReport,
    pullType,
    biMergeAccepted,
    sourceRequestIntegrity,
    systemAlignmentReview,
    setSectionStatus,
  } = useSectionStore();

  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  if (!activeReport) return null;

  const repoCount = Object.values(activeReport.repositories).filter(
    Boolean,
  ).length;

  /* ---------------- CONDITIONS ---------------- */

  const conditions = useMemo(() => {
    const list: string[] = [];

    if (pullType === "soft") {
      list.push(
        "Credit report provided for borrower is a soft pull, LO to pull new credit report reflecting credit report type as hard pull.",
      );
    }

    const expirationDate = new Date(activeReport.expirationDate);

    if (expirationDate < new Date()) {
      list.push("Expired credit report");
    }

    if (repoCount < 3 && biMergeAccepted === "no") {
      list.push(
        "Credit report has been pulled with less than three distinct repositories and same is not acceptable. Hence, obtain a Tri-merged credit report in order to proceed further.",
      );
    }

    if (
      systemAlignmentReview?.losAlign === "no" &&
      systemAlignmentReview?.matchingReport === "no"
    ) {
      list.push("Alignment missing report");
    }

    return list;
  }, [
    pullType,
    activeReport,
    repoCount,
    biMergeAccepted,
    systemAlignmentReview,
  ]);

  /* ---------------- ALERTS ---------------- */

  const alerts = useMemo(() => {
    const list: string[] = [];

    if (
      sourceRequestIntegrity?.agencyName === "no" ||
      sourceRequestIntegrity?.agencyAddress === "no" ||
      sourceRequestIntegrity?.agencyPhone === "no"
    ) {
      list.push("Missing agency info");
    }

    if (repoCount < 3 && biMergeAccepted === "yes") {
      list.push("Bi-merge acceptance required");
    }

    if (systemAlignmentReview?.losAlign === "no") {
      list.push(
        "Credit Report reference ID on Credit report and credit report reference id  as per LOS is not matching , checked that credit report is latest on AUS. therefore, AUS trigger engine is triggered to run AUS with correct credit report.",
      );
    }

    return list;
  }, [
    sourceRequestIntegrity,
    repoCount,
    biMergeAccepted,
    systemAlignmentReview,
  ]);

  const [raisedConditions, setRaisedConditions] = useState<string[]>([]);
  const [escalations, setEscalations] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setRaisedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  const toggleEscalation = (condition: string) => {
    setEscalations((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  /* ---------------- COMPLETION CHECK ---------------- */

  const allConditionsRaised = conditions.every((c) =>
    raisedConditions.includes(c),
  );

  const mandatoryEscalationDone = conditions
    .filter((c) => c === "Alignment missing report")
    .every((c) => escalations.includes(c));

  const sectionComplete =
    activeCreditReport &&
    sourceRequestIntegrity &&
    systemAlignmentReview &&
    allConditionsRaised &&
    mandatoryEscalationDone;

  /* ---------------- CONTINUE LOGIC ---------------- */

  const handleContinue = () => {
    if (!activeCreditReport) {
      toast.error("Active credit report not selected");
      return;
    }

    if (!allConditionsRaised) {
      toast.error("Please mark all required conditions as raised");
      return;
    }

    if (!mandatoryEscalationDone) {
      toast.error("Please confirm mandatory escalations");
      return;
    }

    setSectionStatus((prev) => ({
      ...prev,
      S1: "completed",
      S2: "active",
    }));

    if (conditions.length > 0) {
      toast("Section Complete – File Progression Gated", { icon: "⚠️" });
    } else {
      toast.success("Section 1 Cleared – Proceed to Section 2");
    }

    navigate("/s2");
  };

  /* ---------------- REGISTER FLOW ACTIONS ---------------- */

  useEffect(() => {
    registerActions({
      onContinue: () => handleContinue(),
      onBack: () => navigate("/s1/system-alignment-review"),
    });

    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Section 1 Summary</h2>

      {/* ALERTS */}

      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-yellow-700">Alerts</h3>

          {alerts.map((alert) => (
            <div
              key={alert}
              className="border border-yellow-400 bg-yellow-50 p-3 rounded flex justify-between items-center"
            >
              <span>{alert}</span>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(alert);
                  toast.success("Copied to LOS");
                }}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Copy to LOS
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONDITIONS */}

      {conditions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-red-700">Conditions</h3>

          {conditions.map((condition) => (
            <div
              key={condition}
              className="border border-red-400 bg-red-50 p-4 rounded space-y-2"
            >
              <div className="flex justify-between items-center">
                <span>{condition}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(condition);
                    toast.success("Copied to LOS");
                  }}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                >
                  Copy to LOS
                </button>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={raisedConditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                />
                Mark Condition Raised
              </label>

              {condition === "Alignment missing report" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={escalations.includes(condition)}
                    onChange={() => toggleEscalation(condition)}
                  />
                  Escalation Required
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* COMPLETION BANNER */}

      {sectionComplete ? (
        conditions.length > 0 ? (
          <div className="border border-yellow-500 bg-yellow-50 p-4 rounded">
            <strong>Section Complete – File Progression Gated</strong>
          </div>
        ) : (
          <div className="border border-green-500 bg-green-50 p-4 rounded">
            <strong>Section 1 Cleared – Proceed to Section 2</strong>
          </div>
        )
      ) : (
        <div className="text-sm text-gray-500">
          Complete all conditions to finish Section 1
        </div>
      )}
    </div>
  );
};

export default Section1Summary;
