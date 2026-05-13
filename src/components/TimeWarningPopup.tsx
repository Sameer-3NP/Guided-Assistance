import { Clock, AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  type: "section" | "screen";
  name: string;
  timeSpent: number;
  threshold: number;
  onContinue: () => void;
  onClose: () => void;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

const TimeWarningPopup = ({
  open,
  type,
  name,
  timeSpent,
  threshold,
  onContinue,
  onClose,
}: Props) => {
  if (!open) return null;

  const overBy = timeSpent - threshold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Time Threshold Exceeded
            </h3>
            <p className="text-xs text-gray-500">
              {type === "section" ? "Section" : "Screen"} — {name}
            </p>
          </div>
        </div>

        {/* Time info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-yellow-600" />
              Time spent
            </span>
            <span className="font-semibold text-gray-800">
              {formatTime(timeSpent)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Threshold</span>
            <span className="font-medium text-gray-600">
              {formatTime(threshold)}
            </span>
          </div>

          <div className="h-px bg-yellow-200" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-700 font-medium">Over by</span>
            <span className="font-bold text-yellow-700">
              +{formatTime(overBy)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>Threshold: {formatTime(threshold)}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{
                width: `${Math.min((timeSpent / threshold) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          You've exceeded the recommended time for this{" "}
          {type === "section" ? "section" : "screen"}. You can still continue.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Dismiss
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeWarningPopup;
