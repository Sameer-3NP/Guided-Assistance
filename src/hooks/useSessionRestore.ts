import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { sessionApi } from "../utils/sessionApi";
import { authApi } from "../utils/authApi";
import { restoreStoreData } from "../utils/sessionSync";

const useSessionRestore = () => {
  const [restoring, setRestoring] = useState(true);
  const navigate = useNavigate();

  const { sessionId, setSectionStatus } = useAppStore();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");

      // no token — not logged in
      if (!token) {
        setRestoring(false);
        return;
      }

      try {
        // verify token + get user
        const user = await authApi.me();
        setUser({
          userId: user.userId,
          name: user.name,
          email: user.email,
        });
        localStorage.setItem("userId", user.userId);

        // restore session if sessionId exists
        if (sessionId) {
          const session = await sessionApi.resume(sessionId);

          if (session) {
            // restore section status
            setSectionStatus(session.sectionStatus);

            // restore all store data
            restoreStoreData(session.storeData);

            // navigate to last screen
            if (session.currentScreen && session.currentScreen !== "/s0") {
              navigate(session.currentScreen);
            }
          }
        }
      } catch {
        // token invalid — clear everything
        clearUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
      } finally {
        setRestoring(false);
      }
    };

    restore();
  }, []);

  return { restoring };
};

export default useSessionRestore;
