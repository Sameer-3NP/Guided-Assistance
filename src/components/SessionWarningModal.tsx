import { useEffect, useState } from "react";
import { useSessionStore } from "../utils/useSessionStore";
import { resetAllStores } from "../utils/resetAllStores";
import { useNavigate } from "react-router-dom";

const WARNING_TIME = 60 * 1000;

const SessionWarningModal = () => {
  const getRemainingTime = useSessionStore((s) => s.getRemainingTime);
  const updateActivity = useSessionStore((s) => s.updateActivity);

  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingTime();

      if (remaining <= WARNING_TIME && remaining > 0) {
        setShow(true);
        setTimeLeft(Math.ceil(remaining / 1000));
      }

      if (remaining <= 0) {
        resetAllStores();
        navigate("/s0");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStay = () => {
    updateActivity();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-87.5 text-center">
        <h2 className="text-lg font-semibold mb-3">Session Expiring Soon</h2>

        <p className="mb-4 text-sm text-gray-600">
          Your session will expire in <b>{timeLeft}s</b>
        </p>

        <button
          onClick={handleStay}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default SessionWarningModal;
