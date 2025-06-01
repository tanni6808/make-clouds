"use client";
import Button from "../components/button";
import { CustomDropdown, FontDropdown } from "../components/dropdown";
import Canvas, { CanvasRef } from "../components/canvas";
// import FontPanel from "../components/style/fontPanel";
import ColorPanel from "../components/style/colorPanel";
// import WordsList from "../components/style/wordList";
import { useWordCloudStore } from "../lib/wordCloudStore";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { FontStyle } from "../lib/definitions";

export default function StylePage() {
  const router = useRouter();
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const setGlobalFontStyle = useWordCloudStore((s) => s.setGlobalFontStyle);
  const {
    composition,
    baseTextColor,
    textColorMap,
    schemeMode,
    colorSchemes,
    setBaseTextColor,
    setColorSchemes,
    setRandomColorsFromScheme,
  } = useWordCloudStore();
  const canvasRef = useRef<CanvasRef>(null);
  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };

  const handleChange = (key: keyof FontStyle, value: any) => {
    setGlobalFontStyle({ ...globalFontStyle, [key]: value });
  };
  const handleFontChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    setGlobalFontStyle({
      ...globalFontStyle,
      fontFamily,
      fontWeight,
    });
  };
  const handleDownloadSVG = () => {
    const words = canvasRef.current?.getWordComposition();
    if (!words || words.length === 0) return;

    // 計算 SVG 寬高
    const padding = 50;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x + w.width));
    const minY = Math.min(...words.map((w) => w.y - w.height));
    const maxY = Math.max(...words.map((w) => w.y));

    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <filter id="text-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <g>
        ${words
          .map(
            (word) => `
            <text
              x="${word.x - minX + padding}"
              y="${word.y - minY + padding}"
              font-size="${word.fontSize}"
              font-family="${globalFontStyle.fontFamily}"
              font-weight="${globalFontStyle.fontWeight}"
              font-style="${globalFontStyle.italic ? "italic" : "normal"}"
              fill="${textColorMap[word.text].color || "#545454"}"
              filter="${globalFontStyle.shadow ? "url(#text-shadow)" : ""}"
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

    const padding = 50;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x + w.width));
    const minY = Math.min(...words.map((w) => w.y - w.height));
    const maxY = Math.max(...words.map((w) => w.y));
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgb(255 255 255 / 0%)"; // "rgb(255 255 255)";
    ctx.fillRect(0, 0, width, height);

    words.forEach((word) => {
      if (globalFontStyle.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      ctx.font = `${globalFontStyle.italic ? "italic" : ""} ${
        globalFontStyle.fontWeight
      } ${word.fontSize}px ${globalFontStyle.fontFamily}`;
      ctx.fillStyle = textColorMap[word.text]?.color || "#545454";
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

  useEffect(() => {
    if (schemeMode === "none") {
      setColorSchemes([]);
      setRandomColorsFromScheme();
      return;
    }

    const fetchColorSchemes = async () => {
      const schemeAndCount = [
        { scheme: "monochrome", count: "3" },
        { scheme: "analogic", count: "3" },
        { scheme: "complement", count: "2" },
        { scheme: "triad", count: "3" },
        { scheme: "quad", count: "4" },
      ];
      const hex = baseTextColor.replace("#", "");
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
      setRandomColorsFromScheme(); // 更新詞彙顏色
    };

    fetchColorSchemes();
  }, [baseTextColor, schemeMode]);

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_auto_auto_1fr_100px] gap-3">
        <div className="text-center">整體樣式編輯</div>
        <Button style="hollow" onClick={handleRegenerateWordCloud}>
          重新隨機排列詞彙
        </Button>
        {/* <WordsList></WordsList> */}
        <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
          <div className="text-center mb-[10px]">字型</div>
          <div className="flex flex-col gap-2">
            <FontDropdown
              value={`${globalFontStyle.fontFamily} ${globalFontStyle.fontWeight}`}
              onChange={(val) => handleFontChange(val)}
              options={[
                { label: "思源黑體 Light", value: "Noto Sans TC 300" },
                { label: "思源黑體 Regular", value: "Noto Sans TC 400" },
                { label: "思源黑體 Bold", value: "Noto Sans TC 700" },
                { label: "思源黑體 Black", value: "Noto Sans TC 900" },
                { label: "思源宋體 Light", value: "Noto Serif TC 300" },
                { label: "思源宋體 Regular", value: "Noto Serif TC 400" },
                { label: "思源宋體 Bold", value: "Noto Serif TC 700" },
                { label: "思源宋體 Black", value: "Noto Serif TC 900" },
                {
                  label: "朱古力黑體 Regular",
                  value: "Chocolate Classical Sans 400",
                },
                { label: "霞鶩文楷 Light", value: "LXGW WenKai TC 300" },
                { label: "霞鶩文楷 Regular", value: "LXGW WenKai TC 400" },
                { label: "霞鶩文楷 Bold", value: "LXGW WenKai TC 700" },
                {
                  label: "仙人掌明體 Regular",
                  value: "Cactus Classical Serif 400",
                },
              ]}
            ></FontDropdown>
            <div className="grid grid-cols-[1fr_1fr] gap-2">
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
              <button
                className={`text-center rounded-lg h-[40px] text-shadow-lg ${
                  globalFontStyle.shadow
                    ? "bg-primary-dark text-white hover:bg-primary-light"
                    : "bg-gray-light hover:bg-gray-md"
                }`}
                onClick={() => handleChange("shadow", !globalFontStyle.shadow)}
              >
                陰影
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
