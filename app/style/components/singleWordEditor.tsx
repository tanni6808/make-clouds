"use client";
// import { IoMdEye } from "react-icons/io";
// import { IoMdEyeOff } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { FiPlusCircle } from "react-icons/fi";
import ColorPicker from "@/app/components/colorPicker";
import { FontDropdown } from "@/app/components/dropdown";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";
import { FontStyle } from "@/app/lib/definitions";

import { useState, useEffect } from "react";

export default function SingleWordEditor({ text }: { text: string }) {
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const fontStyle = useWordCloudStore((s) => s.fontStyleMap[text]);
  const setFontStyle = useWordCloudStore((s) => s.setSingleFontStyle);
  const delFontStyle = useWordCloudStore((s) => s.clearSingleFontStyle);
  const currentFontStyle = { ...globalFontStyle, ...fontStyle };

  const defaultTextColor = useWordCloudStore((s) => s.defaultTextColor);
  const textColor = useWordCloudStore((s) => s.textColorMap[text]);
  const textColorPalette = useWordCloudStore((s) => s.textColorPalette);
  const setTextColor = useWordCloudStore((s) => s.setTextColor);
  const delTextColor = useWordCloudStore((s) => s.delTextColor);

  // const [showWord, setshowWord] = useState<boolean>(true);
  const [showEditPanel, setShowEditPanel] = useState<boolean>(false);
  const [addFontEditor, setAddFontEditor] = useState<boolean>(
    fontStyle ? true : false
  );
  const [addColorEditor, setAddColorEditor] = useState<boolean>(
    !!(textColor && !textColor.sourceSlotId)
  );
  // const [addShadowEditor, setAddShadowEditor] = useState<boolean>(false);

  const handleFontChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    const updates = {
      fontFamily,
      fontWeight,
    };
    setFontStyle(text, { ...currentFontStyle, ...updates });
  };
  const handleChange = (key: keyof FontStyle, value: any) => {
    const updates = { [key]: value };
    setFontStyle(text, { ...currentFontStyle, ...updates });
  };

  const handleChangeTextColor = (newColor: string) => {
    setTextColor(text, newColor);
  };
  const handleDeleteFontStyle = () => {
    delFontStyle(text);
  };

  const handleDeleteTextColor = () => {
    delTextColor(text);
  };

  useEffect(() => {
    if (!fontStyle) setAddFontEditor(false);
  }, [fontStyle]);

  useEffect(() => {
    setAddColorEditor(!!(textColor && !textColor.sourceSlotId));
  }, [textColor]);

  return (
    <div className="">
      <div
        className={`${
          showEditPanel ? "bg-gray-light" : "bg-gray-md"
        } p-2.5 rounded-md hover:bg-gray-dark flex items-center justify-between`}
        onClick={() => setShowEditPanel((s) => !s)}
      >
        <div className="flex items-center">
          {showEditPanel ? <TbTriangleFilled /> : <TbTriangleInvertedFilled />}
          <div className="pl-2">{text}</div>
        </div>
        {/* {showWord ? (
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
            <div className="my-1 rounded-lg p-[10px] bg-white text-sm relative">
              <MdDelete
                className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
                onClick={handleDeleteFontStyle}
              />
              <div className="text-center mb-[10px]">字型</div>
              <div className="flex flex-col gap-2">
                <FontDropdown
                  value={`${currentFontStyle.fontFamily} ${currentFontStyle.fontWeight}`}
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
                      currentFontStyle.italic
                        ? "bg-primary-dark text-white hover:bg-primary-light"
                        : "bg-gray-light hover:bg-gray-md"
                    }`}
                    onClick={() =>
                      handleChange("italic", !currentFontStyle.italic)
                    }
                  >
                    斜體
                  </button>
                </div>
              </div>
            </div>
          )}
          {addColorEditor && (
            <div className="my-1 rounded-lg p-[10px] bg-white text-sm relative">
              <MdDelete
                className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
                onClick={handleDeleteTextColor}
              />
              <div className="text-center mb-[10px]">文字顏色</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ColorPicker
                    color={textColor.color}
                    onChange={handleChangeTextColor}
                    size="30"
                    pickerLoc={{ x: 0, y: 0 }}
                  />
                  <div className="grow">
                    <div className="p-1 rounded bg-gray-light flex flex-col items-center">
                      <div className="text-xs">樣式色盤</div>
                      <div className="flex gap-0.5">
                        {textColorPalette.length === 0 ? (
                          <div className="text-primary-light">無顏色紀錄</div>
                        ) : (
                          textColorPalette.map((c) => (
                            <div
                              key={c.id}
                              className="w-4 h-4 rounded-sm cursor-pointer"
                              style={{
                                border: "1px solid #545454",
                                backgroundColor: c.color,
                              }}
                              onClick={() => handleChangeTextColor(c.color)}
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

          <div className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer">
            <FiPlusCircle />
            <div className="text-sm ml-2">編輯文字陰影</div>
          </div>
        </div>
      )}
    </div>
  );
}
