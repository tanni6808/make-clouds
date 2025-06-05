import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

import {
  Noto_Sans_TC,
  Noto_Serif_TC,
  Chocolate_Classical_Sans,
  LXGW_WenKai_TC,
  Cactus_Classical_Serif,
} from "next/font/google";

const notoSansTC = Noto_Sans_TC({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

//////// For weak internet environment /////////
// const notoSerifTC = Noto_Sans_TC({
//   weight: ["300", "400", "700", "900"],
//   subsets: ["latin"],
// });

// const chocoClassicalSans = Noto_Sans_TC({
//   weight: ["300", "400", "700", "900"],
//   subsets: ["latin"],
// });

// const lxgwWenKaiTC = Noto_Sans_TC({
//   weight: ["300", "400", "700", "900"],
//   subsets: ["latin"],
// });

// const cactusClassicalSerif = Noto_Sans_TC({
//   weight: ["300", "400", "700", "900"],
//   subsets: ["latin"],
// });
////////////////////////////////////////////////

const notoSerifTC = Noto_Serif_TC({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const chocoClassicalSans = Chocolate_Classical_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

const lxgwWenKaiTC = LXGW_WenKai_TC({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const cactusClassicalSerif = Cactus_Classical_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const fontClassMap: Record<string, string> = {
  "Noto Sans TC": notoSansTC.className,
  "Noto Serif TC": notoSerifTC.className,
  "Chocolate Classical Sans": chocoClassicalSans.className,
  "LXGW WenKai TC": lxgwWenKaiTC.className,
  "Cactus Classical Serif": cactusClassicalSerif.className,
};

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

type FontDropdownProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
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
              className={`px-4 py-2 hover:bg-gray-md cursor-pointer ${
                option.value === selected?.value ? "bg-gray-md" : ""
              }`}
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

export function FontDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
}: FontDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

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

  // 解析字體 family 和 weight
  const parseFont = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);
    return { fontFamily, fontWeight };
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className={clsx(
          "px-4 py-2 rounded-lg bg-gray-light hover:bg-gray-md w-full",
          className,
          selected && fontClassMap[parseFont(selected.value).fontFamily]
        )}
        style={{
          fontWeight: selected
            ? parseFont(selected.value).fontWeight
            : undefined,
        }}
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder || options[2].label}
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-light rounded-lg max-h-40 overflow-y-auto">
          {options.map((option) => {
            const { fontFamily, fontWeight } = parseFont(option.value);
            const fontClass = fontClassMap[fontFamily];
            return (
              <li
                key={option.value}
                className={clsx(
                  "px-4 py-2 hover:bg-gray-md cursor-pointer",
                  fontClass,
                  `${option.value === selected?.value ? "bg-gray-md" : ""}`
                )}
                style={{ fontWeight }}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
