import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  SECTION_THRESHOLDS,
  SCREEN_THRESHOLD,
} from "../constants/timeThresholds";

type WarningState = {
  open: boolean;
  type: "section" | "screen";
  name: string;
  timeSpent: number;
  threshold: number;
};

const getSectionFromPath = (path: string): string => {
  const match = path.match(/^\/(s[0-5])/i);
  return match ? match[1].toUpperCase() : "S0";
};

const useTimeTracker = () => {
  const location = useLocation();
  const {
    startSectionTimer,
    stopSectionTimer,
    startScreenTimer,
    stopScreenTimer,
    // timeTracking,
  } = useAppStore();

  const [warning, setWarning] = useState<WarningState>({
    open: false,
    type: "section",
    name: "",
    timeSpent: 0,
    threshold: 0,
  });

  const currentSectionRef = useRef<string>("");
  const currentScreenRef = useRef<string>("");
  const sectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const screenIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionWarningShownRef = useRef<Record<string, boolean>>({});
  const screenWarningShownRef = useRef<Record<string, boolean>>({});

  // clear intervals
  const clearIntervals = () => {
    if (sectionIntervalRef.current) clearInterval(sectionIntervalRef.current);
    if (screenIntervalRef.current) clearInterval(screenIntervalRef.current);
  };

  // start section interval checker
  const startSectionChecker = (section: string) => {
    if (sectionIntervalRef.current) clearInterval(sectionIntervalRef.current);

    sectionIntervalRef.current = setInterval(() => {
      const { timeTracking } = useAppStore.getState();
      if (!timeTracking.sectionStartTime) return;

      const elapsed =
        (timeTracking.sectionTimes[section] || 0) +
        Math.floor((Date.now() - timeTracking.sectionStartTime) / 1000);

      const threshold = SECTION_THRESHOLDS[section];

      if (
        threshold &&
        elapsed >= threshold &&
        !sectionWarningShownRef.current[section]
      ) {
        sectionWarningShownRef.current[section] = true;
        setWarning({
          open: true,
          type: "section",
          name: section,
          timeSpent: elapsed,
          threshold,
        });
      }
    }, 1000);
  };

  // start screen interval checker
  const startScreenChecker = (screen: string) => {
    if (screenIntervalRef.current) clearInterval(screenIntervalRef.current);

    screenIntervalRef.current = setInterval(() => {
      const { timeTracking } = useAppStore.getState();
      if (!timeTracking.screenStartTime) return;

      const elapsed = Math.floor(
        (Date.now() - timeTracking.screenStartTime) / 1000,
      );

      if (
        elapsed >= SCREEN_THRESHOLD &&
        !screenWarningShownRef.current[screen]
      ) {
        screenWarningShownRef.current[screen] = true;
        setWarning({
          open: true,
          type: "screen",
          name: screen,
          timeSpent: elapsed,
          threshold: SCREEN_THRESHOLD,
        });
      }
    }, 1000);
  };

  useEffect(() => {
    const newPath = location.pathname;
    const newSection = getSectionFromPath(newPath);
    const prevSection = currentSectionRef.current;
    const prevScreen = currentScreenRef.current;

    // --- SCREEN CHANGE ---
    if (prevScreen && prevScreen !== newPath) {
      stopScreenTimer(prevScreen);
    }
    startScreenTimer(newPath);
    startScreenChecker(newPath);

    // --- SECTION CHANGE ---
    if (prevSection && prevSection !== newSection) {
      stopSectionTimer(prevSection);
      // reset warning for new section
      sectionWarningShownRef.current[newSection] = false;
      startSectionTimer(newSection);
      startSectionChecker(newSection);
    } else if (!prevSection) {
      startSectionTimer(newSection);
      startSectionChecker(newSection);
    }

    currentSectionRef.current = newSection;
    currentScreenRef.current = newPath;

    return () => {
      clearIntervals();
    };
  }, [location.pathname]);

  const handleWarningClose = () => {
    setWarning((prev) => ({ ...prev, open: false }));
  };

  const handleWarningContinue = () => {
    setWarning((prev) => ({ ...prev, open: false }));
  };

  return {
    warning,
    handleWarningClose,
    handleWarningContinue,
  };
};

export default useTimeTracker;
