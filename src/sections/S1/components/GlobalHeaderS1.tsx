import { useSectionStore } from "../../../store/SectionStore";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import {
  Calendar,
  CalendarCheck,
  CreditCard,
  Users,
  Hash,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const GlobalHeader = () => {
  const { s0, s1, activeCreditReport } = useSectionStore();
  const location = useLocation();

  const sessionId = useMemo(() => uuidv4().slice(0, 8), []);

  if (!s0) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isSection1 = location.pathname.startsWith("/s1");
  const isSection2 = location.pathname.startsWith("/s2");
  const isSection3 = location.pathname.startsWith("/s3");

  const activeReport =
    s1.length === 1 ? s1[0] : s1.find((r) => r.label === activeCreditReport);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200 px-10 py-2 shadow-sm  flex items-center">
      <div className="flex flex-wrap items-center gap-x-15 gap-y-2">
        {/* SECTION 1 BANNER */}
        {isSection1 && (
          <>
            <InfoCard
              icon={<Hash size={16} />}
              label="Session"
              value={sessionId}
            />

            <InfoCard
              icon={<Calendar size={16} />}
              label="Application"
              value={formatDate(s0.applicationDate)}
            />

            <InfoCard
              icon={<CalendarCheck size={16} />}
              label="Closing"
              value={formatDate(s0.closingDate)}
            />

            <InfoCard
              icon={<CreditCard size={16} />}
              label="Credit As Of"
              value={formatDate(s0.creditAsOfDate)}
            />

            <InfoCard
              icon={<Users size={16} />}
              label="Applicants"
              value={String(s0.borrowerCount)}
            />
          </>
        )}

        {/* SECTION 2 & 3 BANNER */}
        {(isSection2 || isSection3) && activeReport && (
          <>
            <InfoCard
              icon={<Calendar size={16} />}
              label="Application Date"
              value={formatDate(s0.applicationDate)}
            />

            <InfoCard
              icon={<CalendarCheck size={16} />}
              label="Estimated Closing"
              value={formatDate(s0.closingDate)}
            />

            <InfoCard
              icon={<CreditCard size={16} />}
              label="Active Credit Report"
              value={activeReport.label}
            />

            <InfoCard
              icon={<User size={16} />}
              label="Borrower Slot"
              value={activeReport.borrowerSlot || "-"}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;

/* ---------------- INFO CARD ---------------- */

const InfoCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 p-1 rounded ">
      <span className="text-blue-600">{icon}</span>

      <div className="min-w-0">
        <div className="text-xs text-slate-500 truncate">{label}</div>
        <div className="text-sm sm:text-xs font-semibold truncate">
          {value || "-"}
        </div>
      </div>
    </div>
  );
};

/* ---------------- SECTION PROGRESS ---------------- */

const SectionProgress = () => {
  const sections = ["S1", "S2", "S3", "S4", "S5"];
  const activeSection = "S1";

  return (
    <div className="flex items-center gap-3">
      {sections.map((section, i) => {
        const active = section === activeSection;

        return (
          <div key={section} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition
                ${
                  active
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {section}
            </div>

            {i !== sections.length - 1 && (
              <div className="w-6 h-[2px] bg-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
