import { useSectionStore } from "../../../store/SectionStore";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

const GlobalHeader = () => {
  const { s0 } = useSectionStore();

  const sessionId = useMemo(() => uuidv4().slice(0, 8), []);

  if (!s0) return null;

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="px-6 py-4 space-y-4">
        {/* TOP ROW */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* SESSION INFO */}
          <div className="flex flex-wrap gap-4">
            <InfoCard label="Session ID" value={sessionId} />

            <InfoCard label="Application Date" value={s0.applicationDate} />

            <InfoCard label="Closing Date" value={s0.closingDate} />

            <InfoCard label="Credit As Of" value={s0.creditAsOfDate} />

            <InfoCard label="Applicants" value={String(s0.borrowerCount)} />
          </div>
        </div>

        {/* SECTION PROGRESS */}
        <SectionProgress />
      </div>
    </div>
  );
};

export default GlobalHeader;

/* ---------------- COMPONENTS ---------------- */

const InfoCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-gray-50 border rounded-lg px-4 py-2 min-w-[150px]">
      <div className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="text-sm font-semibold text-gray-800">{value || "-"}</div>
    </div>
  );
};

const SectionProgress = () => {
  const sections = ["S1", "S2", "S3", "S4", "S5"];

  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      {sections.map((section, index) => (
        <div key={section} className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full border text-xs
            ${
              section === "S1"
                ? "bg-black text-white border-black"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {section}
          </div>

          {index < sections.length - 1 && (
            <div className="h-[1px] w-6 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};
