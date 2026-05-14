import { Plus, X } from "lucide-react";

type Props = {
  items: string[];
  selectedItems: string[];
  customItems: string[];
  onToggle: (item: string) => void;
  onCustomChange: (value: string[] | ((prev: string[]) => string[])) => void;
};

const DynamicChecklist = ({
  items,
  selectedItems,
  customItems,
  onToggle,
  onCustomChange,
}: Props) => {
  return (
    <div className="space-y-4">
      {/* Default Checklist */}
      {items.map((item) => (
        <label key={item} className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => onToggle(item)}
            className="mt-1"
          />

          <span className="text-sm text-gray-700">{item}</span>
        </label>
      ))}

      {/* Custom Checklist */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onCustomChange((prev) => [...prev, ""])}
          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add custom item
        </button>

        {customItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
          >
            <input
              type="checkbox"
              checked={!!item.trim()}
              readOnly
              className="mt-2.5 accent-blue-500 w-3.5 h-3.5 shrink-0"
            />

            <textarea
              rows={1}
              placeholder="Enter custom checklist item..."
              value={item}
              onChange={(e) => {
                const updated = [...customItems];

                updated[index] = e.target.value;

                onCustomChange(updated);
              }}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none resize-none leading-relaxed pt-1"
            />

            <button
              type="button"
              onClick={() =>
                onCustomChange((prev) => prev.filter((_, i) => i !== index))
              }
              className="mt-1.5 flex items-center justify-center w-5 h-5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicChecklist;
