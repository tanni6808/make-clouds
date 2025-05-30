"use client";
import Button from "../components/button";
import Canvas, { CanvasRef } from "../components/canvas";
// import FontPanel from "../components/style/fontPanel";
// import ColorPanel from "../components/style/colorPanel";
import WordsList from "../components/style/wordList";

import { useRef, useEffect } from "react";

export default function StylePage() {
  const canvasRef = useRef<CanvasRef>(null);
  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };
  const handleDownloadSVG = () => {
    const words = canvasRef.current?.getWordComposition();
    if (!words || words.length === 0) return;

    // 動態計算 SVG 寬高範圍
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
              font-family="Noto Sans TC"
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
      ctx.font = `bold ${word.fontSize}px Noto Sans TC`;
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
    const svg = canvasRef.current?.getSvgRef();
    console.log("svg ref is:", svg);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_auto_1fr_auto_100px] gap-3">
        <Button style="hollow" onClick={handleRegenerateWordCloud}>
          重新隨機排列詞彙
        </Button>
        <WordsList></WordsList>
        {/* <FontPanel />
        <ColorPanel /> */}
        <Button style="hollow">編輯單一詞彙樣式</Button>
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
