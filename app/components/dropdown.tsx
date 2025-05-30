import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // 關閉選單：點擊外面時
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={clsx(
          "px-4 py-2 rounded-lg bg-gray-light hover:bg-gray-md",
          className
        )}
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder || options[0].label}
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-light rounded-lg max-h-40 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-gray-md cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
