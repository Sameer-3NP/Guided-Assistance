import { useState, useEffect } from "react";
import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const CreditReportValidity = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const {
    s0,
    s1,
    activeCreditReport,
    creditValidityStep,
    setCreditValidityStep,
    pullType,
    setPullType,
  } = useSectionStore();

  const activeReport =
    s1.length === 1
      ? s1[0]
      : s1.find((report) => report.label === activeCreditReport);

  if (!activeReport || !s0) return null;

  const expirationDate = new Date(activeReport.expirationDate);
  console.log(expirationDate);
  const closingDate = new Date(s0.closingDate);

  const expirationCondition = expirationDate < closingDate;
  console.log(expirationCondition);

  const handleContinue = () => {
    // STEP 1 → Pull Type Check
    if (creditValidityStep === "pullCheck") {
      if (!pullType) {
        toast.error("Please select Hard Pull or Soft Pull");
        return;
      }

      setCreditValidityStep("expirationCheck");
      return;
    }

    if (expirationCondition) {
      toast.error(
        "Credit report expires before the estimated closing date. An updated credit report must be obtained.",
        { icon: "❌" },
      );
    }

    // STEP 2 → Expiration Check
    navigate("/s1/source-request-integrity");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {
        if (creditValidityStep === "expirationCheck") {
          setCreditValidityStep("pullCheck");
        } else {
          navigate("/s1/repository-check");
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    creditValidityStep,
    pullType,
    expirationCondition,
    navigate,
    registerActions,
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Credit Report Validity</h2>

      {/* STEP 1 — Pull Type */}

      {creditValidityStep === "pullCheck" && (
        <>
          <div>
            <p className="mb-2">
              Is the credit report a Hard Pull or Soft Pull?
            </p>

            <div className="flex gap-6">
              <label className="flex gap-2">
                <input
                  type="radio"
                  name="pullType"
                  value="hard"
                  checked={pullType === "hard"}
                  onChange={(e) => setPullType(e.target.value)}
                />
                Hard Pull
              </label>

              <label className="flex gap-2">
                <input
                  type="radio"
                  name="pullType"
                  value="soft"
                  onChange={(e) => setPullType(e.target.value)}
                />
                Soft Pull
              </label>
            </div>
          </div>

          {/* Soft Pull Condition */}

          {pullType === "soft" && (
            <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              Soft Pull credit report detected. A Hard Pull credit report must
              be obtained for qualification.
            </div>
          )}
        </>
      )}

      {/* STEP 2 — Expiration Check */}

      {creditValidityStep === "expirationCheck" && (
        <>
          <div className="border rounded-md p-4 bg-gray-50 text-sm">
            <div>
              Credit Expiration Date:
              <span className="font-medium ml-2">
                {activeReport.expirationDate}
              </span>
            </div>

            <div>
              Estimated Closing Date:
              <span className="font-medium ml-2">{s0.closingDate}</span>
            </div>
          </div>

          {/* {expirationCondition && (
            <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              {toast.error(
                `Credit report expires before the estimated closing date. An updated credit report must be obtained.
              updated credit report must be obtained.`,
                { icon: "❌" },
              )}
            </div>
          )} */}
        </>
      )}

      {/* <button
        onClick={handleContinue}
        className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
      >
        Continue
      </button> */}
    </div>
  );
};

export default CreditReportValidity;
