import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS3Store } from "../../../store/useS3Store";
import { useAppStore } from "../../../store/useAppStore";

import { Calculator, TrendingDown } from "lucide-react";

const MedianScore = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { qualifyingScore } = useS3Store();
  const { setSectionStatus } = useAppStore();

  const { borrowerCount, b1QualifyingScore, b2QualifyingScore } =
    qualifyingScore;

  const medianScore =
    borrowerCount === "2"
      ? Math.min(b1QualifyingScore!, b2QualifyingScore!)
      : b1QualifyingScore;

  const handleContinue = () => {
    toast.success("Section 3 Completed");

    setSectionStatus((prev) => ({
      ...prev,
      S3: "completed",
      S4: "active",
    }));

    navigate("/s4");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s3/qualifying-score"),
    });
  }, []);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <Calculator className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Median Credit Score & Minimum Requirement
          </h2>
        </div>

        {/* INFO */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          The final qualifying credit score is determined by selecting the lower
          score between borrowers.
        </div>

        {/* SCORE CARD */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <div className="flex items-center gap-2 font-semibold">
            <TrendingDown className="w-5 h-5" />
            Calculated Scores
          </div>

          {b1QualifyingScore && (
            <div className="flex justify-between border-b pb-2">
              <span>Borrower Credit Score</span>
              <span className="font-bold text-blue-600">
                {b1QualifyingScore}
              </span>
            </div>
          )}

          {b2QualifyingScore && (
            <div className="flex justify-between pt-2">
              <span>Co-Borrower Credit Score</span>
              <span className="font-bold text-blue-600">
                {b2QualifyingScore}
              </span>
            </div>
          )}

          {medianScore && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              Final qualifying score used for loan evaluation:
              <span className="block font-bold text-lg text-green-900">
                {medianScore}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedianScore;
