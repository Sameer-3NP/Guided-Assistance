import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { Calendar, FileCheck, Database } from "lucide-react";

const SystemAlignmentReview = () => {
  const {
    s1,
    activeCreditReport,
    systemAlignmentReview,
    setSystemAlignmentReview,
  } = useSectionStore();

  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { ausDate, losAlign, ausAlign, matchingReport } = systemAlignmentReview;

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  if (!activeReport) return null;

  const creditUpdateDate = new Date(activeReport.updateDate);
  const ausDateObj = ausDate ? new Date(ausDate) : null;

  const handleContinue = () => {
    if (!ausDate || !losAlign) {
      toast.error("Please complete all fields");
      return;
    }

    if (losAlign === "yes" && ausAlign === "yes") {
      toast.success("System alignment verified.", { icon: "✅" });
      navigate("/s1/section1-summary");
      return;
    }

    if (!ausDateObj) return;

    if (creditUpdateDate > ausDateObj) {
      toast("Credit report newer than AUS submission.", { icon: "⚠️" });
      toast.error(
        "AUS must be re-run using the latest credit report before closing.",
      );
      navigate("/s1/section1-summary");
      return;
    }

    if (ausDateObj > creditUpdateDate) {
      if (!matchingReport) {
        toast.error("Please confirm if matching credit report is available");
        return;
      }

      if (matchingReport === "yes") {
        toast("Matching credit report available.", { icon: "⚠️" });
        toast.error(
          "Update system records to align with the matching credit report.",
        );
        navigate("/s1/section1-summary");
        return;
      }

      if (matchingReport === "no") {
        toast.error("AUS alignment issue. Credit report must be revalidated.");
        navigate("/s1/section1-summary");
        return;
      }
    }

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

        {/* CASE B */}
        {ausDateObj && ausDateObj > creditUpdateDate && (
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
        )}
      </div>
    </div>
  );
};

export default SystemAlignmentReview;
