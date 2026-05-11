import { useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { autoSave, updateScreen } from "../api/sessionApi";

export const useAutoSave = () => {
  const { sessionId } = useAppStore();
  const location = useLocation();

  const getSectionAndScreen = () => {
    const parts = location.pathname.split("/").filter(Boolean);

    const section = parts[0]?.toUpperCase(); // s1 → S1
    const screen = parts[1] || "root";

    return { section, screen };
  };

  const save = async (input: any) => {
    if (!sessionId) return;

    const { section, screen } = getSectionAndScreen();

    try {
      await autoSave({
        sessionId,
        section,
        screen,
        input,
      });

      // 🔥 also update current screen
      await updateScreen({
        sessionId,
        section,
        screen,
      });

      console.log("💾 Auto-saved:", section, screen);
    } catch (err) {
      console.error("❌ Auto-save failed", err);
    }
  };

  return { save };
};
