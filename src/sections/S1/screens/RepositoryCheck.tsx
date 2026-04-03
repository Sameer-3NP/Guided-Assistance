import { useSectionStore } from "../../../store/SectionStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const RepositoryCheck = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { s1, activeCreditReport, biMergeAccepted, setBiMergeAccepted } =
    useSectionStore();
  const activeReport =
    s1.length === 1
      ? s1[0]
      : s1.find((report) => report.label === activeCreditReport);

  if (!activeReport) return null;

  const repositories = activeReport.repositories;

  const repoCount = Object.values(repositories).filter(Boolean).length;

  const handleContinue = () => {
    if (repoCount < 3) {
      if (!biMergeAccepted) {
        toast.error("Please select Yes or No");
        return;
      }

      if (biMergeAccepted === "no") {
        toast.error(
          "Credit report has been pulled with less than three distinct repositories and same is not acceptable. Hence, obtain a Tri-merged credit report in order to proceed further.",
          { icon: "❌" },
        );
      }

      toast.success("Bi-merge accepted as per policy");
    }

    if (repoCount === 3) {
      toast.success("Tri-merge repository coverage confirmed");
    }

    navigate("/s1/credit-report-validity");
  };

  useEffect(() => {
    if (biMergeAccepted) {
      localStorage.setItem("biMergeAccepted", biMergeAccepted);
    }
  }, [biMergeAccepted]);

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {
        if (s1.length > 1) {
          navigate("/s1/multiple-reports");
        } else {
          navigate("/s1/inventory");
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biMergeAccepted, repoCount, navigate, s1.length, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Repository Coverage Check</h2>

      {/* Active Report */}

      <div className="border rounded-md p-4 bg-gray-50">
        <div className="mb-2 font-medium">
          Active Credit Report: {activeReport.label}
        </div>

        <div className="text-sm">
          Repositories Present:
          {repositories.eq && " EQ"}
          {repositories.ex && " EX"}
          {repositories.tu && " TU"}
        </div>
      </div>

      {/* Bi-merge question */}

      {repoCount < 3 && (
        <div>
          <p className="mb-2">
            Is a bi-merged credit report acceptable per client policy?
          </p>

          <div className="flex gap-6">
            <label className="flex gap-2">
              <input
                type="radio"
                name="biMerge"
                value="yes"
                checked={biMergeAccepted === "yes"}
                onChange={(e) => setBiMergeAccepted(e.target.value)}
              />
              Yes
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="biMerge"
                value="no"
                checked={biMergeAccepted === "no"}
                onChange={(e) => setBiMergeAccepted(e.target.value)}
              />
              No
            </label>
          </div>
          {biMergeAccepted === "no" && (
            <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              Credit report has been pulled with less than three distinct
              repositories and same is not acceptable. Hence, obtain a
              Tri-merged credit report in order to proceed further.
            </div>
          )}
        </div>
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

export default RepositoryCheck;
