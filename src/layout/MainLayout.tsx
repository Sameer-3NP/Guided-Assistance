import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSectionStore } from "../store/SectionStore";
import { useFlowContext } from "../store/FlowContext";
import GlobalHeader from "../sections/S1/components/GlobalHeaderS1";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sectionStatus } = useSectionStore();
  const { actions } = useFlowContext();

  // Deduce activeSection from pathname
  const activeSection = pathname.startsWith("/s1")
    ? "S1"
    : pathname.startsWith("/s2")
      ? "S2"
      : pathname.startsWith("/s3")
        ? "S3"
        : pathname.startsWith("/s4")
          ? "S4"
          : pathname.startsWith("/s5")
            ? "S5"
            : "S0";

  const setActiveSection = (id: string) => {
    // Generic navigation to the base route of a section if user clicks navbar.
    // Real navigation inside sections should be handled by Next buttons, but this works for testing.
    navigate(`/${id.toLowerCase()}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar
        activeSection={activeSection}
        sectionStatus={sectionStatus}
        setActiveSection={setActiveSection}
        logoSrc="/logo.svg"
      />

      <Breadcrumb activeSection={activeSection} />
      {activeSection === "S1" ? <GlobalHeader /> : null}
      {activeSection === "S2" ? <GlobalHeader /> : null}
      {activeSection === "S3" ? <GlobalHeader /> : null}
      {activeSection === "S4" ? <GlobalHeader /> : null}
      {activeSection === "S5" ? <GlobalHeader /> : null}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-white">
        <div className="bg-white h-full rounded-xl  p-6">
          <Outlet />
        </div>
      </div>

      {/* Action Bar */}
      <div className="h-14 bg-white border-t flex items-center justify-end px-6 gap-3">
        {/* Back */}
        <button
          onClick={actions.onBack}
          disabled={activeSection === "S0"}
          className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Back
        </button>

        {/* Save */}
        <button
          onClick={actions.onSave}
          className="px-4 py-2 border rounded-md cursor-pointer"
        >
          Save
        </button>

        {/* Continue */}
        <button
          onClick={actions.onContinue}
          className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
