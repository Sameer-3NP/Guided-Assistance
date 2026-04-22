import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { Calendar, FileCheck, Database } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const SystemAlignmentReview = () => {
  const {
    s1,
    activeCreditReport,
    systemAlignmentReview,
    setSystemAlignmentReview,
    systemAlignmentConditions,
    setSystemAlignmentConditions,
  } = useSectionStore();

  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { ausDate, losAlign, ausAlign, matchingReport } = systemAlignmentReview;

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  if (!activeReport) return null;

  const creditUpdateDate = new Date(activeReport.updateDate);
  const ausDateObj = ausDate ? new Date(ausDate) : null;
  const creditNewer = ausDateObj && creditUpdateDate > ausDateObj;
  const ausNewer = ausDateObj && ausDateObj > creditUpdateDate;

  const ctx = {
    ausAlign,
    creditNewer,
    ausNewer,
    matchingReport,
  };

  const systemAlignmentRules = [
    {
      id: "caseA_mismatch",
      template: `Credit report id [credit report id as per LOS] updated in LOS does not match with the credit report id [credit report id as per AUS] pulled by AUS. i) Verify the most recent credit report and check whether LOS is updated with the same credit reference number. ii) If LOS is updated: Run AUS trigger engine to run AUS. iii) If LOS is not updated, update LOS with credit reference number based on the latest credit report and then trigger AUS trigger engine to run AUS.`,
      show: (ctx: any) => ctx.ausAlign === "no" && ctx.creditNewer,
    },
    {
      id: "caseB_matchFound",
      template: `Credit report date ${ausDate} reflected in AUS does not match with the credit report update date ${creditUpdateDate.toISOString().split("T")[0]} available in the file. i) Review the credit report update date and credit reference id based on the AUS findings. ii) Check the junk or unassigned folder for a credit report matching the AUS credit reference id and date. iii) If the matching credit report is found, move it to the active e-folder and proceed.`,
      show: (ctx: any) => ctx.ausNewer && ctx.matchingReport === "yes",
    },
    {
      id: "caseB_noMatch",
      template:
        "Credit report reference id and date on credit report does not match with details reflected on AUS. AUS reflects updated credit report date however credit report with same date is missing in file. Provide updated credit report which matches with credit report reference id and date reflected on AUS.",
      show: (ctx: any) => ctx.ausNewer && ctx.matchingReport === "no",
    },
  ];

  const handleContinue = () => {
    let message = null;

    // Basic validation (non-blocking → just notify)
    if (!ausDate || !losAlign) {
      toast.error("Please complete all fields");
    }

    // =========================
    // Alignment Pass (priority)
    // =========================
    if (losAlign === "yes" && ausAlign === "yes") {
      message = {
        type: "success",
        text: "System alignment verified.",
        icon: "✅",
      };
    }

    // =========================
    // CASE A → Branch 1
    // =========================
    else if (creditNewer) {
      message = {
        type: "error",
        text: "AUS must be re-run using the latest credit report before closing.",
        icon: "⚠️",
      };

      // nextRoute = "/branch-1"; // if needed later
    }

    // =========================
    // CASE B → Branch 2 / 3
    // =========================
    else if (ausNewer) {
      if (!matchingReport) {
        toast.error("Please confirm matching credit report availability");
      } else if (matchingReport === "yes") {
        message = {
          type: "error",
          text: "Update system records to align with the matching credit report.",
          icon: "⚠️",
        };

        // nextRoute = "/branch-2";
      } else if (matchingReport === "no") {
        message = {
          type: "error",
          text: "AUS alignment issue. Credit report must be revalidated.",
          icon: "⚠️",
        };

        // nextRoute = "/branch-3";
      }
    }

    // =========================
    // Execute feedback (once)
    // =========================
    if (message) {
      if (message.type === "success") {
        toast.success(message.text, { icon: message.icon });
      } else {
        toast(message.text, { icon: message.icon });
      }
    }

    // ✅ Always navigate (no blocking)
    navigate("/s1/section1-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/source-request-integrity"),
    });
  }, [ausDate, losAlign, ausAlign, matchingReport]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            System Alignment Review
          </h2>
        </div>

        {/* DATE COMPARISON */}
        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Calendar className="w-5 h-5 text-gray-600" />
            Enter AUS Credit Report Date
          </div>

          <input
            type="date"
            value={ausDate || ""}
            onChange={(e) =>
              setSystemAlignmentReview({ ausDate: e.target.value })
            }
            className="border rounded-md px-3 py-2 w-full"
          />

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Active Credit Report Update Date:
            <span className="font-medium ml-2">{activeReport.updateDate}</span>
          </div>
        </div>

        {/* LOS ALIGNMENT */}
        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Database className="w-5 h-5 text-gray-600" />
            LOS Credit Reference Alignment
          </div>

          <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
            {/* <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" /> */}
            <p className="text-md text-black leading-relaxed font-semibold">
              Does LOS Credit Reference id align with Active Credit Report ?
            </p>
          </div>

          <div className="flex gap-10">
            {["yes", "no"].map((val) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={losAlign === val}
                  onChange={() => setSystemAlignmentReview({ losAlign: val })}
                  className={`accent-${val === "yes" ? "blue" : "red"}-500`}
                />

                {/* {val === "yes" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )} */}

                {val === "yes" ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </div>

        {/* AUS ALIGNMENT */}
        {losAlign === "yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Database className="w-5 h-5 text-gray-600" />
              AUS Credit Reference Alignment
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" /> */}
              <p className="text-md text-black leading-relaxed font-semibold">
                Does AUS Credit Reference id align with Active Credit Report ?
              </p>
            </div>

            <div className="flex gap-10">
              {["yes", "no"].map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={ausAlign === val}
                    onChange={() => setSystemAlignmentReview({ ausAlign: val })}
                    className={`accent-${val === "yes" ? "blue" : "red"}-500`}
                  />
                  {val === "yes" ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* CASE A */}
        {/* {ausAlign === "no" && creditNewer && (
          <div className="flex items-start gap-2 border border-red-300 bg-red-50 p-4 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            Credit report id [credit report id as per LOS] updated in LOS does
            not match with the credit report id [credit report id as per AUS]
            pulled by AUS. i) Verify the most recent credit report and check
            whether LOS is updated with the same credit reference number. ii) If
            LOS is updated: Run AUS trigger engine to run AUS. iii) If LOS is
            not updated, update LOS with credit reference number based on the
            latest credit report and then trigger AUS trigger engine to run AUS.
          </div>
        )} */}

        {/* CASE B */}
        {ausDateObj && ausNewer && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              {/* <AlertTriangle className="w-5 h-5 text-yellow-500" /> */}
              AUS Date Newer Than Credit Report
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
              <p className="text-md text-black leading-relaxed font-semibold">
                Is a matching credit report available that corresponds to the{" "}
                AUS submission ?
              </p>
            </div>

            <div className="flex gap-10">
              {["yes", "no"].map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={matchingReport === val}
                    onChange={() =>
                      setSystemAlignmentReview({ matchingReport: val })
                    }
                    className={`accent-${val === "yes" ? "blue" : "red"}-500`}
                  />

                  {val === "yes" ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </div>
        )}
        {/* {ausNewer && matchingReport === "yes" && (
          <div className="flex items-start gap-2 border border-red-300 bg-red-50 p-4 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            Credit report date [credit report date as per AUS] reflected in AUS
            does not match with the credit report update date [credit report
            update date as per credit report] available in the file. <br /> i)
            Review the credit report update date and credit reference id based
            on the AUS findings. <br /> ii) Check the junk or unassigned folder
            for a credit report matching the AUS credit reference id and date.{" "}
            <br /> iii) If the matching credit report is found, move it to the
            active e-folder and proceed.
          </div>
        )} */}

        {/* {ausNewer && matchingReport === "no" && (
          <div className="flex items-start gap-2 border border-red-300 bg-red-50 p-4 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            Credit report reference id and date on credit report does not match
            with details reflected on AUS. AUS reflects updated credit report
            date however credit report with same date is missing in file.
            Provide updated credit report which matches with credit report
            reference id and date reflected on AUS.
          </div>
        )} */}

        {systemAlignmentRules.map((rule) => {
          if (!rule.show(ctx)) return null;

          return (
            <EditableCondition
              key={rule.id}
              type="condition"
              value={systemAlignmentConditions[rule.id] || rule.template}
              onChange={(val) =>
                setSystemAlignmentConditions({
                  [rule.id]: val,
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default SystemAlignmentReview;
