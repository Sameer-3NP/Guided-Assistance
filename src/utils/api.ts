export const getSession = async (id: string) => {
  const res = await fetch(
    `http://127.0.0.1:8000/api/session/${id}`
  );
  return res.json();
};

export const createSession = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/session/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "user_123" }),
    });

    if (!res.ok) {
      throw new Error("Failed to create session");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ createSession error:", err);
    return null;
  }
};