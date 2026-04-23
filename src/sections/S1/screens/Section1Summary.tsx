import { useState, useEffect, useMemo } from "react";
import { useS1Store } from "../../../store/useS1Store";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle,
  Clipboard,
  ShieldAlert,
  FileWarning,
} from "lucide-react";

const Section1Summary = () => {
  const {
    s1,
    activeCreditReport,
    pullType,
    biMergeAccepted,
    sourceRequestIntegrity,
    systemAlignmentReview,
    CreditCondition,
    repositoryConditions,
    sourceIntegrityConditions,
  } = useS1Store();
  const { setSectionStatus } = useSectionStore();

  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const [copiedConditions, setCopiedConditions] = useState<string[]>([]);
  const [raisedConditions, setRaisedConditions] = useState<string[]>([]);
  const [escalations, setEscalations] = useState<string[]>([]);

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  if (!activeReport) return null;

  const repoCount = Object.values(activeReport.repositories).filter(
    Boolean,
  ).length;

  /* CONDITIONS */
  const conditions = useMemo(() => {
    const list: string[] = [];

    if (pullType === "soft") {
      list.push(CreditCondition.softPull);
    }

    const expirationDate = new Date(activeReport.expirationDate);
    if (expirationDate < new Date()) list.push(CreditCondition.expiredCR);

    if (repoCount < 3 && biMergeAccepted === "no") {
      list.push(repositoryConditions.biMergeFail);
    }

    if (
      systemAlignmentReview?.losAlign === "no" &&
      systemAlignmentReview?.matchingReport === "no"
    ) {
      list.push(sourceIntegrityConditions.missingAgency);
    }

    return list;
  }, [
    pullType,
    activeReport,
    repoCount,
    biMergeAccepted,
    systemAlignmentReview,
  ]);

  /* ALERTS */
  const alerts = useMemo(() => {
    const list: string[] = [];

    if (
      sourceRequestIntegrity?.agencyName === "no" ||
      sourceRequestIntegrity?.agencyAddress === "no" ||
      sourceRequestIntegrity?.agencyPhone === "no"
    ) {
      list.push(sourceIntegrityConditions.missingAgency);
    }

    if (repoCount < 3 && biMergeAccepted === "yes")
      list.push("Bi-merge accepted as per client policy.");

    if (systemAlignmentReview?.losAlign === "no") {
      list.push(sourceIntegrityConditions.loanMismatch);
    }

    return list;
  }, [
    sourceRequestIntegrity,
    repoCount,
    biMergeAccepted,
    systemAlignmentReview,
  ]);

  const toggleCondition = (condition: string) => {
    setRaisedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  // const toggleEscalation = (condition: string) => {
  //   setEscalations((prev) =>
  //     prev.includes(condition)
  //       ? prev.filter((c) => c !== condition)
  //       : [...prev, condition],
  //   );
  // };

  const allConditionsRaised =
    conditions.length === 0 ||
    conditions.every(
      (c) => copiedConditions.includes(c) && raisedConditions.includes(c),
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

  const handleContinue = () => {
    if (!allConditionsRaised) {
      toast.error("Please mark all required conditions");
      return;
    }

    // if (!mandatoryEscalationDone) {
    //   toast.error("Escalation confirmation required");
    //   return;
    // }

    setSectionStatus((prev) => ({ ...prev, S1: "completed", S2: "active" }));

    if (conditions.length > 0) {
      toast("Section Complete – File Progression Gated", { icon: "⚠️" });
    } else {
      toast.success("Section 1 Cleared – Proceed to Section 2");
    }

    navigate("/s2");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/system-alignment-review"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    raisedConditions,
    copiedConditions,
    conditions,
    escalations,
    activeCreditReport,
  ]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Section 1 Summary
          </h2>
        </div>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-yellow-700 font-semibold">
              <ShieldAlert className="w-5 h-5" />
              Alerts
            </h3>

            {alerts.map((alert) => (
              <div
                key={alert}
                className="flex justify-between items-center bg-white border rounded-lg p-4"
              >
                <span className="text-sm text-gray-700">{alert}</span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(alert);
                    toast.success("Copied to LOS");
                  }}
                  className="flex items-center gap-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
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

                      //mark as copied
                      if (!copiedConditions.includes(condition)) {
                        setCopiedConditions((prev) => [...prev, condition]);
                      }

                      // auto check checkbox
                      if (!raisedConditions.includes(condition)) {
                        setRaisedConditions((prev) => [...prev, condition]);
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

                {/* {condition === "Alignment missing report" && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={escalations.includes(condition)}
                      disabled={!escalations.includes(condition)}
                      onChange={() => toggleEscalation(condition)}
                      className="accent-red-500 disabled:opacity-40"
                    />
                    Escalation Required
                  </label>
                )} */}
              </div>
            ))}
          </div>
        )}

        {/* COMPLETION STATUS */}
        <div className="text-center">
          {sectionComplete ? (
            conditions.length > 0 ? (
              <div className="inline-flex items-center gap-2 border border-yellow-500 bg-yellow-50 px-5 py-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <strong>Section Complete – File Progression Gated</strong>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 border border-green-500 bg-green-50 px-5 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <strong>Section 1 Cleared – Proceed to Section 2</strong>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">
              Complete all conditions to finish Section 1
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section1Summary;
