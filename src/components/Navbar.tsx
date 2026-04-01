import { SECTIONS } from "../constants/sections";
import { toast } from "react-hot-toast";

type Props = {
  activeSection: string;
  sectionStatus: Record<string, string>;
  setActiveSection: (id: string) => void;
};

const Navbar = ({ activeSection, sectionStatus, setActiveSection }: Props) => {
  const handleSectionClick = (section: any) => {
    if (sectionStatus[section.id] === "locked") {
      toast.error(
        "Can't unlock this section. Complete previous section first.",
      );
      return;
    }

    setActiveSection(section.id);
  };

  return (
    <div className="h-14 bg-[#222222] text-white flex items-center px-6 shadow-md justify-between">
      <span className="font-semibold text-lg">Guided Assistant</span>

      <div className="flex items-center gap-6">
        {SECTIONS.map((section) => {
          const status = sectionStatus[section.id];

          return (
            <span
              key={section.id}
              title={section.label}
              onClick={() => handleSectionClick(section)}
              className={`text-sm font-medium cursor-pointer hover:text-blue-400

                ${activeSection === section.id ? "border-b-2 border-white pb-1" : ""}

                ${status === "locked" ? "opacity-50 cursor-not-allowed" : ""}

                ${status === "completed" ? "text-green-400" : ""}
              `}
            >
              {section.id}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
