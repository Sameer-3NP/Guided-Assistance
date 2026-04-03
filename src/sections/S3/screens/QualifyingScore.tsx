import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const QualifyingScore = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const [borrowerCount, setBorrowerCount] = useState<string | null>(null);
  
  const [b1ScoresCount, setB1ScoresCount] = useState<string | null>(null);
  const [b2ScoresCount, setB2ScoresCount] = useState<string | null>(null);

  const [b1Scores, setB1Scores] = useState({ sc1: "", sc2: "", sc3: "" });
  const [b2Scores, setB2Scores] = useState({ sc1: "", sc2: "", sc3: "" });

  const handleScoreChange = (borrower: "b1" | "b2", field: string, val: string) => {
    if (borrower === "b1") setB1Scores(prev => ({ ...prev, [field]: val }));
    else setB2Scores(prev => ({ ...prev, [field]: val }));
  };

  const getQualifyingScore = (scores: {sc1: string, sc2: string, sc3: string}, count: string) => {
      const parsed = [parseInt(scores.sc1), parseInt(scores.sc2), parseInt(scores.sc3)].filter(s => !isNaN(s));
      if (count === "1" && parsed.length >= 1) return parsed[0];
      if (count === "2" && parsed.length >= 2) return Math.min(parsed[0], parsed[1]);
      if (count === "3" && parsed.length >= 3) {
          parsed.sort((a,b) => a - b);
          return parsed[1];
      }
      return null;
  };

  const handleContinue = () => {
    if (!borrowerCount) {
      toast.error("Please enter number of borrowers.");
      return;
    }

    if (!b1ScoresCount || (borrowerCount === "2" && !b2ScoresCount)) {
      toast.error("Please specify score counts.");
      return;
    }

    const b1Score = getQualifyingScore(b1Scores, b1ScoresCount);
    if (!b1Score) {
       toast.error("Please enter valid scores for Borrower 1.");
       return;
    }

    if (borrowerCount === "2") {
       const b2Score = getQualifyingScore(b2Scores, b2ScoresCount!);
       if (!b2Score) {
         toast.error("Please enter valid scores for Borrower 2.");
         return;
       }
       localStorage.setItem("b2_qualifying_score", b2Score.toString());
    }

    localStorage.setItem("b1_qualifying_score", b1Score.toString());

    toast.success("Scores registered. Proceed to median rules");
    navigate("/s3/median-score");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s3/score-availability"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowerCount, b1ScoresCount, b2ScoresCount, b1Scores, b2Scores, navigate, registerActions]);

  const renderScoreInputs = (borrower: "b1"|"b2", count: string) => {
      return (
         <div className="flex gap-4 mt-2">
            <input type="number" placeholder="SC1" onChange={(e) => handleScoreChange(borrower, "sc1", e.target.value)} className="border rounded px-2 w-20" />
            {count !== "1" && (
                <input type="number" placeholder="SC2" onChange={(e) => handleScoreChange(borrower, "sc2", e.target.value)} className="border rounded px-2 w-20" />
            )}
            {count === "3" && (
                <input type="number" placeholder="SC3" onChange={(e) => handleScoreChange(borrower, "sc3", e.target.value)} className="border rounded px-2 w-20" />
            )}
         </div>
      );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">3.2 Qualifying Credit Score Determination</h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <p className="text-sm font-medium mb-2">Number of borrowers on the credit report?</p>
        <div className="flex gap-4">
           {["1", "2"].map((opt) => (
             <label key={opt} className="flex items-center gap-2 cursor-pointer">
               <input type="radio" checked={borrowerCount === opt} onChange={() => setBorrowerCount(opt)} />
               <span className="text-sm">{opt}</span>
             </label>
           ))}
        </div>

        {borrowerCount && (
           <div className="mt-4 border-t pt-4 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">For Borrower, how many scores are available?</p>
                 <div className="flex gap-4">
                   {["1", "2", "3"].map((opt) => (
                     <label key={opt} className="flex items-center gap-2 cursor-pointer">
                       <input type="radio" checked={b1ScoresCount === opt} onChange={() => setB1ScoresCount(opt)} />
                       <span className="text-sm">{opt}</span>
                     </label>
                   ))}
                </div>
                {b1ScoresCount && renderScoreInputs("b1", b1ScoresCount)}
              </div>

              {borrowerCount === "2" && (
                 <div className="mt-4 border-t pt-4">
                   <p className="text-sm font-medium mb-2">For Co-Borrower, how many scores are available?</p>
                    <div className="flex gap-4">
                      {["1", "2", "3"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={b2ScoresCount === opt} onChange={() => setB2ScoresCount(opt)} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                   </div>
                   {b2ScoresCount && renderScoreInputs("b2", b2ScoresCount)}
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default QualifyingScore;
