import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSessionRestore from "../hooks/useSessionRestore";

const SessionRestoreLoader = ({ children }: { children: React.ReactNode }) => {
  const { restoring } = useSessionRestore();

  if (restoring) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Restoring your session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionRestoreLoader;
