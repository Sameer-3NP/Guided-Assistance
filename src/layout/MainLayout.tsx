import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";

type Props = {
  activeSection: string;
  sectionStatus: Record<string, string>;
  setActiveSection: (id: string) => void;
  children: React.ReactNode;
  onContinue: () => void;
  onSave: () => void;
  onBack: () => void;
};

const MainLayout = ({
  activeSection,
  sectionStatus,
  setActiveSection,
  children,
  onContinue,
  onSave,
  onBack,
}: Props) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar
        activeSection={activeSection}
        sectionStatus={sectionStatus}
        setActiveSection={setActiveSection}
      />

      <Breadcrumb activeSection={activeSection} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white h-full rounded-xl shadow-sm p-6">
          {/* <span className="pb-5">
            Here is your guided assistance to help you out
          </span> */}
          {children}
        </div>
      </div>

      {/* Action Bar */}
      <div className="h-14 bg-white border-t flex items-center justify-end px-6 gap-3">
        {/* Back */}
        <button
          onClick={onBack}
          disabled={activeSection === "S0"}
          className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Back
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className="px-4 py-2 border rounded-md cursor-pointer"
        >
          Save
        </button>

        {/* Continue */}
        <button
          onClick={onContinue}
          className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
