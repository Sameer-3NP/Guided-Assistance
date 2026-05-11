import { sessionApi } from "./sessionApi";
import { metadataApi } from "./metadataApi";
import { useAppStore } from "../store/useAppStore";
import { useS0Store } from "../store/useS0Store";
import { useS1Store } from "../store/useS1Store";
import { useS2Store } from "../store/useS2Store";
import { useS3Store } from "../store/useS3Store";
import { useS4Store } from "../store/useS4Store";
import { useS5Store } from "../store/useS5Store";

let screenStartTime = Date.now();
let previousScreen = "";

// ---------- COLLECT ALL STORE DATA ----------

const collectStoreData = () => {
  const s0 = useS0Store.getState().s0;
  const s1 = useS1Store.getState();
  const s2 = useS2Store.getState();
  const s3 = useS3Store.getState();
  const s4 = useS4Store.getState();
  const s5 = useS5Store.getState();

  return { s0, s1, s2, s3, s4, s5 };
};

// ---------- SAVE SESSION TO BACKEND ----------

export const syncSession = async (currentScreen: string) => {
  const { sessionId, sectionStatus } = useAppStore.getState();

  if (!sessionId) return;

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  // derive current section from screen
  const match = currentScreen.match(/^\/(s[0-5])/i);
  const currentSection = match ? match[1].toUpperCase() : "S0";

  try {
    await sessionApi.save(sessionId, {
      currentSection,
      currentScreen,
      sectionStatus,
      storeData: collectStoreData(),
    });
  } catch (err) {
    console.error("Session sync failed:", err);
  }
};

// ---------- TRACK SCREEN VISIT ----------

export const trackScreenVisit = async (
  newScreen: string,
  prevScreen?: string,
) => {
  const { sessionId } = useAppStore.getState();
  if (!sessionId) return;

  const now = Date.now();
  const duration = Math.floor((now - screenStartTime) / 1000);

  // track previous screen with duration
  if (prevScreen || previousScreen) {
    try {
      await metadataApi.track(sessionId, {
        type: "screen_visit",
        screen: prevScreen || previousScreen,
        duration,
      });
    } catch (err) {
      console.error("Metadata track failed:", err);
    }
  }

  // reset timer for new screen
  screenStartTime = now;
  previousScreen = newScreen;
};

// ---------- TRACK CONTINUE / BACK ----------

export const trackAction = async (
  type: "continue" | "back",
  screen: string,
) => {
  const { sessionId } = useAppStore.getState();
  if (!sessionId) return;

  try {
    await metadataApi.track(sessionId, {
      type,
      screen,
      duration: 0,
    });
  } catch (err) {
    console.error("Action track failed:", err);
  }
};

// ---------- RESUME SESSION ----------

export const resumeSession = async (sessionId: string) => {
  try {
    const session = await sessionApi.resume(sessionId);

    // restore section status
    useAppStore.getState().setSectionStatus(session.sectionStatus);

    // restore store data
    if (session.storeData?.s0) {
      useS0Store.getState().setS0(session.storeData.s0);
    }

    return session;
  } catch (err) {
    console.error("Resume session failed:", err);
    return null;
  }
};
