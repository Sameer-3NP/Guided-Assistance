import { type ReactNode, type ReactElement } from "react";

type Props = {
  open?: boolean;
  title?: string;
  icon?: ReactElement;
  children?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideFooter?: boolean;
  width?: string;
};

const PopUp = ({
  open,
  title,
  icon,
  children,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  hideFooter = false,
  width = "w-[420px]",
}: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm h-full"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${width} p-7 animate-[fadeIn_.25s_ease]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
          </div>
        )}

        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
            {title}
          </h2>
        )}

        {/* Body */}
        <div className="space-y-3 text-sm text-gray-700 mb-5">{children}</div>

        {/* Footer */}
        {!hideFooter && (
          <div className="flex justify-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {cancelText}
              </button>
            )}

            <button
              onClick={onConfirm ?? onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;
