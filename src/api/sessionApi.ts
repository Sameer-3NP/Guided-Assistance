const BASE_URL = "http://localhost:8000/api";

export const createSession = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/session/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  return res.json();
};

export const autoSave = async (payload: {
  sessionId: string;
  section: string;
  screen: string;
  input: string;
}) => {
  const res = await fetch(`${BASE_URL}/flow/auto-save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const getSession = async (sessionId: string) => {
  const res = await fetch(`${BASE_URL}/session/${sessionId}`);
  return res.json();
};

export const updateScreen = async (payload: {
  sessionId: string;
  section: string;
  screen: string;
}) => {
  const res = await fetch(`${BASE_URL}/session/update-screen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};
