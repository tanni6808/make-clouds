import Button from "../button";
import { CustomDropdown } from "../dropdown";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";
import { useState } from "react";

export default function ColorPanel() {
  const baseTextColor = useWordCloudStore((s) => s.baseTextColor);
  const setBaseTextColor = useWordCloudStore((s) => s.setBaseTextColor);
  const schemeMode = useWordCloudStore((s) => s.schemeMode);
  const setSchemeMode = useWordCloudStore((s) => s.setSchemeMode);
  const colorSchemes = useWordCloudStore((s) => s.colorSchemes);
  const setRandomColorsFromScheme = useWordCloudStore(
    (s) => s.setRandomColorsFromScheme
  );

  const displayColors =
    schemeMode === "none"
      ? [baseTextColor]
      : colorSchemes.find((s) => s.mode === schemeMode)?.colors || [];

  const handleReRandomColor = () => {
    setRandomColorsFromScheme();
  };
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">顏色</div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="bg-gray-light p-2 rounded-lg">
            <input
              type="color"
              className="w-[20px] h-[24px]"
              value={baseTextColor}
              onChange={(e) => setBaseTextColor(e.target.value)}
            />
          </div>

          <CustomDropdown
            value={schemeMode}
            onChange={(val) => setSchemeMode(val)}
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
        <div className="">
          <div className="text-sm">使用的顏色：</div>
          <div className="flex gap-2 bg-gray-light p-2 rounded-lg">
            {displayColors.map((c, i) => (
              <button
                key={i}
                className={`w-[30px] h-[30px] rounded-[50%]`}
                style={{ backgroundColor: c, color: c }}
              >
                一
              </button>
            ))}
          </div>
        </div>

        <Button style="hollow" onClick={handleReRandomColor}>
          重新隨機上色
        </Button>
      </div>
    </div>
  );
}
