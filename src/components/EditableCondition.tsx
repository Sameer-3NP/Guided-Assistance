import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Pencil,
  Check,
  AlertCircle,
} from "lucide-react";

type Type = "condition" | "success" | "info" | "alert";

type Props = {
  type?: Type;
  value: string;
  onChange?: (val: string) => void;
};

const styles = {
  condition: "border-red-400 bg-red-50 text-red-700",
  success: "border-green-400 bg-green-50 text-green-700",
  alert: "border-yellow-400 bg-yellow-50 text-yellow-700",
  info: "border-blue-400 bg-blue-50 text-blue-700",
};

const icons = {
  condition: <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />,
  alert: <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />,
  success: <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />,
  info: <Info className="w-5 h-5 mt-0.5 shrink-0" />,
};

const EditableCondition = ({ type = "info", value, onChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`flex items-start gap-2 border p-4 rounded-lg text-sm ${styles[type]}`}
    >
      {icons[type]}

      <div className="flex-1">
        {isEditing ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={value.split("\n").length + 1}
            className="w-full bg-transparent outline-none border-b resize-none text-sm"
            autoFocus
          />
        ) : (
          <p className="whitespace-pre-wrap">{value}</p>
        )}
      </div>

      {/* Only show edit button if onChange is provided */}
      {onChange && (
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="hover:opacity-80 shrink-0"
        >
          {isEditing ? (
            <Check className="w-4 h-4" />
          ) : (
            <Pencil className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default EditableCondition;
