import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetAllStores } from "../utils/resetAllStores";

const StartNewFileButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (loading) return;
    setLoading(true);

    resetAllStores();
    toast.success("New file started successfully");
    navigate("/s0");
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Start New File
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-87.5">
            <h2 className="text-lg font-semibold mb-3">Start New File?</h2>

            <p className="text-sm text-gray-600 mb-5">
              This will clear all entered data. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-1 bg-red-500 text-white rounded "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StartNewFileButton;
