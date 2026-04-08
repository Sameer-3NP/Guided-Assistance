import { type ReactNode, type ReactElement } from "react";

type Props = {
  open?: boolean;
  title?: string;
  icon?: ReactElement;
  children?: ReactNode;
  onClose?: () => void;
  show?: boolean;
  width?: string;
};

const PopUp = ({ open, title, icon, children, onClose }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-105 p-7 animate-[fadeIn_.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}{" "}
        <div className="flex justify-center mb-4">
          {" "}
          <div className="bg-blue-100 p-3 rounded-full">{icon} </div>{" "}
        </div>
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          {title}
        </h2>
        {/* Body */}
        <div className="space-y-3 text-sm text-gray-700 mb-5">{children}</div>
        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
