import api from "./api";

export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post("/api/auth/register", { name, email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("accessToken");
  },

  me: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  refresh: async () => {
    const res = await api.post("/api/auth/refresh");
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  },
};
