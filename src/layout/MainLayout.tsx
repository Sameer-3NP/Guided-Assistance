import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useFlowContext } from "../store/FlowContext";
import GlobalHeader from "../sections/S1/components/GlobalHeaderS1";
import StartNewFileButton from "../components/StartNewFileButton";
import SessionHandler from "../components/SessionHandler";
import SessionWarningModal from "../components/SessionWarningModal";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sectionStatus } = useAppStore();
  const { actions } = useFlowContext();

  const match = pathname.match(/^\/(s[0-5])/i);
  const activeSection = match ? match[1].toUpperCase() : "S0";

  const setActiveSection = (id: string) => {
    navigate(`/${id.toLowerCase()}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 🔥 SESSION CONTROL (must be here) */}
      <SessionHandler />
      <SessionWarningModal />

      <Navbar
        activeSection={activeSection}
        sectionStatus={sectionStatus}
        setActiveSection={setActiveSection}
        logoSrc="/logo.svg"
      />
      <Breadcrumb />
      {activeSection !== "S0" && <GlobalHeader />}
      <div className="flex-1 p-6 overflow-auto bg-white">
        <div className="bg-white h-full rounded-xl p-6 w-full">
          <Outlet />
        </div>
      </div>
      <div className="h-14 bg-white border-t flex items-center justify-end px-6 gap-3">
        <button
          onClick={actions.onBack}
          disabled={activeSection === "S0"}
          className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Back
        </button>

        <button
          onClick={actions.onContinue}
          className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
        >
          Continue
        </button>
        {activeSection === "S0" && <StartNewFileButton />}
      </div>
    </div>
  );
};

export default MainLayout;

// const MainLayout = () => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const { sectionStatus } = useAppStore();
//   const { actions } = useFlowContext();

//   // Deduce activeSection from pathname
//   const match = pathname.match(/^\/(s[0-5])/i);
//   const activeSection = match ? match[1].toUpperCase() : "S0";

//   const setActiveSection = (id: string) => {
//     // Generic navigation to the base route of a section if user clicks navbar.
//     // Real navigation inside sections should be handled by Next buttons, but this works for testing.
//     navigate(`/${id.toLowerCase()}`);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       <Navbar
//         activeSection={activeSection}
//         sectionStatus={sectionStatus}
//         setActiveSection={setActiveSection}
//         logoSrc="/logo.svg"
//       />

//       <Breadcrumb activeSection={activeSection} />
//       {activeSection !== "S0" && <GlobalHeader />}

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-auto bg-white">
//         <div className="bg-white h-full rounded-xl  p-6">
//           <Outlet />
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="h-14 bg-white border-t flex items-center justify-end px-6 gap-3">
//         {/* Back */}
//         <button
//           onClick={actions.onBack}
//           disabled={activeSection === "S0"}
//           className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
//         >
//           Back
//         </button>

//         {/* Save */}
//         <button
//           onClick={actions.onSave}
//           className="px-4 py-2 border rounded-md cursor-pointer"
//         >
//           Save
//         </button>

//         {/* Continue */}
//         <button
//           onClick={actions.onContinue}
//           className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };
