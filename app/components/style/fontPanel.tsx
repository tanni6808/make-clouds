import { CustomDropdown } from "../dropdown";

import { useState } from "react";

export default function FontPanel() {
  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  const [selectedFontWeight, setSelectedFontWeight] = useState("");
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">字型</div>
      <div className="flex flex-col gap-2">
        <CustomDropdown
          value={selectedFontFamily}
          onChange={setSelectedFontFamily}
          options={[
            { label: "Noto sans TC", value: "Noto sans TC" },
            { label: "Noto serif TC", value: "Noto serif TC" },
          ]}
          className="w-[100%]"
        ></CustomDropdown>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <CustomDropdown
            value={selectedFontWeight}
            onChange={setSelectedFontWeight}
            options={[
              { label: "Bold", value: "bold" },
              { label: "Black", value: "black" },
            ]}
            className="w-[100%]"
          ></CustomDropdown>
          <button className="text-center rounded-lg w-[40px] h-[40px] bg-gray-light italic hover:bg-gray-md">
            I
          </button>
          <button className="text-center rounded-lg w-[40px] h-[40px] bg-gray-light underline hover:bg-gray-md">
            U
          </button>
        </div>
      </div>
    </div>
  );
}
