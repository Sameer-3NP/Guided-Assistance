// components/SessionHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useSessionStore } from "../utils/useSessionStore";
import { resetAllStores } from "../utils/resetAllStores";

const SessionHandler = () => {
  const isExpired = useSessionStore((s) => s.isExpired);
  const updateActivity = useSessionStore((s) => s.updateActivity);

  const navigate = useNavigate();

  useEffect(() => {
    // 🔴 Check session on app load
    if (isExpired()) {
      resetAllStores();
      toast("Session expired. Starting new file.");
      navigate("/s0");
    }

    // 🟢 Track user activity
    const events = ["click", "keydown", "mousemove"];

    let timeout: ReturnType<typeof setTimeout>;

    const handleActivity = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateActivity();
      }, 500);
    };

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
  }, []);

  return null; // no UI
};

export default SessionHandler;
