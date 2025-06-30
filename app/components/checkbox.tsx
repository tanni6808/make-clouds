export default function Checkbox({
  label,
  isChecked,
  onChange,
}: {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="">
      <label className="flex items-center relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className="appearance-none w-5 h-5 border-4 cursor-pointer rounded checked:bg-primary-dark"
        />
        <span className="pl-1">{label}</span>
      </label>
    </div>
  );
}
