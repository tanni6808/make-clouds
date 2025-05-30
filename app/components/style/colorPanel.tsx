import Button from "../button";
import { CustomDropdown } from "../dropdown";

import { useState } from "react";

export default function ColorPanel() {
  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  //   const [selectedFontWeight, setSelectedFontWeight] = useState("");
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">顏色</div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="bg-gray-light p-2 rounded-lg">
            <input type="color" className="w-[20px] h-[24px]" />
          </div>

          <CustomDropdown
            value={selectedFontFamily}
            onChange={setSelectedFontFamily}
            options={[
              { label: "單一顏色", value: "none" },
              { label: "單色調", value: "monochrome" },
              { label: "相似色", value: "analogic" },
              { label: "互補色", value: "complement" },
              { label: "色環三分", value: "triad" },
              { label: "色環矩形", value: "quad" },
            ]}
            className="w-[100%]"
          ></CustomDropdown>
        </div>
        {/* <div className="flex gap-2 bg-gray-light p-2 rounded-lg">
          <button className="w-[30px] h-[30px] rounded-[50%] bg-gray-md">
            十
          </button>
          <button className="w-[30px] h-[30px] rounded-[50%] bg-gray-md">
            十
          </button>
          <button className="w-[30px] h-[30px] rounded-[50%] bg-gray-md">
            十
          </button>
          <button className="w-[30px] h-[30px] rounded-[50%] bg-gray-md">
            十
          </button>
          <button className="w-[30px] h-[30px] rounded-[50%] bg-gray-md">
            十
          </button>
        </div> */}
        <Button style="hollow">重新隨機上色</Button>
      </div>
    </div>
  );
}
