"use client";
import Button from "../components/button";
import TabSwitcher from "../components/tabSwitcher";
import GlobalEditPanel from "./component/globalEditPanel";
import Canvas, { CanvasRef } from "../components/canvas";
import { useWordCloudStore } from "../lib/wordCloudStore";

// import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import IndividualEditPanel from "../components/style/individualEditPanel";

export default function StylePage() {
  const router = useRouter();
  const composition = useWordCloudStore((s) => s.composition);
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const {
    defaultTextColor,
    textColorPalette,
    textColorMap,
    schemeMode,
    colorSchemes,
    setColorSchemes,
    setRandomTextColor,
  } = useWordCloudStore();
  const canvasRef = useRef<CanvasRef>(null);
  const [currentEditTab, setCurrentEditTab] = useState<string>("global");
  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };

  const handelChangeEditTab = (value: string) => {
    setCurrentEditTab(value);
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
      // if (globalFontStyle.shadow) {
      //   ctx.shadowColor = "rgba(0,0,0,0.5)";
      //   ctx.shadowBlur = 5;
      //   ctx.shadowOffsetX = 2;
      //   ctx.shadowOffsetY = 2;
      // }
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

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3">
        <Button style="hollow" onClick={handleRegenerateWordCloud}>
          重新隨機排列詞彙
        </Button>
        <TabSwitcher
          tabs={[
            { label: "整體樣式", value: "global" },
            // { label: "個別樣式", value: "individual" },
          ]}
          current={currentEditTab}
          onChange={handelChangeEditTab}
          className="px-5"
        />
        {currentEditTab === "global" && <GlobalEditPanel />}
        {currentEditTab === "individual" && <IndividualEditPanel />}
        <div className="flex justify-between">
          <Button style="solid" className="px-5" onClick={handleDownloadSVG}>
            下載SVG
          </Button>
          <Button style="solid" className="px-5" onClick={handleDownloadPNG}>
            下載PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
