"use client";
// import { IoMdEye } from "react-icons/io";
// import { IoMdEyeOff } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { FiPlusCircle } from "react-icons/fi";
import ColorPicker, { ColorAndAlphaPicker } from "@/app/components/colorPicker";
import Counter from "@/app/components/counter";
import { FontDropdown } from "@/app/components/dropdown";
import { useWordCloudStore } from "@/app/lib/useWordCloudStore";
import { FontStyle, RGBAColor } from "@/app/lib/definitions";

import { useState, useEffect } from "react";

export default function SingleWordEditor({ text }: { text: string }) {
  const selectedWord = useWordCloudStore((s) => s.selectedWord);
  // 編輯區塊
  const [showEditPanel, setShowEditPanel] = useState<boolean>(false);
  useEffect(() => {
    if (selectedWord === text) {
      setShowEditPanel(true);
    } else setShowEditPanel(false);
  }, [selectedWord]);

  // 字型
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const fontStyle = useWordCloudStore((s) => s.fontStyleMap[text]);
  const setFontStyle = useWordCloudStore((s) => s.setSingleFontStyle);
  const delFontStyle = useWordCloudStore((s) => s.deleteSingleFontStyle);
  const currentFontStyle = { ...globalFontStyle, ...fontStyle };

  const [addFontEditor, setAddFontEditor] = useState<boolean>(
    fontStyle ? true : false
  );

  const handleFontFamilyAndWeightChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    const updates = {
      fontFamily,
      fontWeight,
    };
    setFontStyle(text, { ...currentFontStyle, ...updates });
  };
  const handleFontStyleChange = (key: keyof FontStyle, value: any) => {
    const updates = { [key]: value };
    setFontStyle(text, { ...currentFontStyle, ...updates });
  };
  const handleFontStyleDelete = () => {
    delFontStyle(text);
  };

  useEffect(() => {
    if (!fontStyle) setAddFontEditor(false);
  }, [fontStyle]);

  // 文字顏色
  const defaultTextColor = useWordCloudStore((s) => s.defaultTextColor);
  const textColor = useWordCloudStore((s) => s.textColorMap[text]);
  const textColorPalette = useWordCloudStore((s) => s.textColorPalette);
  const setTextColor = useWordCloudStore((s) => s.setTextColor);
  const delTextColor = useWordCloudStore((s) => s.delTextColor);
  const currentTextColor = textColor?.color ?? defaultTextColor;

  const [addColorEditor, setAddColorEditor] = useState<boolean>(
    !!(textColor && !textColor.sourceSlotId)
  );

  const handleTextColorChange = (newColor: string) => {
    setTextColor(text, newColor);
  };
  const handleTextColorDelete = () => {
    delTextColor(text);
  };

  useEffect(() => {
    setAddColorEditor(!!(textColor && !textColor.sourceSlotId));
  }, [textColor]);

  // 陰影
  const globalTextShadow = useWordCloudStore((s) => s.globalTextShadow);
  const textShadow = useWordCloudStore((s) => s.textShadowMap[text]);
  const setTextShadow = useWordCloudStore((s) => s.setTextShadow);
  const delTextShadow = useWordCloudStore((s) => s.deleteSingleTextShadow);
  const currentTextShadow = { ...globalTextShadow, ...textShadow };

  const [addShadowEditor, setAddShadowEditor] = useState<boolean>(
    textShadow ? true : false
  );

  const handleShadowRGBA = (newColor: RGBAColor) => {
    setTextShadow(text, { ...currentTextShadow, rgba: newColor });
  };
  const handleShadowX = (newDx: number) => {
    setTextShadow(text, { ...currentTextShadow, dx: newDx });
  };
  const handleShadowY = (newDy: number) => {
    setTextShadow(text, { ...currentTextShadow, dy: newDy });
  };
  const handleShadowBlur = (newBlur: number) => {
    setTextShadow(text, { ...currentTextShadow, blur: newBlur });
  };
  const handleTextShadowDelete = () => {
    delTextShadow(text);
  };

  useEffect(() => {
    if (!textShadow) setAddShadowEditor(false);
  }, [textShadow]);

  // TODO 顯示/隱藏詞彙
  // const [showWord, setshowWord] = useState<boolean>(true);

  return (
    <div className="">
      <div
        className={`${
          showEditPanel ? "bg-gray-light" : "bg-gray-md"
        } p-2.5 rounded-md hover:bg-gray-dark flex items-center justify-between`}
        onClick={() => setShowEditPanel((s) => !s)}
        data-word={text}
      >
        <div className="flex items-center">
          {showEditPanel ? <TbTriangleFilled /> : <TbTriangleInvertedFilled />}
          <div className="pl-2">{text}</div>
        </div>
        {/* //TODO {showWord ? (
          <IoMdEye
            className="text-xl hover:text-primary-light active:text-black"
            onClick={(e) => {
              e.stopPropagation();
              setshowWord((s) => !s);
            }}
          />
        ) : (
          <IoMdEyeOff
            className="text-xl hover:text-primary-light active:text-black"
            onClick={(e) => {
              e.stopPropagation();
              setshowWord((s) => !s);
            }}
          />
        )} */}
      </div>
      {showEditPanel && (
        <div className="bg-gray-light mt-1 rounded p-[10px]">
          {addFontEditor && (
            <div className="my-2 rounded-lg p-[10px] bg-white text-sm relative">
              <MdDelete
                className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
                onClick={handleFontStyleDelete}
              />
              <div className="text-center mb-[10px]">字型</div>
              <div className="flex flex-col gap-2">
                <FontDropdown
                  value={`${currentFontStyle.fontFamily} ${currentFontStyle.fontWeight}`}
                  onChange={(val) => handleFontFamilyAndWeightChange(val)}
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
                      currentFontStyle.italic
                        ? "bg-primary-dark text-white hover:bg-primary-light"
                        : "bg-gray-light hover:bg-gray-md"
                    }`}
                    onClick={() =>
                      handleFontStyleChange("italic", !currentFontStyle.italic)
                    }
                  >
                    斜體
                  </button>
                </div>
              </div>
            </div>
          )}
          {addColorEditor && (
            <div className="my-2 rounded-lg p-[10px] bg-white text-sm relative">
              <MdDelete
                className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
                onClick={handleTextColorDelete}
              />
              <div className="text-center mb-[10px]">文字顏色</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ColorPicker
                    color={currentTextColor}
                    onChange={handleTextColorChange}
                    size="30"
                    pickerLoc={{ x: 0, y: 0 }}
                  />
                  <div className="grow">
                    <div className="p-1 rounded bg-gray-light flex flex-col items-center">
                      <div className="text-xs mb-1">已使用的顏色</div>
                      <div className="flex gap-0.5">
                        {textColorPalette.length === 0 ? (
                          <div className="text-primary-light">無</div>
                        ) : (
                          textColorPalette.map((c) => (
                            <div
                              key={c.id}
                              className="w-4 h-4 rounded-sm cursor-pointer"
                              style={{
                                border: "1px solid #545454",
                                backgroundColor: c.color,
                              }}
                              onClick={() => handleTextColorChange(c.color)}
                            ></div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {addShadowEditor && (
            <div className="my-2 rounded-lg p-[10px] bg-white text-sm relative">
              <MdDelete
                className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
                onClick={handleTextShadowDelete}
              />
              <div className="text-center">文字陰影</div>
              <div className="flex flex-col gap-1 py-2">
                <div className="flex items-center">
                  <div className="mr-2">顏色</div>
                  <ColorAndAlphaPicker
                    rgba={currentTextShadow.rgba}
                    onChange={handleShadowRGBA}
                    width={68}
                    pickerLoc={{ x: -20, y: 0 }}
                  />
                </div>
                <div className="flex items-center">
                  <div className="mr-2">水平</div>
                  <Counter
                    value={currentTextShadow.dx}
                    max={10}
                    min={-10}
                    onChange={handleShadowX}
                    width={52}
                  />
                </div>
                <div className="flex items-center">
                  <div className="mr-2">垂直</div>
                  <Counter
                    value={currentTextShadow.dy}
                    max={10}
                    min={-10}
                    onChange={handleShadowY}
                    width={52}
                  />
                </div>
                <div className="flex items-center">
                  <div className="mr-2">模糊</div>
                  <Counter
                    value={currentTextShadow.blur}
                    max={20}
                    min={0}
                    onChange={handleShadowBlur}
                    width={52}
                  />
                </div>
              </div>
            </div>
          )}
          {!addFontEditor && (
            <div
              className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer"
              onClick={() => {
                setFontStyle(text, { ...currentFontStyle });
                setAddFontEditor((s) => !s);
              }}
            >
              <FiPlusCircle />
              <div className="text-sm ml-2">編輯字型</div>
            </div>
          )}
          {!addColorEditor && (
            <div
              className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer"
              onClick={() => {
                setTextColor(text, defaultTextColor);
                setAddColorEditor((s) => !s);
              }}
            >
              <FiPlusCircle />
              <div className="text-sm ml-2">編輯文字顏色</div>
            </div>
          )}
          {!addShadowEditor && (
            <div
              className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer"
              onClick={() => {
                setTextShadow(text, { ...currentTextShadow });
                setAddShadowEditor((s) => !s);
              }}
            >
              <FiPlusCircle />
              <div className="text-sm ml-2">編輯文字陰影</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
