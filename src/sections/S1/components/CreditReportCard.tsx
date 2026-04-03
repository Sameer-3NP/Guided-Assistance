import type { CreditReport } from "../../../types/credit";
import { calculateExpirationDate } from "../../../utils/dateUtils";

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
    const repos = {
      ...report.repositories,
      [repo]: value,
    };

    updateReport(index, {
      ...report,
      repositories: repos,
    });
  };

  const repositoryCount = Object.values(report.repositories).filter(
    Boolean,
  ).length;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">{report.label}</h3>

      {/* Borrower Slot */}

      <div className="mb-3">
        <label className="block text-sm mb-1">Borrower Slot</label>

        <select
          value={report.borrowerSlot}
          onChange={(e) => updateField("borrowerSlot", e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="">Select</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="Joint">Joint</option>
        </select>
      </div>

      {/* Update Date */}

      <div className="mb-3">
        <label className="block text-sm mb-1">Update Date</label>

        <input
          type="date"
          value={report.updateDate}
          onChange={(e) => handleUpdateDate(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Expiration Date */}

      <div className="mb-3">
        <label className="block text-sm mb-1">Expiration Date</label>

        <div className="flex gap-2">
          <input
            type="date"
            value={report.expirationDate}
            disabled={!report.overrideExpiration}
            onChange={(e) => updateField("expirationDate", e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>
      </div>

      {/* Repositories */}

      <div className="mb-3">
        <label className="block text-sm mb-1">Repositories</label>

        <div className="flex gap-4">
          <label className="flex gap-1">
            <input
              type="checkbox"
              checked={report.repositories.eq}
              onChange={(e) => handleRepositoryChange("eq", e.target.checked)}
            />
            Equifax
          </label>

          <label className="flex gap-1">
            <input
              type="checkbox"
              checked={report.repositories.ex}
              onChange={(e) => handleRepositoryChange("ex", e.target.checked)}
            />
            Experian
          </label>

          <label className="flex gap-1">
            <input
              type="checkbox"
              checked={report.repositories.tu}
              onChange={(e) => handleRepositoryChange("tu", e.target.checked)}
            />
            TransUnion
          </label>
        </div>
      </div>

      {/* Repository Count */}

      <div className="text-sm text-gray-600">
        Repository Count: {repositoryCount}
      </div>
    </div>
  );
};

export default CreditReportCard;
