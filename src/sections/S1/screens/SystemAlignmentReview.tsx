import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const SystemAlignmentReview = () => {
  const {
    s1,
    activeCreditReport,
    setSectionStatus,
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

    /* PERFECT MATCH */

    if (losAlign === "yes" && ausAlign === "yes") {
      toast.success("System alignment verified.");

      navigate("/s1/screen1-summary");
      return;
    }

    if (!ausDateObj) return;

    /* CASE A */

    if (creditUpdateDate > ausDateObj) {
      toast("Credit report newer than AUS submission.", {
        icon: "⚠️",
      });

      toast.error(
        "AUS must be re-run using the latest credit report before closing.",
      );

      navigate("/s1/screen1-summary");
      return;
    }

    /* CASE B */

    if (ausDateObj > creditUpdateDate) {
      if (!matchingReport) {
        toast.error("Please confirm if matching credit report is available");
        return;
      }

      if (matchingReport === "yes") {
        toast("Matching credit report available.", {
          icon: "⚠️",
        });

        toast.error(
          "Update system records to align with the matching credit report.",
        );

        navigate("/s1/screen1-summary");
        return;
      }

      if (matchingReport === "no") {
        toast.error("AUS alignment issue. Credit report must be revalidated.");
        navigate("/s1/screen1-summary");
        return;
      }
    }

    navigate("/s1/screen1-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/source-request-integrity"),
    });
  }, [ausDate, losAlign, ausAlign, matchingReport, navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">System Alignment Review</h2>

      {/* AUS DATE */}

      <div>
        <label className="block text-sm mb-1">
          Enter AUS Credit Report Date
        </label>

        <input
          type="date"
          value={ausDate}
          onChange={(e) =>
            setSystemAlignmentReview({ ausDate: e.target.value })
          }
          className="border rounded-md px-3 py-2"
        />
      </div>

      {/* LOS ALIGNMENT */}

      <div>
        <p className="mb-1">
          Does LOS Credit Reference ID align with Active Credit Report?
        </p>

        <label className="mr-4">
          <input
            type="radio"
            name="losAlign"
            checked={losAlign === "yes"}
            onChange={() => setSystemAlignmentReview({ losAlign: "yes" })}
          />
          Yes
        </label>

        <label>
          <input
            type="radio"
            name="losAlign"
            checked={losAlign === "no"}
            onChange={() => setSystemAlignmentReview({ losAlign: "no" })}
          />
          No
        </label>
      </div>

      {/* CASE B PROMPT */}

      {ausDateObj && ausDateObj > creditUpdateDate && (
        <div className="border p-3 rounded-md bg-gray-50">
          <p className="mb-2">Is a matching credit report available?</p>

          <label className="mr-4">
            <input
              type="radio"
              name="matchingReport"
              checked={matchingReport === "yes"}
              onChange={() =>
                setSystemAlignmentReview({ matchingReport: "yes" })
              }
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="matchingReport"
              checked={matchingReport === "no"}
              onChange={() =>
                setSystemAlignmentReview({ matchingReport: "no" })
              }
            />
            No
          </label>
        </div>
      )}
    </div>
  );
};

export default SystemAlignmentReview;
