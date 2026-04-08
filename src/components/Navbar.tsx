import { useState } from "react";
import { SECTIONS } from "../constants/sections";
import { toast } from "react-hot-toast";
import { Lock, Check, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  activeSection: string;
  sectionStatus: Record<string, string>;
  setActiveSection: (id: string) => void;
  logoSrc?: string;
};

const Navbar = ({
  activeSection,
  sectionStatus,
  setActiveSection,
  logoSrc,
}: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionClick = (section: any) => {
    if (sectionStatus[section.id] === "locked") {
      toast.error(
        "Can't unlock this section. Complete previous section first.",
      );
      return;
    }
    setActiveSection(section.id);
    setSidebarOpen(false); // Close sidebar on mobile after click
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="h-16 bg-[#222222] text-white flex items-center px-4 md:px-6 shadow-md justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          {logoSrc && (
            <img src={logoSrc} alt="Logo" className="w-8 h-8 object-contain" />
          )}
          <span className="font-semibold text-lg">Guided Assistant</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 overflow-x-auto">
          {SECTIONS.map((section) => {
            const status = sectionStatus[section.id];
            const isActive = activeSection === section.id;

            return (
              <div
                key={section.id}
                className={`relative flex items-center gap-1 px-3 py-2 rounded-md
                  ${isActive ? "bg-gray-800" : "hover:bg-gray-700"}
                  ${
                    status === "locked"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                title={section.label}
                onClick={() => handleSectionClick(section)}
              >
                <span className="text-sm font-medium">{section.navName}</span>

                {status === "completed" && (
                  <Check className="w-4 h-4 text-green-400" />
                )}

                {status === "locked" && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0  bg-opacity-30 backdrop-blur-[1px] z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-[#222222] text-white z-50 shadow-lg flex flex-col">
            {/* Close Button */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
              <span className="font-semibold text-lg">Sections</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Section Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {SECTIONS.map((section) => {
                const status = sectionStatus[section.id];
                const isActive = activeSection === section.id;

                return (
                  <div
                    key={section.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-md
                      ${isActive ? "bg-gray-800" : "hover:bg-gray-700"}
                      ${
                        status === "locked"
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                    onClick={() => handleSectionClick(section)}
                  >
                    <span>{section.label}</span>
                    {status === "completed" && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                    {status === "locked" && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
