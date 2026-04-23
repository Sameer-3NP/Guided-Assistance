import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import PopUp from "../../../components/PopUp";

const MultipleReports = () => {
  const {
    s1,
    selectedReports,
    setSelectedReports,
    activeCreditReport,
    setActiveCreditReport,
    reportQueue,
    setReportQueue,
    currentReportIndex,
    setCurrentReportIndex,
  } = useSectionStore();
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [junkReports, setJunkReports] = useState<string[]>([]);

  // const getLatestReport = (reports: string[]) => {
  //   const selectedObjects = s1.filter((r) => reports.includes(r.label));

  //   if (selectedObjects.length === 0) return null;

  //   return selectedObjects.reduce((prev, curr) => {
  //     const prevDate = new Date(prev.updateDate || 0).getTime();
  //     const currDate = new Date(curr.updateDate || 0).getTime();

  //     return currDate > prevDate ? curr : prev;
  //   }).label;
  // };

  // const getUniqueLatestReports = (reports: string[]) => {
  //   const selectedObjects = s1.filter((r) => reports.includes(r.label));

  //   if (selectedObjects.length === 0) return [];

  //   const latestBySlot: Record<string, any> = {};

  //   selectedObjects.forEach((report) => {
  //     const slot = report.borrowerSlot || "UNKNOWN";

  //     if (!latestBySlot[slot]) {
  //       latestBySlot[slot] = report;
  //     } else {
  //       const existing = latestBySlot[slot];

  //       const existingDate = new Date(existing.updateDate || 0).getTime();
  //       const currentDate = new Date(report.updateDate || 0).getTime();

  //       if (currentDate > existingDate) {
  //         latestBySlot[slot] = report;
  //       }
  //     }
  //   });

  //   return Object.values(latestBySlot).map((r) => r.label);
  // };

  const getLatestReportsBySlot = () => {
    const grouped: Record<string, any[]> = {};

    // 🔹 group by borrowerSlot
    s1.forEach((report) => {
      const slot = report.borrowerSlot || "UNKNOWN";

      if (!grouped[slot]) grouped[slot] = [];
      grouped[slot].push(report);
    });

    const latestReports: any[] = [];
    const excludedMap: Record<string, any[]> = {};

    // 🔹 pick latest per slot
    Object.keys(grouped).forEach((slot) => {
      const reports = grouped[slot];

      const sorted = [...reports].sort(
        (a, b) =>
          new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime(),
      );

      latestReports.push(sorted[0]);

      if (sorted.length > 1) {
        excludedMap[slot] = sorted.slice(1); // older ones
      }
    });

    return { latestReports, excludedMap };
  };

  const { latestReports, excludedMap } = getLatestReportsBySlot();

  const getUniqueLatestReports = (reports: string[]) => {
    const selectedObjects = s1.filter((r) => reports.includes(r.label));

    const latestBySlot: Record<string, any> = {};

    selectedObjects.forEach((report) => {
      const slot = report.borrowerSlot || "UNKNOWN";

      if (!latestBySlot[slot]) {
        latestBySlot[slot] = report;
      } else {
        const prev = latestBySlot[slot];

        if (
          new Date(report.updateDate).getTime() >
          new Date(prev.updateDate).getTime()
        ) {
          latestBySlot[slot] = report;
        }
      }
    });

    return Object.values(latestBySlot).map((r) => r.label);
  };

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

    if (reportQueue.length === 0) {
      toast.error("No reports available");
      return;
    }

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
          {latestReports.map((report) => {
            const isActive = activeCreditReport === report.label;
            const isSelected = selectedReports.includes(report.label);
            return (
              <label
                key={report.label}
                className={`
                group flex items-center justify-between p-5 rounded-xl border
                transition-all cursor-pointer
               ${
                 isSelected
                   ? "border-indigo-400 bg-indigo-50"
                   : "border-gray-200 hover:border-indigo-300"
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

                    {(() => {
                      const slot = report.borrowerSlot || "UNKNOWN";
                      const excluded = excludedMap[slot];

                      if (!excluded) return null;

                      const excludedLabels = excluded
                        .map((r) => r.label)
                        .join(", ");
                      const activeLabel = report.label;

                      return (
                        <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mt-2">
                          As same borrower {slot} detected for{" "}
                          <strong>{excludedLabels}</strong>, the latest credit
                          report <strong>{activeLabel}</strong> can be used.
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Right Selection */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    // onChange={() => {
                    //   let updated: string[];

                    //   if (isSelected) {
                    //     updated = selectedReports.filter(
                    //       (r) => r !== report.label,
                    //     );
                    //   } else {
                    //     updated = [...selectedReports, report.label];
                    //   }

                    //   setSelectedReports(updated);

                    //   // ✅ compute active properly
                    //   const filtered = getUniqueLatestReports(updated);

                    //   // optional: store this if needed later
                    //   setSelectedReports(filtered);

                    //   setActiveCreditReport(filtered[0] || null);
                    // }}
                    // onChange={() => {
                    //   let updated = [...selectedReports];

                    //   const current = s1.find((r) => r.label === report.label);
                    //   const slot = current?.borrowerSlot;

                    //   // ❌ remove same borrowerSlot reports
                    //   updated = updated.filter((label) => {
                    //     const r = s1.find((x) => x.label === label);
                    //     return r?.borrowerSlot !== slot;
                    //   });

                    //   // ✅ add new one
                    //   updated.push(report.label);

                    //   setSelectedReports(updated);

                    //   // 🎯 build queue
                    //   const queue = getUniqueLatestReports(updated);

                    //   setReportQueue(queue);
                    //   setCurrentReportIndex(0);
                    //   setActiveCreditReport(queue[0] || null);
                    // }}
                    // onChange={() => {
                    //   let updated = [...selectedReports];

                    //   const current = s1.find((r) => r.label === report.label);
                    //   const slot = current?.borrowerSlot;

                    //   const isChecked = updated.includes(report.label);

                    //   if (isChecked) {
                    //     updated = updated.filter((r) => r !== report.label);
                    //   } else {
                    //     // remove same borrowerSlot first
                    //     updated = updated.filter((label) => {
                    //       const r = s1.find((x) => x.label === label);
                    //       return r?.borrowerSlot !== slot;
                    //     });

                    //     updated.push(report.label);
                    //   }

                    //   // 🔥 FINAL NORMALIZATION (THIS FIXES EVERYTHING)
                    //   const queue = getUniqueLatestReports(updated);

                    //   setSelectedReports(queue);
                    //   setReportQueue(queue);

                    //   setCurrentReportIndex(0);
                    //   setActiveCreditReport(queue[0] || null);

                    //   // 🔥 detect removed items for popup
                    //   const removed = updated.filter((r) => !queue.includes(r));

                    //   if (removed.length > 0) {
                    //     setJunkReports(removed);
                    //     setShowPopup(true);
                    //   }
                    // }}
                    onChange={() => {
                      let updated: string[];

                      if (isSelected) {
                        updated = selectedReports.filter(
                          (r) => r !== report.label,
                        );
                      } else {
                        updated = [...selectedReports, report.label];
                      }

                      setSelectedReports(updated);

                      const queue = getUniqueLatestReports(updated);

                      setReportQueue(queue);
                      setCurrentReportIndex(0);
                      setActiveCreditReport(queue[0] || null);
                    }}
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
          onClose={() => setShowPopup(false)} // only close
          onConfirm={handlePopupClose}
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
