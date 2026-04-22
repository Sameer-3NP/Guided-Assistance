import { useSectionStore } from "../../../store/SectionStore";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import EditableCondition from "../../../components/EditableCondition";
import {
  FileText,
  CheckCircle,
  ShieldCheck,
  Database,
  AlertTriangle,
} from "lucide-react";

const RepositoryCheck = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const {
    s1,
    activeCreditReport,
    biMergeAccepted,
    setBiMergeAccepted,
    repositoryConditions,
    setRepositoryConditions,
  } = useSectionStore();

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
          "Credit report has been pulled with less than three distinct repositories. Obtain a Tri-merged credit report.",
        );
      }

      toast.success("Bi-merge accepted as per policy");
    } else {
      toast.success("Tri-merge repository coverage confirmed");
    }

    navigate("/s1/credit-report-validity");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {
        if (s1.length > 1) navigate("/s1/multiple-reports");
        else navigate("/s1/inventory");
      },
    });
  }, [biMergeAccepted, repoCount, navigate, s1.length, registerActions]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Repository Coverage Check
          </h2>
        </div>

        {/* Active Report Card */}
        <div className="border border-gray-300 bg-gray-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <FileText className="w-5 h-5 text-gray-600" />
              Active Credit Report: {activeReport.label}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Database className="w-4 h-4" />
              {repoCount}/3 repositories
            </div>
          </div>

          {/* Repository Badges */}
          <div className="flex gap-3 flex-wrap">
            {repositories.eq && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                <CheckCircle className="w-4 h-4" /> Equifax
              </span>
            )}

            {repositories.ex && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                <CheckCircle className="w-4 h-4" /> Experian
              </span>
            )}

            {repositories.tu && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                <CheckCircle className="w-4 h-4" /> TransUnion
              </span>
            )}
          </div>
        </div>

        {/* Bi-Merge Policy */}
        {repoCount < 3 && (
          <div className="border border-gray-300 bg-gray-50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 font-medium text-gray-800">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
              Bi-Merge Policy Check
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}

              <p className="text-md text-black leading-relaxed font-semibold">
                Is a bi-merge credit report acceptable for this loan as per
                client policy?
              </p>
            </div>

            {/* Radio Buttons */}
            <div className="flex gap-10 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="biMerge"
                  value="yes"
                  checked={biMergeAccepted === "yes"}
                  onChange={(e) => setBiMergeAccepted(e.target.value)}
                  className="accent-blue-600"
                />
                Yes
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="biMerge"
                  value="no"
                  checked={biMergeAccepted === "no"}
                  onChange={(e) => setBiMergeAccepted(e.target.value)}
                  className="accent-red-600"
                />
                No
              </label>
            </div>

            {biMergeAccepted === "no" && (
              <EditableCondition
                type="condition"
                value={repositoryConditions.biMergeFail}
                onChange={(val) =>
                  setRepositoryConditions({ biMergeFail: val })
                }
              />
            )}

            {biMergeAccepted === "yes" && (
              <EditableCondition
                type="success"
                value={repositoryConditions.biMergePass}
                onChange={(val) =>
                  setRepositoryConditions({ biMergePass: val })
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryCheck;
