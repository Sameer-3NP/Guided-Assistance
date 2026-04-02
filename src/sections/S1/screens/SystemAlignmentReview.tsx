import { useState } from "react";
import toast from "react-hot-toast";
import { useSectionStore } from "../../../store/SectionStore";

type Props = {
  onContinue: () => void;
};

const SystemAlignmentReview = ({ onContinue }: Props) => {
  const { s1, activeCreditReport } = useSectionStore();

  const [ausDate, setAusDate] = useState("");
  const [losAlign, setLosAlign] = useState<string | null>(null);
  const [ausAlign, setAusAlign] = useState<string | null>(null);
  const [matchingReport, setMatchingReport] = useState<string | null>(null);

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  if (!activeReport) return null;

  const creditUpdateDate = new Date(activeReport.updateDate);
  const ausDateObj = ausDate ? new Date(ausDate) : null;

  const handleContinue = () => {
    // if (!ausDate || !losAlign || !ausAlign) {
    //   toast.error("Please complete all fields");
    //   return;
    // }

    // ✅ PERFECT MATCH
    if (losAlign === "yes" && ausAlign === "yes") {
      toast.success("System alignment verified. Section 1 complete.");
      onContinue();
      return;
    }

    // ❗ Branch logic starts

    if (!ausDateObj) return;

    // CASE A
    if (creditUpdateDate > ausDateObj) {
      toast("Credit report is newer than AUS submission.", {
        icon: "⚠️",
      });

      toast.error(
        "AUS must be re-run using the latest credit report before closing.",
      );

      onContinue();
      return;
    }

    // CASE B
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

        onContinue();
        return;
      }

      if (matchingReport === "no") {
        toast.error("AUS alignment issue. Credit report must be revalidated.");

        onContinue();
        return;
      }
    }

    onContinue();
  };

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
          onChange={(e) => setAusDate(e.target.value)}
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
            onChange={() => setLosAlign("yes")}
          />
          Yes
        </label>

        <label>
          <input
            type="radio"
            name="losAlign"
            onChange={() => setLosAlign("no")}
          />
          No
        </label>
      </div>

      {/* CASE B PROMPT */}

      {ausDateObj > creditUpdateDate && (
        <div className="border p-3 rounded-md bg-gray-50">
          <p className="mb-2">Is a matching credit report available?</p>

          <label className="mr-4">
            <input
              type="radio"
              name="matchingReport"
              onChange={() => setMatchingReport("yes")}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="matchingReport"
              onChange={() => setMatchingReport("no")}
            />
            No
          </label>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Complete Section 1
      </button>
    </div>
  );
};

export default SystemAlignmentReview;
