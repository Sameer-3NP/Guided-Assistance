import { useEffect } from "react";
import CreditReportCard from "../components/CreditReportCard";
import type { CreditReport } from "../../../types/credit";
import toast from "react-hot-toast";
import { useSectionStore } from "../../../store/SectionStore";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const MAX_REPORTS = 5;

const createReport = (index: number): CreditReport => ({
  label: `CR-${index + 1}`,
  borrowerSlot: "",
  updateDate: "",
  expirationDate: "",
  overrideExpiration: false,

  repositories: {
    eq: false,
    ex: false,
    tu: false,
  },

  repositoryCount: 0,
});

const CreditInventory = () => {
  const { s1, setS1 } = useSectionStore();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const creditReports = s1;

  // Load saved reports
  // useEffect(() => {
  //   if (s1.length === 0) {
  //     const saved = localStorage.getItem("S1_data");

  //     if (saved) {
  //       setS1(JSON.parse(saved));
  //     }
  //   }
  // }, [s1.length, setS1]);

  // Save reports
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
            "Multiple credit reports detected. Please select the one used for qualification.",
            {
              icon: "⚠️",
              style: {
                background: "#fff3cd",
                color: "#333",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditReports, navigate, registerActions]);

  const handleReportCount = (count: number) => {
    if (count > MAX_REPORTS) {
      toast.error("Maximum 5 credit reports allowed");
      count = MAX_REPORTS;
    }

    const current = creditReports.length;

    // Increase reports
    if (count > current) {
      const newReports = [...creditReports];

      for (let i = current; i < count; i++) {
        newReports.push(createReport(i));
      }

      setS1(newReports);
    }

    // Decrease reports
    if (count < current) {
      setS1(creditReports.slice(0, count));
    }
  };

  const updateReport = (index: number, updatedReport: CreditReport) => {
    const updated = [...creditReports];

    updated[index] = updatedReport;

    setS1(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl ">
      <h2 className="text-lg font-semibold mb-4">Credit Report Inventory</h2>

      {/* Number of Reports */}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          How many credit reports are indexed in the file?
        </label>

        <input
          type="number"
          min={1}
          max={MAX_REPORTS}
          value={creditReports.length || ""}
          className={`border rounded-md px-3 py-2 w-40 `}
          onChange={(e) => handleReportCount(Number(e.target.value))}
        />
      </div>

      {/* Credit Report Cards */}

      <div className="space-y-6">
        {creditReports.map((report, index) => (
          <CreditReportCard
            key={report.label}
            report={report}
            index={index}
            updateReport={updateReport}
          />
        ))}
      </div>
    </div>
  );
};

export default CreditInventory;
