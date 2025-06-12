import clsx from "clsx";
import React, { useState, useRef, useEffect, ReactNode } from "react";

type DropdownOption = {
  label: string | ReactNode;
  value: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  renderOption,
  renderValue,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  renderOption?: (option: DropdownOption) => ReactNode;
  renderValue?: (option: DropdownOption | undefined) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // 點擊外面時關閉選單
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

  // 預設renderValue
  const defaultRenderValue = (option: DropdownOption | undefined) => {
    return option?.label ?? placeholder ?? options[0]?.label;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={clsx(
          "w-full px-4 py-2 rounded-lg bg-gray-light hover:bg-gray-md",
          className
        )}
        onClick={() => setOpen(!open)}
      >
        {renderValue ? renderValue(selected) : defaultRenderValue(selected)}
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-light rounded-lg max-h-40 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === selected?.value;
            return (
              <li
                key={option.value}
                className={clsx("px-4 py-2 hover:bg-gray-md cursor-pointer", {
                  "bg-gray-md": isSelected,
                })}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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

export function FontDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  // 解析字體 family 和 weight
  const parseFont = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);
    return { fontFamily, fontWeight };
  };

  return (
    <Dropdown
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      renderOption={(option) => {
        const { fontFamily, fontWeight } = parseFont(option.value);
        const fontClass = fontClassMap[fontFamily];
        return (
          <div className={fontClass} style={{ fontWeight }}>
            {option.label}
          </div>
        );
      }}
      renderValue={(option) => {
        if (option) {
          const { fontFamily, fontWeight } = parseFont(option.value);
          const fontClass = fontClassMap[fontFamily];
          return (
            <div className={fontClass} style={{ fontWeight }}>
              {option.label}
            </div>
          );
        } else return placeholder;
      }}
    />
  );
}
