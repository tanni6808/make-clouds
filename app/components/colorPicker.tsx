import { useState, useRef, useEffect, memo } from "react";

import { RGBAColor } from "../lib/definitions";
import { ChromePicker } from "react-color";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";

function getTextColorForBackground(hexColor: string): string {
  // 去掉 "#" 開頭
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // YIQ 演算法：計算亮度
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#545454" : "#fff"; // 淺色背景用深字，深色背景用白字
}

export default function ColorPicker({
  color,
  onChange,
  onDelete,
  size = "30",
  pickerLoc = { x: -80, y: 0 },
}: {
  color: string;
  onChange: (newColor: string) => void;
  onDelete?: () => void;
  size?: string;
  pickerLoc?: { x: number; y: number };
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉 color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={pickerRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full flex items-center justify-center transition relative cursor-pointer"
        style={{
          backgroundColor: color,
          border: "2px solid #545454",
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <FontAwesomeIcon
          icon={faPaintBrush}
          className="pointer-events-none select-none"
          style={{
            color: getTextColorForBackground(color),
            textShadow: "0 0 3px rgba(0,0,0,0.3)",
          }}
        />

        {/* 右上角的叉叉 */}
        {hover && onDelete && (
          <div
            onClick={(e) => {
              e.stopPropagation(); // 防止觸發 open
              onDelete();
            }}
            className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-gray-500 text-white text-xs flex items-center justify-center cursor-pointer"
          >
            ×
          </div>
        )}
      </button>

      {/* color picker 彈出視窗 */}
      {open && (
        <div
          className="absolute z-50 mt-2"
          style={{ transform: `translate(${pickerLoc.x}%, ${pickerLoc.y}%)` }}
        >
          <ChromePicker
            styles={{
              default: {
                picker: {
                  width: "150px",
                },
              },
            }}
            color={color}
            onChange={(colorResult) => onChange(colorResult.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
}

export const ColorAndAlphaPicker = memo(function ColorAndAlphaPicker({
  rgba,
  onChange,
  width = 76,
  pickerLoc = { x: -80, y: -120 },
}: {
  rgba: RGBAColor;
  onChange: (newColor: RGBAColor) => void;
  width?: number;
  pickerLoc?: { x: number; y: number };
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} className="">
      <div
        className="flex items-center bg-gray-light x-2 py-1.5 rounded cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div
          className="rounded-full border-2 w-[20px] h-[20px] mx-2"
          style={{ backgroundColor: `rgb(${rgba.r},${rgba.g},${rgba.b})` }}
        ></div>
        <div
          className="text-sm flex justify-end items-center border-l-2 border-gray-dark px-3"
          style={{ width: `${width}px` }}
        >
          <div className="">{rgba.a ? Math.floor(rgba.a * 100) : 0}</div>
          <div className="">％</div>
        </div>
      </div>
      {open && (
        <div
          className="absolute z-50 mt-2"
          style={{ transform: `translate(${pickerLoc.x}%, ${pickerLoc.y}%)` }}
        >
          <ChromePicker
            styles={{
              default: {
                picker: {
                  width: "150px",
                },
              },
            }}
            color={rgba}
            onChange={(colorResult) => onChange(colorResult.rgb)}
          />
        </div>
      )}
    </div>
  );
});
