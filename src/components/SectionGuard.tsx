import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

type Props = {
  section: string;
  children: React.ReactNode;
};

const SectionGuard = ({ section, children }: Props) => {
  const sectionStatus = useAppStore((s) => s.sectionStatus);

  if (sectionStatus[section] === "locked") {
    return <Navigate to="/section-0" replace />;
  }

  return <>{children}</>;
};

export default SectionGuard;
