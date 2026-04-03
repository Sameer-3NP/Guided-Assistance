import { Outlet } from "react-router-dom";
import GlobalHeader from "./components/GlobalHeaderS1";

const SectionLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <GlobalHeader />

      {/* Section Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SectionLayout;
