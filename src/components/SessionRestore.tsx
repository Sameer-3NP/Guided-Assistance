import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const routeMap = {
  S0: {
    Initialization: "/"
  },
  S4: {
    ChildSupportHandling: "/s4/child-support"
  }
};

const SessionRestore = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const restore = async () => {
      const savedSession = localStorage.getItem("sessionId");
      if (!savedSession) return;

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/session/${savedSession}`
        );
        const data = await res.json();

        if (data.currentSection && data.currentScreen) {
          const path =
            routeMap[data.currentSection]?.[data.currentScreen] ||
            `/${data.currentSection.toLowerCase()}`;

          console.log("➡️ restoring to:", path);
          navigate(path, { replace: true }); // ✅ important
        }
      } catch (err) {
        console.error("Restore failed:", err);
      }
    };

    restore();
  }, [navigate]);

  return null; // no UI
};

export default SessionRestore;