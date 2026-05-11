import api from "./api";

export const metadataApi = {
  init: async (sessionId: string, userId: string) => {
    const res = await api.post("/api/metadata/init", { sessionId, userId });
    return res.data;
  },

  track: async (
    sessionId: string,
    event: {
      type: string;
      screen: string;
      duration?: number;
      timestamp?: string;
    },
  ) => {
    const res = await api.post("/api/metadata/track", {
      sessionId,
      event: {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
      },
    });
    return res.data;
  },

  get: async (sessionId: string) => {
    const res = await api.get(`/api/metadata/${sessionId}`);
    return res.data;
  },
};
