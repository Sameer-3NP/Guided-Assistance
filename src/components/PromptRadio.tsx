type Props = {
  label: string;
  value: string | null;
  options: string[];
  onChange: (val: string) => void;
};

const PromptRadio = ({ label, value, options, onChange }: Props) => {
  return (
    <>
      <div className="items-start gap-3 bg-blue-100 border border-blue-200 rounded-xl p-3 ">
        <p className="text-md font-semibold text-black">{label}</p>
      </div>
      <div className="flex gap-6">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </>
  );
};

export default PromptRadio;
