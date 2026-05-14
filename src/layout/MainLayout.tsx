import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useFlowContext } from "../store/FlowContext";
import GlobalHeader from "../sections/S1/components/GlobalHeaderS1";
import useRouteTracker from "../hooks/useRouteTracker";
// import useTimeTracker from "../hooks/useTimeTracker";
// import TimeWarningPopup from "../components/TimeWarningPopup";
import SessionRestoreLoader from "../components/SessionRestoreLoader";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sectionStatus } = useAppStore();
  const { actions } = useFlowContext();

  // route tracker — syncs session + tracks screen visits
  useRouteTracker();

  // time tracker — tracks section + screen time, shows warning
  // const { warning, handleWarningClose, handleWarningContinue } =
  //   useTimeTracker();

  const match = pathname.match(/^\/(s[0-5])/i);
  const activeSection = match ? match[1].toUpperCase() : "S0";

  const setActiveSection = (id: string) => {
    navigate(`/${id.toLowerCase()}`);
  };

  return (
    <SessionRestoreLoader>
      <div className="h-screen flex flex-col bg-gray-100">
        <Navbar
          activeSection={activeSection}
          sectionStatus={sectionStatus}
          setActiveSection={setActiveSection}
          logoSrc="/logo.svg"
        />

        <Breadcrumb />

        {activeSection !== "S0" && <GlobalHeader />}

        <div className="flex-1 p-6 overflow-auto bg-white rounded-xl">
          <div className="bg-white h-full  rounded-xl p-6">
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
        </div>

        {/* Time Warning Popup */}
        {/* <TimeWarningPopup
          open={warning.open}
          type={warning.type}
          name={warning.name}
          timeSpent={warning.timeSpent}
          threshold={warning.threshold}
          onContinue={handleWarningContinue}
          onClose={handleWarningClose}
        /> */}
      </div>
    </SessionRestoreLoader>
  );
};

export default MainLayout;
