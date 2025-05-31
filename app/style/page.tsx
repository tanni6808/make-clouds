"use client";
import Button from "../components/button";
import { CustomDropdown } from "../components/dropdown";
import Canvas, { CanvasRef } from "../components/canvas";
// import FontPanel from "../components/style/fontPanel";
import ColorPanel from "../components/style/colorPanel";
// import WordsList from "../components/style/wordList";
import { useWordCloudStore } from "../lib/wordCloudStore";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FontStyle } from "../lib/definitions";

import {
  Noto_Sans_TC,
  Noto_Serif_TC,
  Chocolate_Classical_Sans,
  LXGW_WenKai_TC,
  Cactus_Classical_Serif,
} from "next/font/google";

const notoSansTC = Noto_Sans_TC({
  weight: ["100", "300", "500", "700", "900"],
  subsets: ["latin"],
});

const notoSerifTC = Noto_Serif_TC({
  weight: ["300", "600", "900"],
  subsets: ["latin"],
});

const chocoClassicalSans = Chocolate_Classical_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

const lxgwWKTC = LXGW_WenKai_TC({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const cactusClassicalSerif = Cactus_Classical_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

export default function StylePage() {
  const router = useRouter();
  const defaultFontStyle = useWordCloudStore((s) => s.defaultFontStyle);
  const setDefaultFontStyle = useWordCloudStore((s) => s.setDefaultFontStyle);
  const { composition } = useWordCloudStore();
  const canvasRef = useRef<CanvasRef>(null);
  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };

  const handleChange = (key: keyof FontStyle, value: any) => {
    setDefaultFontStyle({ ...defaultFontStyle, [key]: value });
  };
  const handleDownloadSVG = () => {
    const words = canvasRef.current?.getWordComposition();
    if (!words || words.length === 0) return;

    // 計算 SVG 寬高
    const padding = 100;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x));
    const minY = Math.min(...words.map((w) => w.y));
    const maxY = Math.max(...words.map((w) => w.y));

    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g>
        ${words
          .map(
            (word) => `
            <text
              x="${word.x - minX + padding}"
              y="${word.y - minY + padding}"
              font-size="${word.fontSize}"
              font-family="${defaultFontStyle.fontFamily}"
              fill="#545454"
              font-weight="bold"
            >
              ${word.text}
            </text>
          `
          )
          .join("")}
      </g>
    </svg>
  `;

    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordcloud.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const words = canvasRef.current?.getWordComposition();
    if (!words || words.length === 0) return;

    const padding = 100;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x));
    const minY = Math.min(...words.map((w) => w.y));
    const maxY = Math.max(...words.map((w) => w.y));
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgb(255 255 255 / 0%)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#545454";

    words.forEach((word) => {
      ctx.font = `bold ${word.fontSize}px ${defaultFontStyle.fontFamily}`;
      ctx.fillText(word.text, word.x - minX + padding, word.y - minY + padding);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "wordcloud.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };
  useEffect(() => {
    if (composition.length === 0) {
      // TODO 初始化
      return router.push("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_auto_auto_1fr_100px] gap-3">
        <Button style="hollow" onClick={handleRegenerateWordCloud}>
          重新隨機排列詞彙
        </Button>
        <div className="text-center">整體樣式編輯</div>
        {/* <WordsList></WordsList> */}
        <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
          <div className="text-center mb-[10px]">字型</div>
          <div className="flex flex-col gap-2">
            <CustomDropdown
              value={defaultFontStyle.fontFamily}
              onChange={(val) => handleChange("fontFamily", val)}
              options={[
                { label: "思源黑體", value: "Noto Sans TC" },
                { label: "思源宋體", value: "Noto Serif TC" },
                { label: "朱古力黑體", value: "Chocolate Classical Sans" },
                { label: "霞鶩文楷", value: "LXGW WenKai TC" },
                { label: "仙人掌明體", value: "Cactus Classical Serif" },
              ]}
              className="w-[100%]"
            ></CustomDropdown>
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
              <button
                className={`text-center rounded-lg h-[40px] text-shadow-lg ${
                  defaultFontStyle.shadow
                    ? "bg-primary-dark text-white hover:bg-primary-light"
                    : "bg-gray-light hover:bg-gray-md"
                }`}
                onClick={() => handleChange("shadow", !defaultFontStyle.shadow)}
              >
                陰影
              </button>
              <button
                className={`text-center rounded-lg h-[40px] italic ${
                  defaultFontStyle.italic
                    ? "bg-primary-dark text-white hover:bg-primary-light"
                    : "bg-gray-light hover:bg-gray-md"
                }`}
                onClick={() => handleChange("italic", !defaultFontStyle.italic)}
              >
                斜體
              </button>
              <button
                className={`text-center rounded-lg h-[40px] underline ${
                  defaultFontStyle.underline
                    ? "bg-primary-dark text-white hover:bg-primary-light"
                    : "bg-gray-light hover:bg-gray-md"
                }`}
                onClick={() =>
                  handleChange("underline", !defaultFontStyle.underline)
                }
              >
                底線
              </button>
            </div>
          </div>
        </div>
        <ColorPanel />
        <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px] flex flex-col justify-between">
          <div className="text-center">下載文字雲</div>
          <div className="flex justify-between">
            <Button
              style="solid"
              className="w-[45%]"
              onClick={handleDownloadSVG}
            >
              SVG
            </Button>
            <Button
              style="solid"
              className="w-[45%]"
              onClick={handleDownloadPNG}
            >
              PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
