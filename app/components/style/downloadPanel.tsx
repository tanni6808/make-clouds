///////////// DL NOT WORK

import Button from "../button";
import { CanvasRef } from "../canvas";
import { useEffect } from "react";

type DownloadPanelProps = {
  canvasRef: React.RefObject<CanvasRef>;
};

export default function DownloadPanel({ canvasRef }: DownloadPanelProps) {
  const handleDownloadSVG = () => {
    const svgRef = canvasRef.current?.getSvgRef();
    if (!svgRef) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
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
    const svgRef = canvasRef.current?.getSvgRef();
    if (!svgRef) return;

    const svgData = new XMLSerializer().serializeToString(svgRef);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    const width = svgRef.clientWidth;
    const height = svgRef.clientHeight;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff"; // 可選：設定背景色為白色
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "wordcloud.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };

    image.src = url;
  };
  useEffect(() => {
    const svgRef = canvasRef.current?.getSvgRef();
    console.log("svg ref is:", svgRef);
  }, []);

  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px] flex flex-col justify-between">
      <div className="text-center">下載文字雲</div>
      <div className="flex justify-between">
        <Button style="solid" className="w-[45%]" onClick={handleDownloadSVG}>
          SVG
        </Button>
        <Button style="solid" className="w-[45%]" onClick={handleDownloadPNG}>
          PNG
        </Button>
      </div>
    </div>
  );
}
