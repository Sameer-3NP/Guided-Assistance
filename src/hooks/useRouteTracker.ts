import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { syncSession, trackScreenVisit } from "../utils/sessionSync";

const useRouteTracker = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>("");

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    // track screen visit with duration
    trackScreenVisit(currentPath, prevPath);

    // sync session to backend
    syncSession(currentPath);

    // update previous path
    prevPathRef.current = currentPath;
  }, [location.pathname]);
};

export default useRouteTracker;
