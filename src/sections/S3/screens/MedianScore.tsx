import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

const MedianScore = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const { setSectionStatus } = useSectionStore();

  const [b1Score, setB1Score] = useState<string | null>(null);
  const [b2Score, setB2Score] = useState<string | null>(null);

  useEffect(() => {
    const s1 = localStorage.getItem("b1_qualifying_score");
    const s2 = localStorage.getItem("b2_qualifying_score");

    if (s1) setB1Score(s1);
    if (s2) setB2Score(s2);
  }, []);

  const handleContinue = () => {
    toast.success("Section 3 Cleared!");

    setSectionStatus((prev) => ({
      ...prev,
      S3: "completed",
      S4: "active",
    }));

    // Proceed to section 4
    navigate("/s4");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s3/qualifying-score"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">3.3 Median Credit Score & Minimum Requirement</h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <p className="text-sm font-medium mb-4">Calculated Qualifying Scores</p>
        
        {b1Score && (
           <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Borrower Credit Score</span>
              <span className="font-bold text-blue-600 text-lg">{b1Score}</span>
           </div>
        )}

        {b2Score && (
           <div className="flex justify-between items-center pt-2">
             <span className="text-gray-600">Co-Borrower Credit Score</span>
             <span className="font-bold text-blue-600 text-lg">{b2Score}</span>
           </div>
        )}

        {b1Score && b2Score && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
               The qualifying score for the loan will be the lower of the two scores above. Which evaluates to <strong>{Math.min(parseInt(b1Score), parseInt(b2Score))}</strong>
            </div>
        )}
      </div>
    </div>
  );
};

export default MedianScore;
