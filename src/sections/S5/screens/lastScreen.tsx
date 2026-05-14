import { useState, useEffect } from "react";
import { useS1Store } from "../../../store/useS1Store";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import PopUp from "../../../components/PopUp";
import { FileText } from "lucide-react";

const LastScreen = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const {
    reportQueue,
    currentReportIndex,
    setCurrentReportIndex,
    setActiveCreditReport,
  } = useS1Store();

  const [showPopup, setShowPopup] = useState(false);
  const [nextReport, setNextReport] = useState<string | null>(null);

  //   // 👉 Continue Button Logic
  //   const handleContinue = () => {
  //     const nextIndex = currentReportIndex + 1;

  //     if (nextIndex < reportQueue.length) {
  //       setNextReport(reportQueue[nextIndex]);
  //       setShowPopup(true);
  //     } else {
  //       // ✅ All reports done
  //       navigate("/s1"); // change if needed
  //     }
  //   };

  // 👉 Move to next report
  const handleNext = () => {
    const nextIndex = currentReportIndex + 1;

    setCurrentReportIndex(nextIndex);
    setActiveCreditReport(reportQueue[nextIndex]);

    setShowPopup(false);

    // 🔄 Restart flow from first screen
    navigate("/s1/repository-check");
  };

  // 👉 Register Continue / Back
  useEffect(() => {
    registerActions({
      onContinue: () => {
        const nextIndex = currentReportIndex + 1;

        if (nextIndex < reportQueue.length) {
          setNextReport(reportQueue[nextIndex]);
          setShowPopup(true);
        } else {
          navigate("/s1");
        }
      },
      onBack: () => navigate("/s5/judgment"),
    });
  }, []); // ✅ only once

  return (
    <div className="flex justify-center w-full px-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Credit Report Processing Completed
        </h2>

        <p className="text-gray-600 text-sm">
          You have completed this credit report. Click continue to proceed.
        </p>

        {/* 🔔 POPUP */}
        <PopUp
          open={showPopup}
          title="Next Credit Report"
          icon={<FileText className="w-6 h-6 text-blue-500" />}
          onClose={() => setShowPopup(false)}
        >
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 border p-3 rounded-xl">
              You have additional credit report(s) to review.
            </div>

            <div className="bg-green-50 border p-3 rounded-xl">
              Next Report: <strong>{nextReport}</strong>
            </div>

            {/* ✅ ADD HERE */}
            {reportQueue.length > currentReportIndex + 1 && (
              <div className="bg-yellow-50 border p-3 rounded-xl">
                <p className="font-medium mb-1">Remaining Reports:</p>

                <ul className="list-disc ml-5">
                  {reportQueue.slice(currentReportIndex + 1).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Continue
          </button>
        </PopUp>
      </div>
    </div>
  );
};

export default LastScreen;

/* 
                  ⚠️ Small Improvement (Cleaner UX)

                        If you want to exclude the next one from remaining, change this:

                        .slice(currentReportIndex + 1)

                        👉 to:

                        .slice(currentReportIndex + 2)

                        So it becomes:

                        Next: CR-3
                        Remaining: CR-4, CR-5
                  */
