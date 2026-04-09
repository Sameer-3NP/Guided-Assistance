import { AlertTriangle, CheckCircle, Info } from "lucide-react";

type Props = {
  type?: "condition" | "success" | "info";
  message: string;
};

const styles = {
  condition:
    "border-red-400 bg-red-50 text-red-700",
  success:
    "border-green-400 bg-green-50 text-green-700",
  info:
    "border-blue-400 bg-blue-50 text-blue-700",
};

const icons = {
  condition: <AlertTriangle className="w-4 h-4" />,
  success: <CheckCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

const ConditionBanner = ({
  type = "info",
  message,
}: Props) => {
  return (
    <div
      className={`flex items-center gap-2 border p-3 rounded text-sm ${styles[type]}`}
    >
      {icons[type]}
      {message}
    </div>
  );
};

export default ConditionBanner;