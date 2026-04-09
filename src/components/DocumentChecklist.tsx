type Props = {
  title: string;
  items: string[];
  selected: string[];
  onChange: (items: string[]) => void;
};

const DocumentChecklist = ({ title, items, selected, onChange }: Props) => {
  const toggleItem = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    onChange(updated);
  };

  return (
    <div className="border rounded-xl p-6 bg-blue-50 shadow-sm space-y-4">
      <div className="font-semibold text-gray-800">{title}</div>

      {items.map((item) => (
        <label key={item} className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggleItem(item)}
            className="mt-1"
          />
          {item}
        </label>
      ))}
    </div>
  );
};

export default DocumentChecklist;
