import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const MultipleReports = () => {
  const { s1, activeCreditReport, setActiveCreditReport } = useSectionStore();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const handleConfirm = () => {
    // if (!activeCreditReport) {
    //   toast.error("Please select the credit report used for qualification");
    //    return;
    // }

    const junkReports = s1.filter(
      (report) => report.label !== activeCreditReport,
    );

    junkReports.forEach((report) => {
      toast(`Move ${report.label} to junk`, { icon: "🗑️" });
    });

    toast.success(`${activeCreditReport} selected as Active Credit Report`);

    navigate("/s1/repository-check");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleConfirm,
      onBack: () => navigate("/s1/inventory"),
    });
  }, [navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Multiple Credit Reports Detected
      </h2>

      <h2 className="text-md text-gray-500">
        Select the credit report to be used for qualification.
      </h2>

      {s1.map((report) => (
        <label
          key={report.label}
          className="border rounded-md p-3 flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="font-medium">
              {report.label} — {report.borrowerSlot || "Borrower"}
            </div>

            <div className="text-sm text-gray-500">
              Update Date: {report.updateDate || "Not provided"}
            </div>
          </div>

          <input
            type="radio"
            name="creditReport"
            checked={activeCreditReport === report.label}
            onChange={() => setActiveCreditReport(report.label)}
          />
        </label>
      ))}

      <p className="text-sm text-black">
        Ensure the most recent qualifying credit report is selected.
      </p>

      {/* <button
        onClick={handleConfirm}
        className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
      >
        Confirm Active Credit Report
      </button> */}
    </div>
  );
};

export default MultipleReports;
