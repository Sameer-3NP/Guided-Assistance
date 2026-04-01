import { useState, useEffect } from "react";
import CreditReportCard from "./CreditReportCard";
import type { CreditReport } from "../../types/credit";
import toast from "react-hot-toast";

const CreditInventory = () => {
  const [reportCount, setReportCount] = useState<number>(0);
  const [creditReports, setCreditReports] = useState<CreditReport[]>([]);

  // Load saved data
  useEffect(() => {
    // OLD
    // const saved = localStorage.getItem("creditReports");

    // UPDATED
    const saved = localStorage.getItem("S1_data");
    if (saved) {
      const parsed = JSON.parse(saved);

      setCreditReports(parsed);
      setReportCount(parsed.length);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    // OLD
    // localStorage.setItem("creditReports", JSON.stringify(creditReports));

    // UPDATED — store using section key
    localStorage.setItem("S1_data", JSON.stringify(creditReports));
  }, [creditReports]);

  const handleReportCount = (count: number) => {
    if (count > 5) {
      toast.error("Maximum 5 credit reports allowed");
      count = 5;
    }
    setReportCount(count);

    const reports = Array.from({ length: count }, (_, i) => ({
      label: `CR-${i + 1}`,
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
    }));

    setCreditReports(reports);
  };

  const updateReport = (index: number, updatedReport: CreditReport) => {
    const updated = [...creditReports];

    updated[index] = updatedReport;

    setCreditReports(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Credit Report Inventory</h2>

      {/* Number of Reports */}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Number of Credit Reports
        </label>

        <input
          type="number"
          min={1}
          max={5}
          value={reportCount || ""}
          className="border rounded-md px-3 py-2 w-40"
          onChange={(e) => {
            const value = Number(e.target.value);

            if (value > 5) {
              toast.error("Maximum 5 credit reports allowed");
              handleReportCount(5);
              return;
            }

            handleReportCount(value);
          }}
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
