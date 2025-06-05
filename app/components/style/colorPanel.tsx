import Button from "../button";
import { CustomDropdown } from "../dropdown";
import { BaseColorPicker, CustomColorPicker } from "../colorPicker";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";
import { useState, useEffect } from "react";

export default function ColorPanel() {
  const baseTextColor = useWordCloudStore((s) => s.baseTextColor);
  const setBaseTextColor = useWordCloudStore((s) => s.setBaseTextColor);
  const schemeMode = useWordCloudStore((s) => s.schemeMode);
  const setSchemeMode = useWordCloudStore((s) => s.setSchemeMode);
  const colorSchemes = useWordCloudStore((s) => s.colorSchemes);
  const customColorScheme = useWordCloudStore((s) => s.customColorScheme);
  const setCustomColorScheme = useWordCloudStore((s) => s.setCustomColorScheme);
  const setRandomColorsFromScheme = useWordCloudStore(
    (s) => s.setRandomColorsFromScheme
  );
  const [displayColors, setDisplayColors] = useState<string[]>([]);

  const handleColorChange = (i: number, newColor: string) => {
    const newColors = [...displayColors];
    newColors[i] = newColor;
    setDisplayColors(newColors);

    setSchemeMode("custom");
    setCustomColorScheme(newColors);
  };

  const handleDelete = (i: number) => {
    const newColors = displayColors.filter((_, index) => index !== i);
    setDisplayColors(newColors);

    setSchemeMode("custom");
    setCustomColorScheme(newColors);
  };

  const handleAddColor = () => {
    const newColors = [...displayColors, baseTextColor];
    setDisplayColors(newColors);

    setSchemeMode("custom");
    setCustomColorScheme(newColors);
  };

  useEffect(() => {
    if (schemeMode === "none") {
      setDisplayColors([]);
    } else if (schemeMode === "custom") {
      setDisplayColors(customColorScheme);
    } else {
      const matched = colorSchemes.find((s) => s.mode === schemeMode);
      if (matched) {
        const allColors = matched.colors;
        const closestColorIndex = findClosestColorIndex(
          baseTextColor,
          matched.colors
        );
        allColors.splice(closestColorIndex, 1);
        return setDisplayColors(allColors);
      }
      setDisplayColors([]);
    }
  }, [schemeMode, baseTextColor, colorSchemes]);

  // useEffect(() => {
  //   if (displayColors.length > 0) {
  //     setCustomColorScheme(displayColors);
  //     setSchemeMode("custom");
  //   }
  // }, [displayColors]);

  const handleReRandomColor = () => {
    setRandomColorsFromScheme();
  };
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">顏色</div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="bg-gray-light p-2 rounded-lg h-[40px] w-[40px]">
            <BaseColorPicker
              color={baseTextColor}
              onChange={(hex) => setBaseTextColor(hex)}
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
              { label: "自訂", value: "custom" },
            ]}
            className="w-[100%]"
          ></CustomDropdown>
        </div>
        <div className="">
          <div className="text-sm">調整顏色：</div>
          <div className="flex justify-center gap-1 bg-gray-light p-2 rounded-lg">
            {displayColors.map((c, i) => (
              <CustomColorPicker
                key={i}
                color={c}
                onChange={(newColor) => {
                  handleColorChange(i, newColor);
                }}
                onDelete={() => handleDelete(i)}
              />
            ))}
            {displayColors.length < 5 && (
              <button
                className="w-[30px] h-[30px] rounded-full border-2 border-dashed border-gray-400 bg-gray-200 text-gray-700 flex items-center justify-center"
                onClick={handleAddColor}
              >
                +
              </button>
            )}
          </div>
        </div>

        <Button style="hollow" onClick={handleReRandomColor}>
          重新隨機上色
        </Button>
      </div>
    </div>
  );
}

// 將 hex 轉成 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

// 計算兩個 RGB 顏色之間的距離
function colorDistance(c1: string, c2: string): number {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  if (!rgb1 || !rgb2) return Infinity;

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
}

// 找出最接近 baseColor 的顏色索引
function findClosestColorIndex(baseColor: string, colorList: string[]): number {
  let minDistance = Infinity;
  let minIndex = -1;
  for (let i = 0; i < colorList.length; i++) {
    const dist = colorDistance(baseColor, colorList[i]);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }
  return minIndex;
}
