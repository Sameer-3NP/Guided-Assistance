import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../utils/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { sessionApi } from "../utils/sessionApi";
import { metadataApi } from "../utils/metadataApi";
import { restoreStoreData } from "../utils/sessionSync";
import { resetAllStores } from "../utils/resetAllStores";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.register(form.name, form.email, form.password);

      // ← clear all previous store data first
      resetAllStores();

      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
      });

      localStorage.setItem("userId", data.userId);

      const sessionData = await sessionApi.start(
        data.userId,
        data.name,
        data.email,
      );

      const session = sessionData.session;
      const sessionId = session.sessionId;

      useAppStore.getState().setSessionId(sessionId);
      useAppStore.getState().setSectionStatus(session.sectionStatus);

      await metadataApi.init(sessionId, data.userId);

      toast.success(`Welcome, ${data.name}!`);
      navigate("/s0");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail[0]?.msg || "Something went wrong"
            : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Create account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Start your guided assistance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
