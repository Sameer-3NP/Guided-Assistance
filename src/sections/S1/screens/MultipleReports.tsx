import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import PopUp from "../../../components/PopUp";

const MultipleReports = () => {
  const { s1, activeCreditReport, setActiveCreditReport } = useSectionStore();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [junkReports, setJunkReports] = useState<string[]>([]);

  const handleConfirm = () => {
    if (!activeCreditReport) {
      toast.error("Please select the credit report used for qualification");
      return;
    }

    const junkReports = s1
      .filter((report) => report.label !== activeCreditReport)
      .map((r) => r.label);

    setJunkReports(junkReports);
    setShowPopup(true);

    // navigate("/s1/repository-check");
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/s1/repository-check");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleConfirm,
      onBack: () => navigate("/s1/inventory"),
    });
  }, [navigate, registerActions, activeCreditReport]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Multiple Credit Reports Detected
          </h2>
        </div>

        {/* Report Cards */}
        <div className="space-y-4">
          {s1.map((report) => {
            const isActive = activeCreditReport === report.label;

            return (
              <label
                key={report.label}
                className={`
                group flex items-center justify-between p-5 rounded-xl border
                transition-all cursor-pointer
                ${
                  isActive
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }
              `}
              >
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`
                    p-2 rounded-lg
                    ${isActive ? "bg-indigo-100" : "bg-gray-100"}
                  `}
                  >
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">
                      {report.label}
                    </div>

                    <div className="text-sm text-gray-500">
                      Borrower Slot:{" "}
                      <span className="font-medium text-gray-700">
                        {report.borrowerSlot || "Not specified"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      Update Date: {report.updateDate || "Not provided"}
                    </div>

                    <div className="text-xs text-gray-400">
                      Expiration: {report.expirationDate || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Right Selection */}
                <div className="flex items-center gap-3">
                  {/* {isActive && (
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  )} */}

                  <input
                    type="radio"
                    name="creditReport"
                    checked={isActive}
                    onChange={() => setActiveCreditReport(report.label)}
                    className="w-5 h-5 text-blue-600"
                  />
                </div>
              </label>
            );
          })}
        </div>

        {/* POPUP  */}
        <PopUp
          open={showPopup}
          title="Credit Report Selection"
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          onClose={handlePopupClose}
        >
          {/* Selected Report */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <strong>{activeCreditReport}</strong> selected as Active Credit
            Report.
          </div>

          {/* Junk Reports */}
          {junkReports.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <p className="font-medium mb-1">
                You need to move {junkReports.length} report(s) to the junk
                file.
              </p>

              <ul className="list-disc ml-5">
                {junkReports.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </PopUp>

        {/* Footer Guidance */}
        <div className="mt-8 text-sm text-gray-500 pt-4">
          Ensure the most recent qualifying credit report is selected before
          continuing.
        </div>
      </div>
    </div>
  );
};

export default MultipleReports;
