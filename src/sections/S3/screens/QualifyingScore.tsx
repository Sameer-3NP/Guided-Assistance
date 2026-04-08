import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import PromptRadio from "../components/PromptRadio";
import { BarChart3, Users, Calculator } from "lucide-react";
import { useSectionStore } from "../../../store/SectionStore";

const QualifyingScore = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { qualifyingScore, setQualifyingScore } = useSectionStore();

  const { borrowerCount, b1ScoresCount, b2ScoresCount, b1Scores, b2Scores } =
    qualifyingScore;

  /* ---------------- SCORE CHANGE ---------------- */

  const handleScoreChange = (
    borrower: "b1" | "b2",
    field: "sc1" | "sc2" | "sc3",
    val: string,
  ) => {
    if (borrower === "b1") {
      setQualifyingScore({
        b1Scores: { ...b1Scores, [field]: val },
      });
    } else {
      setQualifyingScore({
        b2Scores: { ...b2Scores, [field]: val },
      });
    }
  };

  /* ---------------- SCORE CALCULATOR ---------------- */

  const calculateScore = (
    scores: { sc1: string; sc2: string; sc3: string },
    count: string,
  ) => {
    const parsed = [
      parseInt(scores.sc1),
      parseInt(scores.sc2),
      parseInt(scores.sc3),
    ].filter((n) => !isNaN(n));

    if (parsed.length === 0) return null;

    if (count === "1") return parsed[0];

    if (count === "2") return Math.min(parsed[0], parsed[1]);

    if (count === "3") {
      const sorted = [...parsed].sort((a, b) => a - b);
      return sorted[1]; // middle score
    }

    return null;
  };

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!borrowerCount) {
      toast.error("Please select number of borrowers.");
      return;
    }

    if (!b1ScoresCount || (borrowerCount === "2" && !b2ScoresCount)) {
      toast.error("Please specify score counts.");
      return;
    }

    const b1Score = calculateScore(b1Scores, b1ScoresCount);

    if (!b1Score) {
      toast.error("Enter valid Borrower scores.");
      return;
    }

    let b2Score = null;

    if (borrowerCount === "2") {
      b2Score = calculateScore(b2Scores, b2ScoresCount!);

      if (!b2Score) {
        toast.error("Enter valid Co-Borrower scores.");
        return;
      }
    }

    /* STORE RESULTS */

    setQualifyingScore({
      b1QualifyingScore: b1Score,
      b2QualifyingScore: b2Score,
    });

    toast.success("Scores calculated successfully.");
    navigate("/s3/median-score");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s3/score-availability"),
    });
  }, [borrowerCount, b1ScoresCount, b2ScoresCount, b1Scores, b2Scores]);

  /* ---------------- SCORE INPUTS ---------------- */

  const renderScoreInputs = (borrower: "b1" | "b2", count: string) => {
    const scores = borrower === "b1" ? b1Scores : b2Scores;

    return (
      <div className="flex gap-4 mt-3">
        <input
          type="number"
          placeholder="SC1"
          value={scores.sc1}
          onChange={(e) => handleScoreChange(borrower, "sc1", e.target.value)}
          className="border rounded-lg px-3 py-2 w-24"
        />

        {count !== "1" && (
          <input
            type="number"
            placeholder="SC2"
            value={scores.sc2}
            onChange={(e) => handleScoreChange(borrower, "sc2", e.target.value)}
            className="border rounded-lg px-3 py-2 w-24"
          />
        )}

        {count === "3" && (
          <input
            type="number"
            placeholder="SC3"
            value={scores.sc3}
            onChange={(e) => handleScoreChange(borrower, "sc3", e.target.value)}
            className="border rounded-lg px-3 py-2 w-24"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <Calculator className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Qualifying Credit Score
          </h2>
        </div>

        {/* INFO */}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Enter borrower credit scores to calculate the qualifying score.
        </div>

        {/* BORROWER COUNT */}

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <div className="flex items-center gap-2 font-semibold">
            <Users className="w-5 h-5" />
            Borrower Information
          </div>

          <PromptRadio
            label="Number of borrowers?"
            value={borrowerCount}
            options={["1", "2"]}
            onChange={(v) => setQualifyingScore({ borrowerCount: v })}
          />
        </div>

        {/* BORROWER 1 */}

        {borrowerCount && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <div className="flex items-center gap-2 font-semibold">
              <BarChart3 className="w-5 h-5" />
              Borrower Scores
            </div>

            <PromptRadio
              label="How many scores available?"
              value={b1ScoresCount}
              options={["1", "2", "3"]}
              onChange={(v) => setQualifyingScore({ b1ScoresCount: v })}
            />

            {b1ScoresCount && renderScoreInputs("b1", b1ScoresCount)}
          </div>
        )}

        {/* CO BORROWER */}

        {borrowerCount === "2" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <div className="flex items-center gap-2 font-semibold">
              <BarChart3 className="w-5 h-5" />
              Co-Borrower Scores
            </div>

            <PromptRadio
              label="How many scores available?"
              value={b2ScoresCount}
              options={["1", "2", "3"]}
              onChange={(v) => setQualifyingScore({ b2ScoresCount: v })}
            />

            {b2ScoresCount && renderScoreInputs("b2", b2ScoresCount)}
          </div>
        )}
      </div>
    </div>
  );
};

export default QualifyingScore;
