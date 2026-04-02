import { useState } from "react";
import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";

type Props = {
  onContinue: () => void;
};

const MultipleReports = ({ onContinue }: Props) => {
  const { s1, setActiveCreditReport } = useSectionStore();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedReport) {
      toast.error("Please select the credit report used for qualification");
      return;
    }

    // Identify junk reports
    const junkReports = s1.filter((report) => report.label !== selectedReport);

    // Set active report
    setActiveCreditReport(selectedReport);

    // Notify junk reports
    junkReports.forEach((report) => {
      toast(`Move ${report.label} to junk`, {
        icon: "🗑️",
      });
    });

    toast.success(`${selectedReport} selected as Active Credit Report`);

    onContinue();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Multiple Credit Reports Detected
      </h2>

      <p className="text-sm text-gray-500">
        Select the credit report to be used for qualification
      </p>

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
            checked={selectedReport === report.label}
            onChange={() => setSelectedReport(report.label)}
          />
        </label>
      ))}

      <p className="text-sm text-gray-400">
        Ensure the most recent qualifying credit report is selected.
      </p>

      <button
        onClick={handleConfirm}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Confirm Active Credit Report
      </button>
    </div>
  );
};

export default MultipleReports;
