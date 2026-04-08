import type { CreditReport } from "../../../types/credit";
import { calculateExpirationDate } from "../../../utils/dateUtils";
import { User, Calendar, Database } from "lucide-react";

type Props = {
  report: CreditReport;
  index: number;
  updateReport: (index: number, report: CreditReport) => void;
};

const CreditReportCard = ({ report, index, updateReport }: Props) => {
  const updateField = <K extends keyof CreditReport>(
    field: K,
    value: CreditReport[K],
  ) => {
    updateReport(index, { ...report, [field]: value });
  };

  const handleUpdateDate = (value: string) => {
    const expiration = report.overrideExpiration
      ? report.expirationDate
      : calculateExpirationDate(value);

    updateReport(index, {
      ...report,
      updateDate: value,
      expirationDate: expiration,
    });
  };

  const handleRepositoryChange = (
    repo: keyof CreditReport["repositories"],
    value: boolean,
  ) => {
    const repos = { ...report.repositories, [repo]: value };
    updateReport(index, { ...report, repositories: repos });
  };

  const repositoryCount = Object.values(report.repositories).filter(
    Boolean,
  ).length;
  const progress = (repositoryCount / 3) * 100;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Database className="w-5 h-5 text-blue-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Credit Report</h3>
        <span className="relative -right-180 bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow  md:rel">
          CR-{index + 1}
        </span>
      </div>

      {/* Form Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Borrower Slot */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4" />
            Borrower Slot
          </label>

          <select
            value={report.borrowerSlot}
            onChange={(e) => updateField("borrowerSlot", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="Joint">Joint</option>
          </select>
        </div>

        {/* Update Date */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4" />
            Update Date
          </label>

          <input
            type="date"
            value={report.updateDate}
            onChange={(e) => handleUpdateDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Expiration Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Expiration Date
          </label>

          <input
            type="date"
            value={report.expirationDate}
            disabled={!report.overrideExpiration}
            onChange={(e) => updateField("expirationDate", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full disabled:bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {/* Repository Section */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Credit Repositories
        </label>

        <div className="flex gap-4">
          {/* Equifax */}
          <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={report.repositories.eq}
              onChange={(e) => handleRepositoryChange("eq", e.target.checked)}
            />
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
              EQ
            </span>
            Equifax
          </label>

          {/* Experian */}
          <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={report.repositories.ex}
              onChange={(e) => handleRepositoryChange("ex", e.target.checked)}
            />
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
              EX
            </span>
            Experian
          </label>

          {/* TransUnion */}
          <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={report.repositories.tu}
              onChange={(e) => handleRepositoryChange("tu", e.target.checked)}
            />
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
              TU
            </span>
            TransUnion
          </label>
        </div>

        {/* Repository Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Repository Coverage</span>
            <span>{repositoryCount} / 3</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-400  h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditReportCard;
