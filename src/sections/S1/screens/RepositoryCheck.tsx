import { useSectionStore } from "../../../store/SectionStore";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onContinue: () => void;
};

const RepositoryCheck = ({ onContinue }: Props) => {
  const { s1, activeCreditReport } = useSectionStore();

  const [biMergeAccepted, setBiMergeAccepted] = useState<string | null>(null);

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

    onContinue();
  };

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
                onChange={(e) => setBiMergeAccepted(e.target.value)}
              />
              Yes
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="biMerge"
                value="no"
                onChange={(e) => setBiMergeAccepted(e.target.value)}
              />
              No
            </label>
          </div>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Continue
      </button>
    </div>
  );
};

export default RepositoryCheck;
