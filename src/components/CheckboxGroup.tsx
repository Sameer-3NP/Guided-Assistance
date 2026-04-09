type Props = {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
};

const CheckboxGroup = ({ label, options, values, onChange }: Props) => {
  const toggleValue = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-gray-800">{label}</div>

      <div className="space-y-2">
        {options.map((option) => {
          const checked = values.includes(option);

          return (
            <label
              key={option}
              className={`flex items-center gap-3   rounded-lg cursor-pointer transition
              `}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(option)}
              />

              <span className="text-sm text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;

/* <label
              key={option}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition
              ${
                checked
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(option)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />

              <span className="text-sm text-gray-700">{option}</span>
            </label> */
