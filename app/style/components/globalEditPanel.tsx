// import clsx from "clsx";
import { nanoid } from "nanoid";

import {
  FontStyle,
  RGBAColor,
  TextColorPaletteSlot,
} from "@/app/lib/definitions";
import Button from "@/app/components/button";
import Counter from "@/app/components/counter";
import TabSwitcher from "@/app/components/tabSwitcher";
import { Dropdown } from "@/app/components/dropdown";
import ColorPicker, { ColorAndAlphaPicker } from "@/app/components/colorPicker";
import { FontDropdown } from "@/app/components/dropdown";
import { useWordCloudStore } from "@/app/lib/useWordCloudStore";

import { useState, useEffect, useCallback } from "react";

export default function GlobalEditPanel() {
  // font panel
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const setGlobalFontStyle = useWordCloudStore((s) => s.setGlobalFontStyle);
  const parseFont = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);
    return { fontFamily, fontWeight };
  };
  const handleFontChange = (value: string) => {
    const { fontFamily, fontWeight } = parseFont(value);
    setGlobalFontStyle({ fontFamily, fontWeight });
  };
  const handleChange = (key: keyof FontStyle, value: any) => {
    const updates = { [key]: value };
    setGlobalFontStyle({ ...updates });
  };

  // color panel
  const {
    defaultTextColor,
    textColorPalette,
    schemeMode,
    colorSchemes,
    updatePaletteSlot,
    setTextColorPalette,
    setRandomTextColor,
    setSchemeMode,
    setColorSchemes,
  } = useWordCloudStore();
  const [currentColorEditTab, setCurrentColorEditTab] =
    useState<string>("color");

  const handleChangeColorEditTab = (tabValue: string) => {
    setCurrentColorEditTab(tabValue);
  };

  const handleColorAdd = () => {
    const palette = textColorPalette;
    if (palette.length === 0) setSchemeMode("none");
    else setSchemeMode("custom");
    const defaultNewColor = palette[0]?.color ?? defaultTextColor;
    const newSlot: TextColorPaletteSlot = {
      id: `slot-${nanoid(6)}`,
      color: defaultNewColor,
    };

    setTextColorPalette([...palette, newSlot]);
    setRandomTextColor();
  };

  const handleColorChange = (i: number, newColor: string) => {
    const palette = textColorPalette;
    if (palette.length === 1) setSchemeMode("none");
    else setSchemeMode("custom");
    const slotToUpdate = palette[i];
    if (!slotToUpdate) return;

    updatePaletteSlot(slotToUpdate.id, newColor);
  };

  const handleColorDelete = (index: number) => {
    const palette = textColorPalette;
    const slotToRemove = palette[index];
    if (!slotToRemove) return;

    const newPalette = palette.filter((_, i) => i !== index);
    if (newPalette.length === 1) setSchemeMode("none");
    else setSchemeMode("custom");

    setTextColorPalette(newPalette);
    setRandomTextColor();
  };

  const handleChangeColorScheme = (schemeMode: string) => {
    setSchemeMode(schemeMode);
    const palette = textColorPalette;
    if (schemeMode === "custom" || schemeMode === "none") {
      setTextColorPalette([palette[0]]);
      setRandomTextColor();
    }
    const scheme = colorSchemes.find((s) => s.mode === schemeMode)?.colors;
    if (!scheme) return;
    const baseColorIndex = findClosestColorIndex(palette[0].color, scheme);
    const remainColors = scheme.filter((_, i) => i !== baseColorIndex);
    const newPaletteFromScheme = remainColors.map((c) => ({
      id: `slot-${nanoid(6)}`,
      color: c,
    }));
    setTextColorPalette([palette[0], ...newPaletteFromScheme]);
    setRandomTextColor();
  };

  useEffect(() => {
    if (textColorPalette.length === 0) return;

    const fetchColorSchemes = async () => {
      const schemeAndCount = [
        { scheme: "monochrome", count: "3" },
        { scheme: "analogic", count: "3" },
        { scheme: "complement", count: "2" },
        { scheme: "triad", count: "3" },
        { scheme: "quad", count: "4" },
      ];
      const hex = textColorPalette[0].color.replace("#", "");
      const results = await Promise.all(
        schemeAndCount.map(({ scheme, count }) =>
          fetch(
            `https://www.thecolorapi.com/scheme?hex=${hex}&format=json&mode=${scheme}&count=${count}`
          ).then((res) => res.json())
        )
      );

      const allColorSchemes = results.map((result) => ({
        mode: result.mode,
        colors: result.colors.map(
          (color: { hex: { value: any } }) => color.hex.value
        ),
      }));

      setColorSchemes(allColorSchemes);
      // setRandomTextColor(); // 更新詞彙顏色
    };

    fetchColorSchemes();
  }, [textColorPalette, schemeMode]);

  // 陰影
  const globalTextShadow = useWordCloudStore((s) => s.globalTextShadow);
  const setGlobalTextShadow = useWordCloudStore((s) => s.setGlobalTextShadow);
  const handleShadowX = useCallback(
    (dx: number) => {
      setGlobalTextShadow({ dx: dx });
    },
    [globalTextShadow.dx]
  );
  const handleShadowY = useCallback(
    (dy: number) => {
      setGlobalTextShadow({ dy: dy });
    },
    [globalTextShadow.dy]
  );
  const handleShadowBlur = useCallback(
    (blur: number) => {
      setGlobalTextShadow({ blur: blur });
    },
    [globalTextShadow.blur]
  );
  const handleShadowRGBA = useCallback(
    (color: RGBAColor) => {
      setGlobalTextShadow({ rgba: color });
    },
    [globalTextShadow.rgba]
  );

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3">
      <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
        <div className="text-center mb-[10px]">字型</div>
        <div className="flex flex-col gap-2">
          <FontDropdown
            value={`${globalFontStyle.fontFamily} ${globalFontStyle.fontWeight}`}
            onChange={(val) => handleFontChange(val)}
            options={[
              { label: "思源黑體 細", value: "Noto Sans TC 300" },
              { label: "思源黑體 標準", value: "Noto Sans TC 400" },
              { label: "思源黑體 粗", value: "Noto Sans TC 700" },
              { label: "思源黑體 濃", value: "Noto Sans TC 900" },
              { label: "思源宋體 細", value: "Noto Serif TC 300" },
              { label: "思源宋體 標準", value: "Noto Serif TC 400" },
              { label: "思源宋體 粗", value: "Noto Serif TC 700" },
              { label: "思源宋體 濃", value: "Noto Serif TC 900" },
              {
                label: "朱古力黑體 標準",
                value: "Chocolate Classical Sans 400",
              },
              { label: "霞鶩文楷 細", value: "LXGW WenKai TC 300" },
              { label: "霞鶩文楷 標準", value: "LXGW WenKai TC 400" },
              { label: "霞鶩文楷 粗", value: "LXGW WenKai TC 700" },
              {
                label: "仙人掌明體 標準",
                value: "Cactus Classical Serif 400",
              },
            ]}
            placeholder="思源黑體 粗"
          />
          <div className="grid grid-cols-[1fr] gap-2">
            <button
              className={`text-center rounded-lg h-[40px] italic ${
                globalFontStyle.italic
                  ? "bg-primary-dark text-white hover:bg-primary-light"
                  : "bg-gray-light hover:bg-gray-md"
              }`}
              onClick={() => handleChange("italic", !globalFontStyle.italic)}
            >
              斜體
            </button>
            {/* <button
              className={`text-center rounded-lg h-[40px] underline ${
                globalFontStyle.underline
                  ? "bg-primary-dark text-white hover:bg-primary-light"
                  : "bg-gray-light hover:bg-gray-md"
              }`}
              onClick={() =>
                handleChange("underline", !globalFontStyle.underline)
              }
            >
              底線
            </button> */}
          </div>
        </div>
      </div>
      <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
        <div className="text-center mb-[10px]">文字顏色</div>
        <TabSwitcher
          tabs={[
            { label: "顏色", value: "color" },
            { label: "陰影", value: "shadow" },
          ]}
          current={currentColorEditTab}
          onChange={handleChangeColorEditTab}
          className="px-7"
        />
        {currentColorEditTab === "color" && (
          <div className="flex flex-col justify-end gap-2 mt-3">
            <div className="flex justify-center gap-1 bg-gray-light p-2 rounded-lg">
              {textColorPalette.map((c, i) => (
                <ColorPicker
                  key={c.id}
                  color={c.color}
                  onChange={(newColor) => {
                    handleColorChange(i, newColor);
                  }}
                  onDelete={() => handleColorDelete(i)}
                />
              ))}
              {textColorPalette.length < 5 && (
                <button
                  className="w-[30px] h-[30px] rounded-full border-2 border-dashed border-gray-400 bg-gray-200 text-gray-700 flex items-center justify-center"
                  onClick={handleColorAdd}
                >
                  +
                </button>
              )}
            </div>
            <div className="">
              <div className="text-sm">從配色方案自動挑選:</div>
              {textColorPalette.length === 0 ? (
                <div className="bg-gray-light text-center text-primary-light rounded py-2">
                  尚未選擇顏色
                </div>
              ) : (
                <Dropdown
                  value={schemeMode}
                  onChange={(val) => handleChangeColorScheme(val)}
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
                  renderOption={(option) => (
                    <div className="flex items-center">
                      <div className="">{option.label}</div>
                      <div className="">
                        <div className="flex">
                          {colorSchemes
                            .find((s) => s.mode === option.value)
                            ?.colors.map((c, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-[50%] border-2 border-primary-dark mx-[1px]"
                                style={{ backgroundColor: c }}
                              ></div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
            <Button style="hollow" onClick={() => setRandomTextColor()}>
              重新隨機上色
            </Button>
          </div>
        )}
        {currentColorEditTab === "shadow" && (
          <div className="mt-2 flex flex-col ">
            <div className="my-1">
              {/* // TODO <ul className="flex items-center gap-1">
                <li className="px-0.5 mx-0.5 rounded-xl outline-3">全部</li>
                <li className="border-2 rounded-[50%] p-0.5 w-[20px] h-[20px] mx-0.5 bg-red  outline-3 outline-offset-2 "></li>
                <li className="border-2 rounded-[50%] p-0.5 w-[20px] h-[20px] mx-0.5 bg-red  outline-3 outline-offset-2 "></li>
                <li className="border-2 rounded-[50%] p-0.5 w-[20px] h-[20px] mx-0.5 bg-red  outline-3 outline-offset-2 "></li>
                <li className="border-2 rounded-[50%] p-0.5 w-[20px] h-[20px] mx-0.5 bg-red  outline-3 outline-offset-2 "></li>
                <li className="border-2 rounded-[50%] p-0.5 w-[20px] h-[20px] mx-0.5 bg-red  outline-3 outline-offset-2 "></li>
                </ul> */}
            </div>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center">
                <div className="mr-2">陰影顏色</div>
                <ColorAndAlphaPicker
                  rgba={globalTextShadow.rgba}
                  onChange={handleShadowRGBA}
                />
              </div>
              <div className="flex items-center">
                <div className="mr-2">水平位移</div>
                <Counter
                  value={globalTextShadow.dx}
                  max={10}
                  min={-10}
                  onChange={handleShadowX}
                />
              </div>
              <div className="flex items-center">
                <div className="mr-2">垂直位移</div>
                <Counter
                  value={globalTextShadow.dy}
                  max={10}
                  min={-10}
                  onChange={handleShadowY}
                />
              </div>
              <div className="flex items-center">
                <div className="mr-2">模糊程度</div>
                <Counter
                  value={globalTextShadow.blur}
                  max={20}
                  min={0}
                  onChange={handleShadowBlur}
                />
              </div>
            </div>
          </div>
        )}
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
