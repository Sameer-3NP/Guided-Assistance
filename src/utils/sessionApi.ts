import api from "./api";

export const sessionApi = {
  start: async (sessionId: string, userId: string) => {
    const res = await api.post("/api/session/start", { sessionId, userId });
    return res.data;
  },

  resume: async (sessionId: string) => {
    const res = await api.get(`/api/session/resume/${sessionId}`);
    return res.data;
  },

  save: async (
    sessionId: string,
    data: {
      currentSection?: string;
      currentScreen?: string;
      completedScreens?: string[];
      sectionStatus?: Record<string, string>;
      storeData?: Record<string, any>;
    },
  ) => {
    const res = await api.patch(`/api/session/save/${sessionId}`, data);
    return res.data;
  },

  complete: async (sessionId: string) => {
    const res = await api.post(`/api/session/complete/${sessionId}`);
    return res.data;
  },

  getAll: async (userId: string) => {
    const res = await api.get(`/api/session/all/${userId}`);
    return res.data;
  },
};
