import { useEffect } from "react";
import CreditReportCard from "../components/CreditReportCard";
import type { CreditReport } from "../../../types/credit";
import toast from "react-hot-toast";
import { useS1Store } from "../../../store/useS1Store";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle } from "lucide-react";
const MAX_REPORTS = 5;

const createReport = (index: number): CreditReport => ({
  label: `CR-${index + 1}`,
  borrowerSlot: "",
  updateDate: "",
  expirationDate: "",
  overrideExpiration: false,
  repositories: { eq: false, ex: false, tu: false },
  repositoryCount: 0,
});

const CreditInventory = () => {
  const { s1, setS1 } = useS1Store();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const creditReports = s1;

  useEffect(() => {
    localStorage.setItem("S1_data", JSON.stringify(creditReports));

    registerActions({
      onContinue: () => {
        if (!creditReports || creditReports.length === 0) {
          toast.error("Please enter credit report information");
          return;
        }

        if (creditReports.length > 1) {
          toast(
            "Multiple credit reports detected. Please select the credit reports used for qualification.",
            {
              icon: <AlertTriangle className="text-amber-600 " />,
              style: {
                background: "#ffffe1",
                color: "black",
                border: "1px solid #ddd",
              },
            },
          );
          navigate("/s1/multiple-reports");
        } else {
          navigate("/s1/repository-check");
        }
      },
      onBack: () => navigate("/s0"),
      onSave: () => {
        localStorage.setItem("S1_data", JSON.stringify(creditReports));
        toast.success("Credit report data saved");
      },
    });
  }, [creditReports, navigate, registerActions]);

  const handleReportCount = (count: number) => {
    if (count > MAX_REPORTS) {
      toast.error("Maximum 5 credit reports supported.");
      count = MAX_REPORTS;
    }

    const current = creditReports.length;

    if (count > current) {
      setS1([
        ...creditReports,
        ...Array.from({ length: count - current }, (_, i) =>
          createReport(current + i),
        ),
      ]);
    } else if (count < current) {
      setS1(creditReports.slice(0, count));
    }
  };

  const updateReport = (index: number, updatedReport: CreditReport) => {
    const updated = [...creditReports];
    updated[index] = updatedReport;
    setS1(updated);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-xl">
          <FileText className="w-6 h-6 text-blue-700" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Credit Report Inventory
          </h1>
          <p className="text-sm text-gray-500">
            Enter and manage the credit reports indexed in the loan file.
          </p>
        </div>
      </div>

      {/* Report Count Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 flex items-center justify-between">
        <div>
          <label className="text-md font-medium text-gray-700">
            How many credit reports are indexed in the file?
          </label>

          <p className="text-sm text-gray-500 mt-1">
            Maximum {MAX_REPORTS} reports supported
          </p>
        </div>

        <input
          type="number"
          min={1}
          max={MAX_REPORTS}
          value={creditReports.length || ""}
          onChange={(e) => handleReportCount(Number(e.target.value))}
          className="border  border-black  rounded-lg px-4 py-2 w-24 text-center text-lg font-medium
        focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
        />
      </div>

      {/* Cards */}
      {creditReports.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-gray-300 rounded-xl">
          No reports added yet. Enter the number of reports above to begin.
        </div>
      ) : (
        <div className="space-y-6">
          {creditReports.map((report, index) => (
            <div
              key={report.label}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <CreditReportCard
                report={report}
                index={index}
                updateReport={updateReport}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreditInventory;
